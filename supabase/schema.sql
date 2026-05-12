create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  city text,
  rating integer not null default 1000,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  player_name text not null,
  city text,
  time_seconds integer not null,
  accuracy integer not null,
  score integer not null,
  mode text not null default 'classic',
  difficulty text not null default 'medium',
  created_at timestamptz not null default now()
);

create table if not exists public.duel_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  seed text not null,
  status text not null default 'waiting',
  host_id text not null,
  host_name text not null,
  guest_id text,
  guest_name text,
  host_progress integer not null default 0,
  guest_progress integer not null default 0,
  host_mistakes integer not null default 0,
  guest_mistakes integer not null default 0,
  host_time integer,
  guest_time integer,
  winner text,
  started_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.leaderboard enable row level security;
alter table public.duel_rooms enable row level security;

create policy "profiles are searchable"
  on public.profiles for select
  using (true);

create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "leaderboard is public"
  on public.leaderboard for select
  using (true);

create policy "users insert own leaderboard rows"
  on public.leaderboard for insert
  with check (auth.uid() = user_id);

create policy "duel rooms are readable by code"
  on public.duel_rooms for select
  using (true);

create policy "any player can create duel rooms"
  on public.duel_rooms for insert
  with check (true);

create policy "room players can update duel rooms"
  on public.duel_rooms for update
  using (true)
  with check (true);
