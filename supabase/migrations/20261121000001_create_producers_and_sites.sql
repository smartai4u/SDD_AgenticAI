-- Phase 3, F1: producers and sites (the dropdown source lists).

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.producers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Names are unique, case-insensitive.
create unique index producers_name_lower_key on public.producers (lower(name));
create unique index sites_name_lower_key on public.sites (lower(name));

create trigger producers_set_updated_at
  before update on public.producers
  for each row execute function public.set_updated_at();

create trigger sites_set_updated_at
  before update on public.sites
  for each row execute function public.set_updated_at();

-- RLS on, no policies: no public access. The app uses a server-only secret key.
alter table public.producers enable row level security;
alter table public.sites enable row level security;
