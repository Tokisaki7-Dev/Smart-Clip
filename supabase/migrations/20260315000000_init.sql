create extension if not exists "pgcrypto";

create type public.plan_id as enum ('free', 'starter', 'creator', 'pro');
create type public.subscription_status as enum ('trial', 'active', 'past_due', 'canceled', 'expired', 'paused');
create type public.billing_provider as enum ('pagbank', 'manual');
create type public.payment_status as enum ('pending', 'authorized', 'paid', 'failed', 'refunded', 'canceled');
create type public.video_status as enum ('uploading', 'ready', 'processing', 'completed', 'failed', 'expired');
create type public.job_type as enum ('trim', 'extract_audio', 'compress', 'convert', 'resize', 'auto_clip', 'auto_caption', 'export');
create type public.job_status as enum ('queued', 'processing', 'completed', 'failed', 'canceled');
create type public.export_status as enum ('queued', 'processing', 'completed', 'failed', 'downloaded');
create type public.credit_transaction_type as enum ('purchase', 'bonus', 'consume', 'refund', 'expire', 'adjustment');

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  current_plan public.plan_id not null default 'free',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  plan_id public.plan_id not null,
  status public.subscription_status not null,
  provider public.billing_provider not null default 'pagbank',
  external_id text,
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.billing_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  legal_name text,
  document_number text,
  phone text,
  zip_code text,
  city text,
  state text,
  country text not null default 'BR',
  provider_customer_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  credit_pack_id text,
  provider public.billing_provider not null default 'pagbank',
  provider_payment_id text,
  payment_method text not null,
  amount_cents integer not null,
  currency text not null default 'BRL',
  status public.payment_status not null,
  failure_reason text,
  raw_payload jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.payment_webhooks (
  id uuid primary key default gen_random_uuid(),
  provider public.billing_provider not null default 'pagbank',
  event_type text not null,
  provider_event_id text not null unique,
  payload jsonb not null,
  process_status text not null default 'pending',
  processed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  storage_bucket text not null,
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  duration_seconds integer,
  width integer,
  height integer,
  source_format text,
  status public.video_status not null default 'uploading',
  retention_ends_at timestamptz,
  metadata jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.processing_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  video_id uuid references public.videos (id) on delete set null,
  type public.job_type not null,
  status public.job_status not null default 'queued',
  queue_name text not null default 'processing_jobs',
  priority integer not null default 0,
  input jsonb not null,
  output jsonb,
  error_message text,
  worker_token text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  video_id uuid references public.videos (id) on delete set null,
  processing_job_id uuid references public.processing_jobs (id) on delete set null,
  tool_slug text not null,
  output_format text not null,
  resolution text not null,
  watermark_enabled boolean not null default true,
  storage_path text not null,
  status public.export_status not null default 'queued',
  download_count integer not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  video_id uuid references public.videos (id) on delete set null,
  name text not null,
  tool_slug text not null,
  config jsonb not null,
  is_template boolean not null default false,
  last_export_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.saved_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  tool_slug text not null,
  config jsonb not null,
  is_system boolean not null default false,
  usage_count integer not null default 0,
  last_used_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.usage_counters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  metric text not null,
  period_key text not null,
  used_value integer not null default 0,
  limit_value integer not null default 0,
  reset_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, metric, period_key)
);

create table public.credit_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  balance integer not null default 0,
  lifetime_purchased integer not null default 0,
  lifetime_spent integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.credit_wallets (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  type public.credit_transaction_type not null,
  amount integer not null,
  balance_after integer not null,
  source_type text,
  source_id text,
  metadata jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.users (id) on delete set null,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content jsonb not null,
  category text not null,
  seo_title text,
  seo_description text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index subscriptions_user_status_idx on public.subscriptions (user_id, status);
create index subscriptions_plan_status_idx on public.subscriptions (plan_id, status);
create index payment_attempts_user_status_idx on public.payment_attempts (user_id, status);
create index payment_attempts_subscription_idx on public.payment_attempts (subscription_id);
create index payment_webhooks_provider_status_idx on public.payment_webhooks (provider, process_status);
create index videos_user_status_idx on public.videos (user_id, status);
create index videos_retention_idx on public.videos (retention_ends_at);
create index processing_jobs_status_queue_priority_idx on public.processing_jobs (status, queue_name, priority);
create index processing_jobs_user_created_idx on public.processing_jobs (user_id, created_at desc);
create index processing_jobs_video_idx on public.processing_jobs (video_id);
create index exports_user_created_idx on public.exports (user_id, created_at desc);
create index exports_status_expires_idx on public.exports (status, expires_at);
create index projects_user_updated_idx on public.projects (user_id, updated_at desc);
create index saved_presets_user_tool_idx on public.saved_presets (user_id, tool_slug);
create index usage_counters_metric_period_idx on public.usage_counters (metric, period_key);
create index credit_transactions_wallet_created_idx on public.credit_transactions (wallet_id, created_at desc);
create index credit_transactions_user_created_idx on public.credit_transactions (user_id, created_at desc);
create index blog_posts_category_published_idx on public.blog_posts (category, is_published);

alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_profiles enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.videos enable row level security;
alter table public.processing_jobs enable row level security;
alter table public.exports enable row level security;
alter table public.projects enable row level security;
alter table public.saved_presets enable row level security;
alter table public.usage_counters enable row level security;
alter table public.credit_wallets enable row level security;
alter table public.credit_transactions enable row level security;

create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "billing_profiles_rw_own" on public.billing_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "payment_attempts_select_own" on public.payment_attempts for select using (auth.uid() = user_id);
create policy "videos_rw_own" on public.videos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "processing_jobs_rw_own" on public.processing_jobs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "exports_rw_own" on public.exports for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "projects_rw_own" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "saved_presets_rw_own" on public.saved_presets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "usage_counters_rw_own" on public.usage_counters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "credit_wallets_rw_own" on public.credit_wallets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "credit_transactions_select_own" on public.credit_transactions for select using (auth.uid() = user_id);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.credit_wallets (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
