
ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'submitted',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.quotes
  DROP CONSTRAINT IF EXISTS quotes_status_check;
ALTER TABLE public.quotes
  ADD CONSTRAINT quotes_status_check CHECK (status IN ('submitted','accepted','won','rejected'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_quotes_touch ON public.quotes;
CREATE TRIGGER trg_quotes_touch BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Allow any authenticated user to self-assign the vendor role on first login
-- (safe: role table already restricts read to own rows; this only allows inserting own vendor role)
DROP POLICY IF EXISTS "Self assign vendor role" ON public.user_roles;
CREATE POLICY "Self assign vendor role" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND role = 'vendor');
