-- Step 1: Add 'free' to enum only
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_tier') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum WHERE enumtypid = 'public.plan_tier'::regtype AND enumlabel = 'free'
    ) THEN
      ALTER TYPE public.plan_tier ADD VALUE 'free' BEFORE 'basic';
    END IF;
  ELSE
    CREATE TYPE public.plan_tier AS ENUM ('free', 'basic', 'intermediate', 'max');
  END IF;
END $$;