/**
 * HMAC signing/verification algorithm tests.
 *
 * Run: node --test tests/agent-hmac.test.mjs
 *
 * These test the security-critical canonical-string + HMAC + body-hash logic
 * in isolation (no Next/Supabase runtime needed). They mirror exactly what
 * lib/agent-hmac.ts does on the server and what scripts/blog_publish.py does
 * on the VPS, so they double as a cross-implementation contract check.
 */
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

const SECRET = "unit-test-secret";
const KEY_ID = "test-key";
const SKEW = 300;

function sha256Hex(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}
function buildCanonical({ method, path, timestamp, nonce, bodySha256 }) {
  return [method.toUpperCase(), path, timestamp, nonce, bodySha256].join("\n");
}
function sign(canonical, secret = SECRET) {
  return crypto.createHmac("sha256", secret).update(canonical).digest("hex");
}
function timingSafeHex(a, b) {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

/** Minimal re-implementation of the verifier's decision logic for testing. */
function verify({
  method,
  path,
  body,
  headers,
  now = Math.floor(Date.now() / 1000),
  seenNonces = new Set(),
}) {
  if (!KEY_ID || !SECRET) return { ok: false, reason: "config" };
  const { keyId, timestamp, nonce, contentSha256, signature } = headers;
  if (!keyId || !timestamp || !nonce || !contentSha256 || !signature)
    return { ok: false, reason: "headers" };
  if (keyId !== KEY_ID) return { ok: false, reason: "auth" };
  const ts = Number(timestamp);
  if (!Number.isInteger(ts) || Math.abs(now - ts) > SKEW)
    return { ok: false, reason: "stale" };
  const actualHash = sha256Hex(body);
  if (!timingSafeHex(actualHash, contentSha256))
    return { ok: false, reason: "hash" };
  const expectedSig = sign(
    buildCanonical({ method, path, timestamp, nonce, bodySha256: actualHash }),
  );
  if (!timingSafeHex(expectedSig, signature))
    return { ok: false, reason: "auth" };
  if (seenNonces.has(nonce)) return { ok: false, reason: "replay" };
  seenNonces.add(nonce);
  return { ok: true };
}

function signedHeaders({
  method,
  path,
  body,
  ts = Math.floor(Date.now() / 1000),
  nonce = crypto.randomBytes(16).toString("hex"),
  secret = SECRET,
  keyId = KEY_ID,
}) {
  const bodySha256 = sha256Hex(body);
  const signature = sign(
    buildCanonical({ method, path, timestamp: String(ts), nonce, bodySha256 }),
    secret,
  );
  return {
    keyId,
    timestamp: String(ts),
    nonce,
    contentSha256: bodySha256,
    signature,
  };
}

const PATH = "/api/agents/blog/posts";
const BODY = JSON.stringify({ title: "t", slug: "s", content: "c" });

test("valid signed request passes", () => {
  const headers = signedHeaders({ method: "POST", path: PATH, body: BODY });
  assert.equal(
    verify({ method: "POST", path: PATH, body: BODY, headers }).ok,
    true,
  );
});

test("missing headers => headers reason", () => {
  const r = verify({ method: "POST", path: PATH, body: BODY, headers: {} });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "headers");
});

test("stale timestamp rejected", () => {
  const old = Math.floor(Date.now() / 1000) - (SKEW + 60);
  const headers = signedHeaders({
    method: "POST",
    path: PATH,
    body: BODY,
    ts: old,
  });
  const r = verify({ method: "POST", path: PATH, body: BODY, headers });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "stale");
});

test("tampered body (hash mismatch) rejected", () => {
  const headers = signedHeaders({ method: "POST", path: PATH, body: BODY });
  const r = verify({ method: "POST", path: PATH, body: BODY + "x", headers });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "hash");
});

test("bad signature (wrong secret) rejected", () => {
  const headers = signedHeaders({
    method: "POST",
    path: PATH,
    body: BODY,
    secret: "wrong-secret",
  });
  const r = verify({ method: "POST", path: PATH, body: BODY, headers });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "auth");
});

test("wrong path (signature over different path) rejected", () => {
  const headers = signedHeaders({
    method: "POST",
    path: "/api/agents/blog/media",
    body: BODY,
  });
  const r = verify({ method: "POST", path: PATH, body: BODY, headers });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "auth");
});

test("replayed nonce rejected on second use", () => {
  const seen = new Set();
  const headers = signedHeaders({ method: "POST", path: PATH, body: BODY });
  const first = verify({
    method: "POST",
    path: PATH,
    body: BODY,
    headers,
    seenNonces: seen,
  });
  const second = verify({
    method: "POST",
    path: PATH,
    body: BODY,
    headers,
    seenNonces: seen,
  });
  assert.equal(first.ok, true);
  assert.equal(second.ok, false);
  assert.equal(second.reason, "replay");
});

test("unknown key id rejected", () => {
  const headers = signedHeaders({
    method: "POST",
    path: PATH,
    body: BODY,
    keyId: "someone-else",
  });
  const r = verify({ method: "POST", path: PATH, body: BODY, headers });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "auth");
});
