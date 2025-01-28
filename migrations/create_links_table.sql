create table public.links (
  id uuid default gen_random_uuid() primary key,
  original_url text not null,
  short_id text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  clicks integer default 0
);

-- Create index for faster lookups
create index links_short_id_idx on public.links(short_id);
