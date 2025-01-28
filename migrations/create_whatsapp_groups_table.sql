create table public.whatsapp_groups (
  id uuid default gen_random_uuid() primary key,
  group_id text not null unique,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.whatsapp_numbers (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references whatsapp_groups(id) on delete cascade,
  phone_number text not null,
  country_code text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index whatsapp_groups_group_id_idx on public.whatsapp_groups(group_id);
create index whatsapp_numbers_group_id_idx on public.whatsapp_numbers(group_id);
