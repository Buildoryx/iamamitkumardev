-- Agent Leads
-- Captures inbound prospects for production-grade AI agent builds
-- (https://iamamitkumar.dev/agents). One row per submission.

create table if not exists agent_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  role text check (role in ('founder', 'operator', 'engineer', 'other') or role is null),
  agent_type text not null check (
    agent_type in ('personal', 'business_intelligence', 'ops_workflow', 'not_sure')
  ),
  description text not null,
  stage text not null check (stage in ('idea', 'prototyping', 'in_production')),
  timeline text not null check (timeline in ('this_month', 'one_to_two_months', 'exploring')),
  referral text,
  source text not null default 'iamamitkumar.dev/agents',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip text,
  user_agent text,
  status text not null default 'new' check (
    status in ('new', 'contacted', 'qualified', 'won', 'lost', 'spam')
  ),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists agent_leads_created_at_idx on agent_leads (created_at desc);
create index if not exists agent_leads_email_idx on agent_leads (email);
create index if not exists agent_leads_status_idx on agent_leads (status);

-- Auto-update updated_at on row changes
create or replace function set_agent_leads_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists agent_leads_set_updated_at on agent_leads;
create trigger agent_leads_set_updated_at
  before update on agent_leads
  for each row execute function set_agent_leads_updated_at();

-- RLS: service role only (the route handler uses the admin client, so anon
-- reads/writes are blocked by default).
alter table agent_leads enable row level security;

create policy "Service role full access agent_leads"
  on agent_leads for all
  using (true) with check (true);

comment on table agent_leads is
  'Inbound leads from iamamitkumar.dev/agents landing page form.';
