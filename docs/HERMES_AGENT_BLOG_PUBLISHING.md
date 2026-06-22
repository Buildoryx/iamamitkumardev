# Hermes Agent Blog Publishing — Deployment Guide

Backend-mediated pipeline so Hermes VPS agents can create/update/publish blog
posts and upload images to **iamamitkumar.dev**, without ever holding the
Supabase service role. Implements `.omx/specs/deep-interview-hermes-vps-blog-publishing.md`.

```
Hermes VPS (HMAC sign) ──HTTPS──> /api/agents/blog/* (verify + validate + audit)
                                   └─> Supabase post table + Supabase Storage
                                   └─> revalidate /blog /blog/[slug] /sitemap.xml /feed.xml
```

**Capabilities:** create+publish, update any post (incl. human-written), upload images.
**NOT possible:** delete (no delete route, no delete action) — by design.

---

## What was built

Backend (this repo):

- `lib/env.ts` — added `HERMES_AGENT_KEY_ID`, `HERMES_AGENT_HMAC_SECRET`, `HERMES_MAX_CLOCK_SKEW_SECONDS`, `SUPABASE_BLOG_MEDIA_BUCKET`.
- `lib/agent-hmac.ts` — HMAC verifier (fail-closed, timestamp+nonce+body-hash, timing-safe). Nonce store: Redis if `REDIS_URL`, else Supabase `agent_request_nonce`.
- `lib/agent-audit.ts` — writes every attempt/result to `agent_blog_event`.
- `app/api/agents/blog/posts/route.ts` — `POST` create+publish.
- `app/api/agents/blog/posts/[slug]/route.ts` — `PUT` update.
- `app/api/agents/blog/media/route.ts` — `POST` image upload (base64 → Supabase Storage).
- `supabase/migrations/20260622000000_hermes_agent_blog.sql` — tables + `blog-media` bucket.
- `tests/agent-hmac.test.mjs` — verifier unit tests (`npm test`).

VPS (already deployed): `~/.hermes/scripts/blog_publish.py` — signing client + CLI.

---

## Deployment steps (operator)

### 1. Generate the shared HMAC secret (once)

```bash
openssl rand -hex 32          # copy this value; it goes in BOTH places below
```

Pick a key id too, e.g. `hermes-blog-v1`.

### 2. Vercel env vars (Project → Settings → Environment Variables)

Add (Production + Preview):

```
HERMES_AGENT_KEY_ID=hermes-blog-v1
HERMES_AGENT_HMAC_SECRET=<the openssl value from step 1>
HERMES_MAX_CLOCK_SKEW_SECONDS=300
SUPABASE_BLOG_MEDIA_BUCKET=blog-media
```

(`SERVICE_ROLE` + `PROJECT_URL` should already be set — they stay only here.)

### 3. Apply the Supabase migration

Either with the Supabase CLI:

```bash
supabase db push        # applies supabase/migrations/20260622000000_hermes_agent_blog.sql
```

…or paste that file's SQL into Supabase Studio → SQL editor and run it.
This creates `agent_request_nonce`, `agent_blog_event`, and the public-read
`blog-media` storage bucket.

### 4. VPS env (the agent side — NO Supabase keys here)

On the VPS, write `~/.hermes/blog-api.env` with the SAME key id + secret:

```bash
cat > ~/.hermes/blog-api.env <<EOF
HERMES_AGENT_KEY_ID=hermes-blog-v1
HERMES_AGENT_HMAC_SECRET=<same value as Vercel>
BLOG_API_BASE_URL=https://iamamitkumar.dev
EOF
chmod 600 ~/.hermes/blog-api.env
```

### 5. Deploy the backend

```bash
git add -A && git commit -m "feat: Hermes agent blog publishing API (HMAC-signed)"
git push origin main     # Vercel auto-deploys
```

---

## Smoke test (after deploy)

On the VPS:

```bash
cat > /tmp/test-post.json <<'EOF'
{ "title": "Hello from Hermes",
  "slug": "hello-from-hermes",
  "content": "# Hello\n\nThis post was published by a Hermes agent via the signed API.",
  "excerpt": "First agent-published post.",
  "tags": ["hermes-agent","build-in-public"],
  "status": "published" }
EOF
python3 ~/.hermes/scripts/blog_publish.py create --file /tmp/test-post.json
```

Expect a JSON response with the post + `request_id`. Then check
`https://iamamitkumar.dev/blog/hello-from-hermes`.

Upload an image:

```bash
python3 ~/.hermes/scripts/blog_publish.py upload --image /path/to.png --content-type image/png
# use the returned "url" as coverImage or inline ![](url) in a post
```

Update a post:

```bash
python3 ~/.hermes/scripts/blog_publish.py update --slug hello-from-hermes --file /tmp/test-post.json
```

---

## Security properties (verified)

- **Fail-closed:** missing `HERMES_AGENT_HMAC_SECRET` → API returns 500 config error, never public access.
- Rejected: invalid signature, stale timestamp (>skew), body-hash mismatch, replayed nonce, unknown key id (8 unit tests pass).
- Service role key exists **only** in the Vercel backend, never on the VPS.
- **No delete** anywhere — no route, no agent action.
- All attempts/results audited in `agent_blog_event` (query by slug/action/time).

## Operational notes

- The HMAC secret must be **identical** on Vercel and the VPS. Rotate by updating both.
- Nonce store uses Supabase fallback if `REDIS_URL` is unset (works, just a DB row per request; the `expires_at` index supports periodic cleanup).
- Agents author as `hermes-agent`; human posts keep their author on update.
- Audit query example:
  `select created_at, action, status, slug, http_status, message from agent_blog_event order by created_at desc limit 50;`
