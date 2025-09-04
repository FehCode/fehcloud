-- Safely create storage policies for bucket 'user-files'
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can view their own stored files'
  ) THEN
    CREATE POLICY "Users can view their own stored files"
      ON storage.objects
      FOR SELECT TO authenticated
      USING (
        bucket_id = 'user-files'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload to their folder'
  ) THEN
    CREATE POLICY "Users can upload to their folder"
      ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (
        bucket_id = 'user-files'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update their stored files'
  ) THEN
    CREATE POLICY "Users can update their stored files"
      ON storage.objects
      FOR UPDATE TO authenticated
      USING (
        bucket_id = 'user-files'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete their stored files'
  ) THEN
    CREATE POLICY "Users can delete their stored files"
      ON storage.objects
      FOR DELETE TO authenticated
      USING (
        bucket_id = 'user-files'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;

-- Recreate trigger for updated_at on public.files
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_files_updated_at') THEN
    DROP TRIGGER update_files_updated_at ON public.files;
  END IF;
END $$;

CREATE TRIGGER update_files_updated_at
BEFORE UPDATE ON public.files
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful index for per-user queries
CREATE INDEX IF NOT EXISTS idx_files_user_id ON public.files(user_id);
