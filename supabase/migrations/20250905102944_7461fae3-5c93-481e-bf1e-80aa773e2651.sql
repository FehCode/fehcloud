-- Storage RLS policies for private per-user access on user-files bucket
-- Create policies only if they don't already exist

-- SELECT policy
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND policyname = 'Users can view their own storage objects'
  ) THEN
    CREATE POLICY "Users can view their own storage objects"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
      bucket_id = 'user-files'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- INSERT policy
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND policyname = 'Users can upload their own storage objects'
  ) THEN
    CREATE POLICY "Users can upload their own storage objects"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'user-files'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- UPDATE policy
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND policyname = 'Users can update their own storage objects'
  ) THEN
    CREATE POLICY "Users can update their own storage objects"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'user-files'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- DELETE policy
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
      AND policyname = 'Users can delete their own storage objects'
  ) THEN
    CREATE POLICY "Users can delete their own storage objects"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'user-files'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- Add robust indexing for scalability
CREATE INDEX IF NOT EXISTS idx_files_user_id ON public.files (user_id);
CREATE INDEX IF NOT EXISTS idx_files_user_id_created_at ON public.files (user_id, created_at DESC);

-- Ensure updated_at is maintained automatically
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_files_updated_at'
  ) THEN
    CREATE TRIGGER update_files_updated_at
    BEFORE UPDATE ON public.files
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;