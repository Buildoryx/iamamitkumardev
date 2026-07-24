import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { serializeTags, mapDbToPost } from "@/lib/blog";
import { validateAndSanitizePostInput } from "@/lib/validation";
import { sanitizeMarkdown } from "@/lib/security";
import { getEnv } from "@/lib/env";
import { verifyAgentRequest, statusForReason } from "@/lib/agent-hmac";
import { logAgentBlogEvent } from "@/lib/agent-audit";
import { submitToIndexNow } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

const AGENT_AUTHOR_ID = "hermes-agent";
const ROUTE_PATH = "/api/agents/blog/posts";

/**
 * POST /api/agents/blog/posts
 * Create AND publish a live blog post from the Hermes agent.
 * HMAC-signed. No delete capability exists in this namespace.
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  // Read raw body exactly as received — required for body-hash verification.
  const rawBody = await req.text();

  const verify = await verifyAgentRequest(
    "POST",
    ROUTE_PATH,
    req.headers,
    rawBody,
  );
  if (!verify.ok) {
    const httpStatus = statusForReason(verify.reason);
    await logAgentBlogEvent({
      action: "create",
      status: verify.reason === "config" ? "error" : "rejected",
      requestId,
      httpStatus,
      message: `auth ${verify.reason}: ${verify.message}`,
    });
    return NextResponse.json(
      { error: verify.message, request_id: requestId },
      { status: httpStatus },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    await logAgentBlogEvent({
      action: "create",
      status: "rejected",
      keyId: verify.keyId,
      requestId,
      httpStatus: 400,
      message: "invalid JSON body",
    });
    return NextResponse.json(
      { error: "Invalid JSON body", request_id: requestId },
      { status: 400 },
    );
  }

  const validation = validateAndSanitizePostInput(body);
  if (!validation.success) {
    await logAgentBlogEvent({
      action: "create",
      status: "rejected",
      keyId: verify.keyId,
      requestId,
      httpStatus: 400,
      validationErrors: validation.errors,
      message: "validation failed",
    });
    return NextResponse.json(
      { error: validation.errors.join(", "), request_id: requestId },
      { status: 400 },
    );
  }

  const {
    title,
    slug,
    content,
    excerpt,
    coverImage,
    tags,
    metaTitle,
    metaDescription,
  } = validation.data!;

  // Cover image, if provided, must be an http(s) URL (validation enforces
  // SAFE_URL_REGEX). Supabase public storage URLs satisfy this.
  const sanitizedContent = sanitizeMarkdown(content);
  // Agent create always publishes live. The shared admin validator defaults
  // status to "draft", so do not trust that default for this agent route.
  const publishedAt = new Date().toISOString();

  try {
    const supabase = getSupabaseAdmin();
    const { data: newPost, error } = await supabase
      .from("post")
      .insert({
        id: crypto.randomUUID(),
        title,
        slug,
        content: sanitizedContent,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        status: "published",
        tags: tags ? serializeTags(tags) : null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        authorId: AGENT_AUTHOR_ID,
        publishedAt,
        createdAt: publishedAt,
        updatedAt: publishedAt,
      })
      .select()
      .single();

    if (error) {
      if ((error as { code?: string }).code === "23505") {
        await logAgentBlogEvent({
          action: "create",
          status: "rejected",
          keyId: verify.keyId,
          requestId,
          slug,
          httpStatus: 409,
          message: "slug already exists",
        });
        return NextResponse.json(
          {
            error: "A post with this slug already exists",
            request_id: requestId,
          },
          { status: 409 },
        );
      }
      throw error;
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/feed.xml");

    // Agent-created posts publish live — ping IndexNow (Bing/Yandex → AI engines).
    void submitToIndexNow([`/blog/${slug}`, "/blog"]);

    await logAgentBlogEvent({
      action: "create",
      status: "success",
      keyId: verify.keyId,
      requestId,
      slug,
      postId: newPost.id,
      httpStatus: 200,
      message: "published=true",
    });

    return NextResponse.json({
      ...mapDbToPost(newPost),
      request_id: requestId,
    });
  } catch (err) {
    await logAgentBlogEvent({
      action: "create",
      status: "error",
      keyId: verify.keyId,
      requestId,
      slug,
      httpStatus: 500,
      message: err instanceof Error ? err.message : "unknown error",
    });
    return NextResponse.json(
      { error: "Failed to create post", request_id: requestId },
      { status: 500 },
    );
  }
}

// Intentionally NO DELETE export. Agents cannot delete posts.
