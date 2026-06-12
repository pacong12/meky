-- Meki Adventure production storage draft.
-- Works with Supabase/Postgres. Keep service role keys server-only.

create table if not exists public.meki_waitlist (
  storage_id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meki_reward_claims (
  storage_id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meki_waitlist_provider_idx
  on public.meki_waitlist ((data->>'provider'));

create index if not exists meki_reward_claims_wallet_idx
  on public.meki_reward_claims ((lower(data->>'walletAddress')));

create index if not exists meki_reward_claims_reward_idx
  on public.meki_reward_claims ((data->>'rewardId'));

create index if not exists meki_reward_claims_status_idx
  on public.meki_reward_claims ((data->>'status'));

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_meki_waitlist_updated_at on public.meki_waitlist;
create trigger set_meki_waitlist_updated_at
before update on public.meki_waitlist
for each row execute function public.set_updated_at();

drop trigger if exists set_meki_reward_claims_updated_at on public.meki_reward_claims;
create trigger set_meki_reward_claims_updated_at
before update on public.meki_reward_claims
for each row execute function public.set_updated_at();
