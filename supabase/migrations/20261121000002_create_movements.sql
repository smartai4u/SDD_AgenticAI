-- Phase 3, F2: inbound and outbound movements in one table.

create table public.movements (
  id uuid primary key default gen_random_uuid(),
  direction text not null check (direction in ('inbound', 'outbound')),
  weight_kg numeric(12,3) not null check (weight_kg > 0),
  occurred_at timestamptz not null default now(),
  producer_id uuid references public.producers (id) on delete restrict,
  site_id uuid references public.sites (id) on delete restrict,
  created_at timestamptz not null default now(),
  -- Inbound comes from a producer; outbound goes to a site; never both.
  constraint movements_direction_party check (
    (direction = 'inbound' and producer_id is not null and site_id is null)
    or
    (direction = 'outbound' and site_id is not null and producer_id is null)
  )
);

create index movements_occurred_at_idx on public.movements (occurred_at desc);
create index movements_producer_id_idx on public.movements (producer_id);
create index movements_site_id_idx on public.movements (site_id);

-- RLS on, no policies: no public access. The app uses a server-only secret key.
alter table public.movements enable row level security;
