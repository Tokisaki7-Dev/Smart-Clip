insert into storage.buckets (id, name, public, file_size_limit)
values ('videos', 'videos', false, 26843545600)
on conflict (id) do nothing;

create policy "Users can view own video objects"
on storage.objects
for select
to authenticated
using (bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can upload own video objects"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own video objects"
on storage.objects
for update
to authenticated
using (bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own video objects"
on storage.objects
for delete
to authenticated
using (bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text);
