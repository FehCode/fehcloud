-- 1) Plan enum and user_plans table with RLS
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_tier') THEN
    CREATE TYPE public.plan_tier AS ENUM ('basic', 'intermediate', 'max');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_plans (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan public.plan_tier NOT NULL DEFAULT 'basic',
  quota_bytes BIGINT NOT NULL DEFAULT (200::bigint * 1024 * 1024 * 1024), -- 200 GB
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- Users can read their own plan
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_plans' AND policyname='Users can view their own plan'
  ) THEN
    CREATE POLICY "Users can view their own plan" ON public.user_plans
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to create their own row only as basic plan (defaults enforce it)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_plans' AND policyname='Users can bootstrap their plan as basic'
  ) THEN
    CREATE POLICY "Users can bootstrap their plan as basic" ON public.user_plans
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id AND plan = 'basic');
  END IF;
END $$;

-- 2) Trigger to keep quota in sync with plan and updated_at
CREATE OR REPLACE FUNCTION public.apply_plan_quota()
RETURNS trigger AS $$
BEGIN
  -- Set quota based on plan when missing or when plan changes
  IF (TG_OP = 'INSERT') OR (NEW.plan IS DISTINCT FROM OLD.plan) THEN
    NEW.quota_bytes := CASE NEW.plan
      WHEN 'basic' THEN 200::bigint * 1024 * 1024 * 1024
      WHEN 'intermediate' THEN 500::bigint * 1024 * 1024 * 1024
      WHEN 'max' THEN 1024::bigint * 1024 * 1024 * 1024 -- 1 TB
      ELSE 200::bigint * 1024 * 1024 * 1024
    END;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'apply_plan_quota_trigger') THEN
    CREATE TRIGGER apply_plan_quota_trigger
    BEFORE INSERT OR UPDATE OF plan ON public.user_plans
    FOR EACH ROW EXECUTE FUNCTION public.apply_plan_quota();
  END IF;
END $$;

-- 3) Enforce storage quota on files inserts/updates
CREATE OR REPLACE FUNCTION public.enforce_storage_quota()
RETURNS trigger AS $$
DECLARE
  user_quota BIGINT;
  used_bytes BIGINT;
BEGIN
  SELECT quota_bytes INTO user_quota FROM public.user_plans WHERE user_id = NEW.user_id;
  IF user_quota IS NULL THEN
    user_quota := 200::bigint * 1024 * 1024 * 1024; -- default to basic if missing
  END IF;

  SELECT COALESCE(SUM(size), 0) INTO used_bytes FROM public.files WHERE user_id = NEW.user_id;

  IF TG_OP = 'INSERT' THEN
    used_bytes := used_bytes + NEW.size;
  ELSIF TG_OP = 'UPDATE' THEN
    used_bytes := used_bytes - OLD.size + NEW.size;
  END IF;

  IF used_bytes > user_quota THEN
    RAISE EXCEPTION 'Storage quota exceeded for user %: % of % bytes', NEW.user_id, used_bytes, user_quota
      USING ERRCODE = '53100'; -- insufficient_resources
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'enforce_quota_on_files_insert') THEN
    CREATE TRIGGER enforce_quota_on_files_insert
    BEFORE INSERT ON public.files
    FOR EACH ROW EXECUTE FUNCTION public.enforce_storage_quota();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'enforce_quota_on_files_update') THEN
    CREATE TRIGGER enforce_quota_on_files_update
    BEFORE UPDATE OF size ON public.files
    FOR EACH ROW EXECUTE FUNCTION public.enforce_storage_quota();
  END IF;
END $$;

-- 4) Keep updated_at on user_plans using the shared function as well
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_plans_updated_at') THEN
    CREATE TRIGGER update_user_plans_updated_at
    BEFORE UPDATE ON public.user_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;