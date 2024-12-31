create table terrain_entries (
  id bigint primary key generated always as identity,
  name text not null,
  terrain_string text not null
);

create policy "public can read write terrain_entries"
on public.terrain_entries
for select to anon
using (true);

alter table terrain_entries enable row level security;