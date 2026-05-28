-- Eksik tablolar veya politikalar varsa calistir (Supabase SQL Editor)

-- Tablolar yoksa olustur
create table if not exists portfolio_images (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('small', 'medium', 'big', 'done')),
  image_url text not null,
  title text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists working_hours (
  id uuid primary key default gen_random_uuid(),
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null default '10:00',
  end_time time not null default '19:00',
  is_active boolean not null default true,
  unique (day_of_week)
);

create table if not exists blocked_dates (
  id uuid primary key default gen_random_uuid(),
  blocked_date date not null unique,
  reason text
);

create table if not exists blocked_slots (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  slot_time time not null,
  reason text,
  unique (slot_date, slot_time)
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  appointment_date date not null,
  appointment_time time not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Varsayilan calisma saatleri
insert into working_hours (day_of_week, start_time, end_time, is_active) values
  (1, '10:00', '19:00', true),
  (2, '10:00', '19:00', true),
  (3, '10:00', '19:00', true),
  (4, '10:00', '19:00', true),
  (5, '10:00', '19:00', true),
  (6, '10:00', '17:00', true),
  (0, '10:00', '19:00', false)
on conflict (day_of_week) do nothing;

-- RLS
alter table portfolio_images enable row level security;
alter table working_hours enable row level security;
alter table blocked_dates enable row level security;
alter table blocked_slots enable row level security;
alter table appointments enable row level security;

-- Politikalari yeniden olustur (varsa atla)
drop policy if exists "Public read portfolio" on portfolio_images;
drop policy if exists "Public read working_hours" on working_hours;
drop policy if exists "Public read blocked_dates" on blocked_dates;
drop policy if exists "Public read blocked_slots" on blocked_slots;
drop policy if exists "Public read appointments" on appointments;
drop policy if exists "Public insert appointments" on appointments;

create policy "Public read portfolio" on portfolio_images for select using (true);
create policy "Public read working_hours" on working_hours for select using (true);
create policy "Public read blocked_dates" on blocked_dates for select using (true);
create policy "Public read blocked_slots" on blocked_slots for select using (true);
create policy "Public read appointments" on appointments for select using (true);
create policy "Public insert appointments" on appointments for insert with check (true);

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read portfolio storage" on storage.objects;
create policy "Public read portfolio storage"
on storage.objects for select
using (bucket_id = 'portfolio');
