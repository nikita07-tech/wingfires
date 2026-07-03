
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'vendor', 'buyer');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Vendor profile (auto-created on signup)
CREATE TABLE public.vendor_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  contact_name TEXT,
  country TEXT,
  certifications TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.vendor_profiles TO authenticated;
GRANT ALL ON public.vendor_profiles TO service_role;
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendor manages own profile" ON public.vendor_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-create vendor role + profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.vendor_profiles (user_id, company_name, contact_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'company_name',''), COALESCE(NEW.raw_user_meta_data->>'contact_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'vendor') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RFQs (public submissions from buyers, viewable by any signed-in vendor)
CREATE TABLE public.rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id TEXT NOT NULL UNIQUE,
  part_number TEXT NOT NULL,
  part_name TEXT,
  aircraft TEXT,
  manufacturer TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  condition TEXT,
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_company TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rfqs TO authenticated;
GRANT ALL ON public.rfqs TO service_role;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendors view open RFQs" ON public.rfqs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'vendor') OR public.has_role(auth.uid(), 'admin'));

-- Quotes
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  price NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  lead_time TEXT NOT NULL,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  shipping TEXT,
  warranty TEXT,
  certificate TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotes TO authenticated;
GRANT ALL ON public.quotes TO service_role;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendor manages own quotes" ON public.quotes FOR ALL TO authenticated
  USING (auth.uid() = vendor_id) WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Admin reads all quotes" ON public.quotes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
