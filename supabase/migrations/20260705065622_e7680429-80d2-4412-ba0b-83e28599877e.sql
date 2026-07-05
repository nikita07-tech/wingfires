
-- Admin can update RFQ status (for CRM pipeline)
CREATE POLICY "Admin updates rfqs" ON public.rfqs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Admin can read all quotes (already exists as "Admin reads all quotes")
-- Add admin update for quote status
CREATE POLICY "Admin updates quotes" ON public.quotes
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Admin can read all vendor profiles (for CRM/admin views)
CREATE POLICY "Admin reads all vendors" ON public.vendor_profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admin can read all roles (for role management)
CREATE POLICY "Admin reads all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
