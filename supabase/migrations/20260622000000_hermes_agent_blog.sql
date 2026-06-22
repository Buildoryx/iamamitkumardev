-- Hermes agent blog publishing: nonce replay store, audit log, media bucket.
-- Safe to run multiple times (IF NOT EXISTS / ON CONFLICT guards).

-- 1. Nonce replay-protection store (Supabase fallback when REDIS_URL absent).
create table if not exists public.agent_request_nonce (
  nonce       text primary key,
  key_id      text not null,
  request_ts  text not null,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

create index if not exists agent_request_nonce_expires_at_idx
  on public.agent_request_nonce (expires_at);

-- 2. Audit log for every agent write attempt + result.
create table if not exists public.agent_blog_event (
  id                uuid primary key default gen_random_uuid(),
  action            text not null,            -- create | update | media_upload
  status            text not null,            -- success | rejected | error
  key_id            text,
  request_id        text,
  slug              text,
  post_id           text,
  media_url         text,
  http_status       integer,
  validation_errors text[],
  message           text,
  created_at        timestamptz not null default now()
);

create index if not exists agent_blog_event_created_at_idx
  on public.agent_blog_event (created_at desc);
create index if not exists agent_blog_event_action_idx
  on public.agent_blog_event (action);
create index if not exists agent_blog_event_slug_idx
  on public.agent_blog_event (slug);

-- RLS: these tables are written ONLY by the backend service role, which
-- bypasses RLS. Enable RLS with no public policies so anon/auth cannot read
-- or write them.
alter table public.agent_request_nonce enable row level security;
alter table public.agent_blog_event   enable row level security;

-- 3. Supabase Storage bucket for agent-generated blog media.
--    Public READ, backend-only WRITE (service role bypasses policies).
insert into storage.buckets (id, name, public)
values ('blog-media', 'blog-media', true)
on conflict (id) do update set public = true;

-- Public read access for objects in blog-media (so <img src> works on the site).
drop policy if exists "blog-media public read" on storage.objects;
create policy "blog-media public read"
  on storage.objects for select
  to public
  using (bucket_id = 'blog-media');

-- NOTE: No INSERT/UPDATE/DELETE policies are created for anon/auth roles.
-- Only the backend service-role key (which bypasses RLS) can write media.
-- There is intentionally NO delete capability exposed to the agent.

-- 4. Seed the agent author. post.authorId has a FK to "user"(id); the agent
--    publishes as "hermes-agent", so that user row must exist.
insert into public."user" (id, name, email, "emailVerified", role, "createdAt", "updatedAt", banned)
values ('hermes-agent', 'Hermes Agent', 'hermes-agent@iamamitkumar.dev', true, 'agent', now(), now(), false)
on conflict (id) do nothing;
