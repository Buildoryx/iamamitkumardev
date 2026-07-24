import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { serializeTags, mapDbToPost } from "@/lib/blog";
import { validateAndSanitizePostInput } from "@/lib/validation";
import { sanitizeMarkdown } from "@/lib/security";
import { verifyAgentRequest, statusForReason } from "@/lib/agent-hmac";
import { logAgentBlogEvent } from "@/lib/agent-audit";
import { submitToIndexNow } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

/**
 * PUT /api/agents/blog/posts/[slug]
 * Update ANY existing blog post (including human-written posts), per spec.
 * HMAC-signed. No delete capability.
 */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const requestId = crypto.randomUUID();
  const { slug: routeSlug } = await context.params;
  const routePath = `/api/agents/blog/posts/${routeSlug}`;

  const rawBody = await req.text();

  const verify = await verifyAgentRequest(
    "PUT",
    routePath,
    req.headers,
    rawBody,
  );
  if (!verify.ok) {
    const httpStatus = statusForReason(verify.reason);
    await logAgentBlogEvent({
      action: "update",
      status: verify.reason === "config" ? "error" : "rejected",
      requestId,
      slug: routeSlug,
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
      action: "update",
      status: "rejected",
      keyId: verify.keyId,
      requestId,
      slug: routeSlug,
      httpStatus: 400,
      message: "invalid JSON body",
    });
    return NextResponse.json(
      { error: "Invalid JSON body", request_id: requestId },
      { status: 400 },
    );
  }

  const hasExplicitStatus =
    body !== null &&
    typeof body === "object" &&
    Object.prototype.hasOwnProperty.call(body, "status");

  const validation = validateAndSanitizePostInput(body);
  if (!validation.success) {
    await logAgentBlogEvent({
      action: "update",
      status: "rejected",
      keyId: verify.keyId,
      requestId,
      slug: routeSlug,
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
    status,
    tags,
    metaTitle,
    metaDescription,
  } = validation.data!;

  const sanitizedContent = sanitizeMarkdown(content);

  try {
    const supabase = getSupabaseAdmin();

    // Find the existing post by its current (route) slug.
    const { data: existing, error: findErr } = await supabase
      .from("post")
      .select("*")
      .eq("slug", routeSlug)
      .limit(1);
    if (findErr) throw findErr;
    if (!existing || existing.length === 0) {
      await logAgentBlogEvent({
        action: "update",
        status: "rejected",
        keyId: verify.keyId,
        requestId,
        slug: routeSlug,
        httpStatus: 404,
        message: "post not found",
      });
      return NextResponse.json(
        { error: "Post not found", request_id: requestId },
        { status: 404 },
      );
    }

    const prev = existing[0] as {
      id: string;
      status: string;
      publishedAt: string | null;
    };
    const effectiveStatus = hasExplicitStatus ? status : prev.status;
    const isPublished = effectiveStatus === "published";
    // Set publishedAt when first publishing; preserve existing otherwise.
    const publishedAt =
      isPublished && !prev.publishedAt
        ? new Date().toISOString()
        : prev.publishedAt;

    const { data: updated, error } = await supabase
      .from("post")
      .update({
        title,
        slug, // allows slug change; unique constraint guards collisions
        content: sanitizedContent,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        status: effectiveStatus,
        tags: tags ? serializeTags(tags) : null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        publishedAt,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", prev.id)
      .select()
      .single();

    if (error) {
      if ((error as { code?: string }).code === "23505") {
        await logAgentBlogEvent({
          action: "update",
          status: "rejected",
          keyId: verify.keyId,
          requestId,
          slug,
          postId: prev.id,
          httpStatus: 409,
          message: "target slug already exists",
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

    // Revalidate both old and new slug paths (slug may have changed).
    revalidatePath("/blog");
    revalidatePath(`/blog/${routeSlug}`);
    if (slug !== routeSlug) revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/feed.xml");

    if (isPublished) void submitToIndexNow([`/blog/${slug}`, "/blog"]);

    await logAgentBlogEvent({
      action: "update",
      status: "success",
      keyId: verify.keyId,
      requestId,
      slug,
      postId: prev.id,
      httpStatus: 200,
      message: `status=${effectiveStatus}`,
    });

    return NextResponse.json({
      ...mapDbToPost(updated),
      request_id: requestId,
    });
  } catch (err) {
    await logAgentBlogEvent({
      action: "update",
      status: "error",
      keyId: verify.keyId,
      requestId,
      slug: routeSlug,
      httpStatus: 500,
      message: err instanceof Error ? err.message : "unknown error",
    });
    return NextResponse.json(
      { error: "Failed to update post", request_id: requestId },
      { status: 500 },
    );
  }
}

// Intentionally NO DELETE export. Agents cannot delete posts.
