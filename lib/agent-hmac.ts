import "server-only";
import crypto from "crypto";
import { getEnv } from "./env";
import { getSupabaseAdmin } from "./supabase";

/**
 * HMAC request authentication for the Hermes agent blog API.
 *
 * Security model (per spec):
 *  - Fail closed: if signing secret/key id are missing, every verify fails
 *    with a server-side configuration error (NOT public access).
 *  - Canonical string = METHOD\nPATH\nTIMESTAMP\nNONCE\nBODY_SHA256
 *  - Timing-safe HMAC-SHA256 comparison.
 *  - Stale timestamps rejected (HERMES_MAX_CLOCK_SKEW_SECONDS).
 *  - Body hash verified against x-agent-content-sha256.
 *  - Nonce replay protection: Redis if REDIS_URL, else Supabase
 *    agent_request_nonce table.
 *
 * Headers (all required):
 *  x-agent-key-id, x-agent-timestamp, x-agent-nonce,
 *  x-agent-content-sha256, x-agent-signature
 */

export const AGENT_HEADERS = {
  keyId: "x-agent-key-id",
  timestamp: "x-agent-timestamp",
  nonce: "x-agent-nonce",
  contentSha256: "x-agent-content-sha256",
  signature: "x-agent-signature",
} as const;

export type VerifyResult =
  | { ok: true; keyId: string; nonce: string }
  | {
      ok: false;
      /** "config" => fail-closed 500; "auth" => 401; "stale"/"replay"/"hash" => 401 */
      reason: "config" | "auth" | "stale" | "replay" | "hash" | "headers";
      message: string;
    };

function sha256Hex(input: string | Buffer): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  // Both must be valid equal-length hex for timingSafeEqual; guard first.
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

/** Build the canonical string that both client and server sign. */
export function buildCanonicalString(parts: {
  method: string;
  path: string;
  timestamp: string;
  nonce: string;
  bodySha256: string;
}): string {
  return [
    parts.method.toUpperCase(),
    parts.path,
    parts.timestamp,
    parts.nonce,
    parts.bodySha256,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Nonce store: Redis preferred, Supabase fallback. Returns true if nonce is
// FRESH (not seen before) and records it; false if it was already used.
// ---------------------------------------------------------------------------

let redisClient: import("ioredis").Redis | null | undefined;

async function getRedis(): Promise<import("ioredis").Redis | null> {
  if (redisClient !== undefined) return redisClient;
  const url = getEnv().REDIS_URL;
  if (!url) {
    redisClient = null;
    return null;
  }
  try {
    const { default: Redis } = await import("ioredis");
    redisClient = new Redis(url, {
      maxRetriesPerRequest: 2,
      lazyConnect: false,
    });
    return redisClient;
  } catch {
    redisClient = null;
    return null;
  }
}

async function consumeNonce(
  keyId: string,
  nonce: string,
  timestamp: string,
  ttlSeconds: number,
): Promise<boolean> {
  const redis = await getRedis();
  const redisKey = `agent:nonce:${keyId}:${nonce}`;

  if (redis) {
    // SET NX EX => only sets if not present. "OK" means fresh.
    const res = await redis.set(redisKey, timestamp, "EX", ttlSeconds, "NX");
    return res === "OK";
  }

  // Supabase fallback: insert; unique violation (23505) => replay.
  // The generated Database type doesn't include agent_request_nonce yet, so
  // use an untyped client view for this new table.
  const supabase = getSupabaseAdmin() as unknown as {
    from: (t: string) => {
      insert: (
        row: Record<string, unknown>,
      ) => Promise<{ error: { code?: string } | null }>;
    };
  };
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  const { error } = await supabase.from("agent_request_nonce").insert({
    nonce,
    key_id: keyId,
    request_ts: timestamp,
    expires_at: expiresAt,
  });
  if (error) {
    if ((error as { code?: string }).code === "23505") return false; // replay
    // On unexpected DB error, fail closed (treat as not-fresh) to be safe.
    throw error;
  }
  return true;
}

/**
 * Verify an incoming agent request.
 * @param method  HTTP method (e.g. "POST")
 * @param path    Request path used in the canonical string (e.g. "/api/agents/blog/posts")
 * @param headers Header getter (req.headers)
 * @param rawBody Raw request body bytes/string exactly as received.
 */
export async function verifyAgentRequest(
  method: string,
  path: string,
  headers: Headers,
  rawBody: string | Buffer,
): Promise<VerifyResult> {
  const env = getEnv();
  const keyIdExpected = env.HERMES_AGENT_KEY_ID;
  const secret = env.HERMES_AGENT_HMAC_SECRET;

  // Fail closed: missing config is a server error, never public access.
  if (!keyIdExpected || !secret) {
    return {
      ok: false,
      reason: "config",
      message: "Agent API not configured (missing HMAC key id or secret).",
    };
  }

  const keyId = headers.get(AGENT_HEADERS.keyId);
  const timestamp = headers.get(AGENT_HEADERS.timestamp);
  const nonce = headers.get(AGENT_HEADERS.nonce);
  const contentSha256 = headers.get(AGENT_HEADERS.contentSha256);
  const signature = headers.get(AGENT_HEADERS.signature);

  if (!keyId || !timestamp || !nonce || !contentSha256 || !signature) {
    return {
      ok: false,
      reason: "headers",
      message: "Missing required agent headers.",
    };
  }

  if (keyId !== keyIdExpected) {
    return { ok: false, reason: "auth", message: "Unknown agent key id." };
  }

  // Timestamp must be a unix-seconds integer within allowed skew.
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || !Number.isInteger(ts)) {
    return { ok: false, reason: "stale", message: "Invalid timestamp." };
  }
  const nowSec = Math.floor(Date.now() / 1000);
  const skew = env.HERMES_MAX_CLOCK_SKEW_SECONDS ?? 300;
  if (Math.abs(nowSec - ts) > skew) {
    return {
      ok: false,
      reason: "stale",
      message: "Request timestamp outside allowed window.",
    };
  }

  // Verify body hash matches the claimed content hash.
  const actualBodyHash = sha256Hex(rawBody);
  if (!timingSafeEqualHex(actualBodyHash, contentSha256)) {
    return { ok: false, reason: "hash", message: "Body hash mismatch." };
  }

  // Verify HMAC signature over the canonical string.
  const canonical = buildCanonicalString({
    method,
    path,
    timestamp,
    nonce,
    bodySha256: actualBodyHash,
  });
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(canonical)
    .digest("hex");
  if (!timingSafeEqualHex(expectedSig, signature.toLowerCase())) {
    return { ok: false, reason: "auth", message: "Invalid signature." };
  }

  // Replay protection: consume the nonce (TTL = 2x skew, min 600s).
  const ttl = Math.max(skew * 2, 600);
  let fresh: boolean;
  try {
    fresh = await consumeNonce(keyId, nonce, timestamp, ttl);
  } catch {
    return { ok: false, reason: "config", message: "Nonce store unavailable." };
  }
  if (!fresh) {
    return {
      ok: false,
      reason: "replay",
      message: "Nonce already used (replay).",
    };
  }

  return { ok: true, keyId, nonce };
}

/** Map a failed verify reason to an HTTP status (config = 500, else 401). */
export function statusForReason(
  reason: Exclude<VerifyResult, { ok: true }>["reason"],
): number {
  return reason === "config" ? 500 : 401;
}
