create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  seller_name text not null,
  mill_name text not null,
  price numeric(6,2) not null,
  gross_weight integer not null,
  net_weight integer not null,
  district text not null,
  weigh_date date,
  weigh_time time,
  lat double precision,
  lng double precision,
  ticket_image_path text,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

create policy "allow public read transactions"
on public.transactions for select
using (true);

create policy "allow public insert transactions"
on public.transactions for insert
with check (true);

-- สร้าง Storage bucket ชื่อ ticket-images ใน Supabase Dashboard
-- แล้วตั้ง public/private ตามนโยบายที่ต้องการ
