create table if not exists public.seo_decision_log (
  id uuid primary key default gen_random_uuid(),
  decision_id text not null unique,
  decision_type text not null check (decision_type in ('intent', 'content', 'overlap')),
  input_state jsonb not null,
  result jsonb not null,
  confidence numeric not null check (confidence >= 0 and confidence <= 1),
  threshold numeric not null check (threshold >= 0 and threshold <= 1),
  fallback_action text not null,
  evidence text[] not null default '{}',
  model_version text not null,
  usage jsonb not null default '{}',
  decided_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists seo_decision_log_type_idx
  on public.seo_decision_log (decision_type, created_at desc);

alter table public.seo_decision_log enable row level security;
