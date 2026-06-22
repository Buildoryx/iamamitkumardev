import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getEnv } from "@/lib/env";
import { verifyAgentRequest, statusForReason } from "@/lib/agent-hmac";
import { logAgentBlogEvent } from "@/lib/agent-audit";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ROUTE_PATH = "/api/agents/blog/media";
const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

/**
 * POST /api/agents/blog/media
 * Upload a generated image to Supabase Storage and return its public URL.
 *
 * Body (JSON, so HMAC body-hash is consistent with the other endpoints):
 *   { "imageBase64": "<base64>", "contentType": "image/png", "filename"?: "..." }
 *
 * HMAC-signed. No delete capability.
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  // Raw body string is what the client hashed; verify over the exact bytes.
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
      action: "media_upload",
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

  let body: { imageBase64?: string; contentType?: string; filename?: string };
  try {
    body = JSON.parse(rawBody);
  } catch {
    await logAgentBlogEvent({
      action: "media_upload",
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

  const { imageBase64, contentType } = body;
  if (!imageBase64 || typeof imageBase64 !== "string") {
    return reject(requestId, verify.keyId, 400, "imageBase64 is required");
  }
  if (!contentType || !ALLOWED[contentType]) {
    return reject(
      requestId,
      verify.keyId,
      400,
      "contentType must be one of image/jpeg, image/png, image/gif, image/webp",
    );
  }

  // Decode base64 (strip any data: URL prefix).
  let buffer: Buffer;
  try {
    const b64 = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;
    buffer = Buffer.from(b64, "base64");
  } catch {
    return reject(requestId, verify.keyId, 400, "invalid base64 image data");
  }

  if (buffer.length === 0) {
    return reject(requestId, verify.keyId, 400, "empty image data");
  }
  if (buffer.length > MAX_BYTES) {
    return reject(requestId, verify.keyId, 400, "image too large (max 5MB)");
  }

  // Magic-byte check — the real file type must match the claimed contentType.
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED[detected.mime]) {
    return reject(
      requestId,
      verify.keyId,
      400,
      "file content is not a supported image (magic-byte check failed)",
    );
  }
  if (detected.mime !== contentType) {
    return reject(
      requestId,
      verify.keyId,
      400,
      `contentType (${contentType}) does not match actual file type (${detected.mime})`,
    );
  }

  const ext = ALLOWED[detected.mime];
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const objectPath = `hermes/${yyyy}/${mm}/${crypto.randomUUID()}.${ext}`;
  const bucket = getEnv().SUPABASE_BLOG_MEDIA_BUCKET ?? "blog-media";

  try {
    const supabase = getSupabaseAdmin();
    const { error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(objectPath, buffer, {
        contentType: detected.mime,
        upsert: false, // never overwrite — unique uuid paths
      });
    if (uploadErr) throw uploadErr;

    const { data: pub } = supabase.storage
      .from(bucket)
      .getPublicUrl(objectPath);
    const publicUrl = pub.publicUrl;

    await logAgentBlogEvent({
      action: "media_upload",
      status: "success",
      keyId: verify.keyId,
      requestId,
      mediaUrl: publicUrl,
      httpStatus: 200,
      message: `${detected.mime} ${buffer.length}B -> ${objectPath}`,
    });

    return NextResponse.json({
      url: publicUrl,
      path: objectPath,
      contentType: detected.mime,
      bytes: buffer.length,
      request_id: requestId,
    });
  } catch (err) {
    await logAgentBlogEvent({
      action: "media_upload",
      status: "error",
      keyId: verify.keyId,
      requestId,
      httpStatus: 500,
      message: err instanceof Error ? err.message : "upload failed",
    });
    return NextResponse.json(
      { error: "Failed to upload media", request_id: requestId },
      { status: 500 },
    );
  }
}

async function reject(
  requestId: string,
  keyId: string,
  httpStatus: number,
  message: string,
) {
  await logAgentBlogEvent({
    action: "media_upload",
    status: "rejected",
    keyId,
    requestId,
    httpStatus,
    message,
  });
  return NextResponse.json(
    { error: message, request_id: requestId },
    { status: httpStatus },
  );
}

// Intentionally NO DELETE export. Agents cannot delete media.
