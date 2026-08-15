-- Naifos — schema initial
-- Catalogue (packs), collabs (mur des collabs) et commandes.
-- Lecture publique sur le catalogue/collabs ; écriture réservée au rôle service
-- (les commandes sont créées côté webhook Apps Script / edge function, jamais
-- directement depuis le client).

create extension if not exists "pgcrypto";

create table if not exists packs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  type text not null check (type in ('loop', 'prod', 'topline')),
  bpm integer not null,
  key text not null,
  mood text[] not null default '{}',
  cover_gradient text[] not null default '{}',
  duration_sec integer not null,
  audio_url text,
  waveform_seed integer not null default 0,
  licenses jsonb not null default '[]',
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists collabs (
  id uuid primary key default gen_random_uuid(),
  artist text not null,
  track text not null,
  year integer not null,
  role text not null,
  accent text[] not null default '{}',
  genius_url text,
  audio_url text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  total numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  pack_id uuid references packs (id),
  license_id text not null,
  license_label text not null,
  price numeric(10, 2) not null
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table packs enable row level security;
alter table collabs enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table contact_messages enable row level security;

create policy "packs are publicly readable" on packs
  for select using (true);

create policy "collabs are publicly readable" on collabs
  for select using (true);

-- orders / order_items / contact_messages: no public policies — only the
-- service role (used by the Apps Script webhook / a Supabase edge function)
-- can read or write them.

create index if not exists packs_type_idx on packs (type);
create index if not exists packs_bpm_idx on packs (bpm);
create index if not exists collabs_year_idx on collabs (year desc);
