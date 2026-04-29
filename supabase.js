import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================================
// SQL SCHEMA - Jalankan ini di Supabase SQL Editor
// ============================================================
/*
-- Enable UUID
create extension if not exists "uuid-ossp";

-- Weddings table
create table weddings (
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

-- Wedding members (couples linked to wedding)
create table wedding_members (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references weddings(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'partner',
  created_at timestamp with time zone default now(),
  unique(wedding_id, user_id)
);

-- Tasks / Checklist
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references weddings(id) on delete cascade,
  title text not null,
  category text not null,
  completed boolean default false,
  due_date date,
  notes text,
  created_at timestamp with time zone default now()
);

-- Guests
create table guests (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references weddings(id) on delete cascade,
  name text not null,
  phone text,
  side text default 'berdua', -- 'pengantin_pria' | 'pengantin_wanita' | 'berdua'
  rsvp_status text default 'belum', -- 'hadir' | 'tidak_hadir' | 'belum'
  table_number text,
  notes text,
  created_at timestamp with time zone default now()
);

-- Vendors
create table vendors (
  id uuid primary key default uuid_generate_v4(),
  wedding_id uuid references weddings(id) on delete cascade,
  name text not null,
  category text not null,
  contact_name text,
  phone text,
  price numeric default 0,
  status text default 'mencari', -- 'mencari' | 'negosiasi' | 'terbooking' | 'selesai'
  contract_date date,
  notes text,
  created_at timestamp with time zone default now()
);

-- Budget items
create table budget_items (
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

-- Timeline events
create table timeline_events (
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

-- Row Level Security
alter table weddings enable row level security;
alter table wedding_members enable row level security;
alter table tasks enable row level security;
alter table guests enable row level security;
alter table vendors enable row level security;
alter table budget_items enable row level security;
alter table timeline_events enable row level security;

-- RLS Policies: user can only access their wedding's data
create policy "Members can view their wedding" on weddings
  for select using (
    id in (select wedding_id from wedding_members where user_id = auth.uid())
  );

create policy "Members can update their wedding" on weddings
  for update using (
    id in (select wedding_id from wedding_members where user_id = auth.uid())
  );

create policy "Authenticated can insert wedding" on weddings
  for insert with check (auth.uid() is not null);

create policy "Members can view" on wedding_members
  for select using (user_id = auth.uid() or wedding_id in (
    select wedding_id from wedding_members where user_id = auth.uid()
  ));

create policy "Authenticated can insert member" on wedding_members
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
*/

// Auth helpers
export const authAPI = {
  async register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
    if (error) throw error
    return data
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
  }
}

// Generate unique access code
export const generateAccessCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'JK-'
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += '-'
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// Wedding API
export const weddingAPI = {
  async create({ brideName, groomName, weddingDate, venue, city, budgetTotal, guestTarget, userId }) {
    const accessCode = generateAccessCode()
    const { data: wedding, error } = await supabase
      .from('weddings')
      .insert([{ bride_name: brideName, groom_name: groomName, wedding_date: weddingDate, venue, city, budget_total: budgetTotal, guest_target: guestTarget, access_code: accessCode }])
      .select().single()
    if (error) throw error

    const { error: memberError } = await supabase
      .from('wedding_members')
      .insert([{ wedding_id: wedding.id, user_id: userId, role: 'pengantin' }])
    if (memberError) throw memberError

    return wedding
  },

  async joinByCode(accessCode, userId) {
    const { data: wedding, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('access_code', accessCode.toUpperCase())
      .single()
    if (error || !wedding) throw new Error('Kode akses tidak ditemukan')

    const { error: memberError } = await supabase
      .from('wedding_members')
      .insert([{ wedding_id: wedding.id, user_id: userId, role: 'pasangan' }])
    if (memberError) throw memberError

    return wedding
  },

  async getMyWedding(userId) {
    const { data, error } = await supabase
      .from('wedding_members')
      .select('wedding_id, weddings(*)')
      .eq('user_id', userId)
      .single()
    if (error) return null
    return data?.weddings
  },

  async update(weddingId, updates) {
    const { data, error } = await supabase
      .from('weddings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', weddingId)
      .select().single()
    if (error) throw error
    return data
  }
}

// Tasks API
export const tasksAPI = {
  async getAll(weddingId) {
    const { data, error } = await supabase
      .from('tasks').select('*').eq('wedding_id', weddingId).order('created_at')
    if (error) throw error
    return data
  },
  async create(task) {
    const { data, error } = await supabase.from('tasks').insert([task]).select().single()
    if (error) throw error
    return data
  },
  async update(id, updates) {
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async delete(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
  }
}

// Guests API
export const guestsAPI = {
  async getAll(weddingId) {
    const { data, error } = await supabase
      .from('guests').select('*').eq('wedding_id', weddingId).order('name')
    if (error) throw error
    return data
  },
  async create(guest) {
    const { data, error } = await supabase.from('guests').insert([guest]).select().single()
    if (error) throw error
    return data
  },
  async update(id, updates) {
    const { data, error } = await supabase.from('guests').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async delete(id) {
    const { error } = await supabase.from('guests').delete().eq('id', id)
    if (error) throw error
  }
}

// Vendors API
export const vendorsAPI = {
  async getAll(weddingId) {
    const { data, error } = await supabase
      .from('vendors').select('*').eq('wedding_id', weddingId).order('category')
    if (error) throw error
    return data
  },
  async create(vendor) {
    const { data, error } = await supabase.from('vendors').insert([vendor]).select().single()
    if (error) throw error
    return data
  },
  async update(id, updates) {
    const { data, error } = await supabase.from('vendors').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async delete(id) {
    const { error } = await supabase.from('vendors').delete().eq('id', id)
    if (error) throw error
  }
}

// Budget API
export const budgetAPI = {
  async getAll(weddingId) {
    const { data, error } = await supabase
      .from('budget_items').select('*').eq('wedding_id', weddingId).order('category')
    if (error) throw error
    return data
  },
  async create(item) {
    const { data, error } = await supabase.from('budget_items').insert([item]).select().single()
    if (error) throw error
    return data
  },
  async update(id, updates) {
    const { data, error } = await supabase.from('budget_items').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async delete(id) {
    const { error } = await supabase.from('budget_items').delete().eq('id', id)
    if (error) throw error
  }
}

// Timeline API
export const timelineAPI = {
  async getAll(weddingId) {
    const { data, error } = await supabase
      .from('timeline_events').select('*').eq('wedding_id', weddingId).order('start_time')
    if (error) throw error
    return data
  },
  async create(event) {
    const { data, error } = await supabase.from('timeline_events').insert([event]).select().single()
    if (error) throw error
    return data
  },
  async update(id, updates) {
    const { data, error } = await supabase.from('timeline_events').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async delete(id) {
    const { error } = await supabase.from('timeline_events').delete().eq('id', id)
    if (error) throw error
  }
}
