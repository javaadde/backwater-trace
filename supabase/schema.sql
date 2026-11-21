-- Backwater Trace schema. Run once in the Supabase SQL editor.
-- All access goes through Next.js server routes using the service role key,
-- so RLS is enabled with no public policies (anon clients can read nothing).

create extension if not exists pgcrypto;

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  latitude double precision not null,
  longitude double precision not null,
  status text not null default 'new'
    check (status in ('new', 'needs_verification', 'verified', 'resolved')),
  summary text not null default '',
  location_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid references public.incidents(id) on delete cascade,
  title text not null,
  description text not null,
  original_language text not null default 'en',
  translated_text text,
  latitude double precision not null,
  longitude double precision not null,
  location_text text,
  category text not null,
  reported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  photo_url text,          -- storage path in the private "evidence" bucket
  audio_url text,          -- storage path in the private "evidence" bucket
  transcript text,
  road_status text,
  water_level text,
  severity text,
  situation_status text,
  reporter_name text,
  source_type text not null default 'text' check (source_type in ('voice', 'text'))
);

create table if not exists public.contradictions (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.incidents(id) on delete cascade,
  report_a_id uuid not null references public.reports(id) on delete cascade,
  report_b_id uuid not null references public.reports(id) on delete cascade,
  field text not null,
  value_a text not null,
  value_b text not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists reports_incident_idx on public.reports (incident_id);
create index if not exists reports_reported_at_idx on public.reports (reported_at desc);
create index if not exists contradictions_incident_idx on public.contradictions (incident_id);
create index if not exists incidents_updated_idx on public.incidents (updated_at desc);

alter table public.incidents enable row level security;
alter table public.reports enable row level security;
alter table public.contradictions enable row level security;

-- Private evidence bucket (photos + voice recordings). Served only via signed URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidence', 'evidence', false, 10485760,
  array['image/jpeg','image/png','image/webp','audio/wav','audio/x-wav','audio/wave','audio/webm','audio/ogg','audio/mpeg','audio/mp4','audio/x-m4a','audio/aac']
)
on conflict (id) do update set public = false;

-- Newer Supabase projects don't auto-grant table access to API roles.
-- Only the server-side service role may touch these tables; anon/authenticated get nothing.
grant usage on schema public to service_role;
grant select, insert, update, delete on public.incidents, public.reports, public.contradictions to service_role;
revoke all on public.incidents, public.reports, public.contradictions from anon, authenticated;
notify pgrst, 'reload schema';
