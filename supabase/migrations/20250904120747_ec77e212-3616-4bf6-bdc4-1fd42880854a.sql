-- Storage policies for user-owned access in 'user-files' bucket
-- Enable RLS is already managed by Supabase on storage.objects; we only add policies

-- Allow authenticated users to read their own files in 'user-files'
create policy if not exists "Users can view their own stored files"
  on storage.objects
  for select to authenticated
  using (
    bucket_id = 'user-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow upload to own folder (first segment of path must be user id)
create policy if not exists "Users can upload to their folder"
  on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'user-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow update of own files
create policy if not exists "Users can update their stored files"
  on storage.objects
  for update to authenticated
  using (
    bucket_id = 'user-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow delete of own files
create policy if not exists "Users can delete their stored files"
  on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'user-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create trigger to keep files.updated_at fresh on updates
-- Safe guard: drop existing trigger if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_files_updated_at') THEN
    DROP TRIGGER update_files_updated_at ON public.files;
  END IF;
END $$;

create trigger update_files_updated_at
before update on public.files
for each row execute function public.update_updated_at_column();

-- Helpful index for per-user queries
create index if not exists idx_files_user_id on public.files(user_id);
