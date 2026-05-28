-- Storage bucket politikasi (Buckets ekraninda 0 policy goruyorsan calistir)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 52428800, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true;

-- Storage RLS
alter table storage.objects enable row level security;

drop policy if exists "Public read portfolio storage" on storage.objects;
drop policy if exists "Service upload portfolio" on storage.objects;

create policy "Public read portfolio storage"
on storage.objects for select
using (bucket_id = 'portfolio');

-- Not: Admin yuklemeleri service_role key ile yapilir (RLS bypass).
-- Bu policy sadece public okuma icindir.
