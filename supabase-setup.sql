-- ============================================================
-- JANJI KITA - Supabase Database Setup
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Weddings table
create table if not exists weddings (
  id uuid primary key default uuid_generate_v4(),
  access_code text unique not null,
  bride_name text not null,
  groom_name text not null,
  wedding_date date,
  venue text,
  city text,
  budget_total numeric default 0,
  guest_target integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Wedding members
create table if not exists wedding_members (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references weddings(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'partner',
  created_at timestamp with time zone default now(),
  unique(wedding_id, user_id)
);

-- 3. Tasks
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references weddings(id) on delete cascade,
  title text not null,
  category text not null,
  completed boolean default false,
  due_date date,
  notes text,
  created_at timestamp with time zone default now()
);

-- 4. Guests
create table if not exists guests (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references weddings(id) on delete cascade,
  name text not null,
  phone text,
  side text default 'berdua',
  rsvp_status text default 'belum',
  table_number text,
  notes text,
  created_at timestamp with time zone default now()
);

-- 5. Vendors
create table if not exists vendors (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references weddings(id) on delete cascade,
  name text not null,
  category text not null,
  contact_name text,
  phone text,
  price numeric default 0,
  status text default 'mencari',
  contract_date date,
  notes text,
  created_at timestamp with time zone default now()
);

-- 6. Budget items
create table if not exists budget_items (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references weddings(id) on delete cascade,
  category text not null,
  item_name text not null,
  estimated_cost numeric default 0,
  actual_cost numeric default 0,
  paid boolean default false,
  notes text,
  created_at timestamp with time zone default now()
);

-- 7. Timeline events
create table if not exists timeline_events (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references weddings(id) on delete cascade,
  event_name text not null,
  start_time time not null,
  end_time time,
  location text,
  pic text,
  notes text,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table weddings enable row level security;
alter table wedding_members enable row level security;
alter table tasks enable row level security;
alter table guests enable row level security;
alter table vendors enable row level security;
alter table budget_items enable row level security;
alter table timeline_events enable row level security;

-- Weddings policies
create policy "Members can view their wedding" on weddings
  for select using (
    id in (select wedding_id from wedding_members where user_id = auth.uid())
  );
create policy "Members can update their wedding" on weddings
  for update using (
    id in (select wedding_id from wedding_members where user_id = auth.uid())
  );
create policy "Authenticated users can insert wedding" on weddings
  for insert with check (auth.uid() is not null);

-- Allow checking access_code for joining
create policy "Anyone can view wedding by access_code" on weddings
  for select using (true);

-- Wedding members policies
create policy "Members can view wedding_members" on wedding_members
  for select using (
    wedding_id in (select wedding_id from wedding_members where user_id = auth.uid())
  );
create policy "Authenticated can join wedding" on wedding_members
  for insert with check (auth.uid() is not null);

-- Tasks policies
create policy "Members can manage tasks" on tasks
  for all using (
    wedding_id in (select wedding_id from wedding_members where user_id = auth.uid())
  );

-- Guests policies
create policy "Members can manage guests" on guests
  for all using (
    wedding_id in (select wedding_id from wedding_members where user_id = auth.uid())
  );

-- Vendors policies
create policy "Members can manage vendors" on vendors
  for all using (
    wedding_id in (select wedding_id from wedding_members where user_id = auth.uid())
  );

-- Budget policies
create policy "Members can manage budget" on budget_items
  for all using (
    wedding_id in (select wedding_id from wedding_members where user_id = auth.uid())
  );

-- Timeline policies
create policy "Members can manage timeline" on timeline_events
  for all using (
    wedding_id in (select wedding_id from wedding_members where user_id = auth.uid())
  );

-- ============================================================
-- SELESAI! Database siap digunakan.
-- ============================================================
