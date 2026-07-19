
CREATE TABLE public.consultation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  preferred_artist text NOT NULL DEFAULT '',
  tattoo_idea text NOT NULL,
  placement text NOT NULL DEFAULT '',
  size_estimate text NOT NULL DEFAULT '',
  budget_range text NOT NULL DEFAULT '',
  preferred_dates text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.consultation_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.consultation_requests TO authenticated;
GRANT ALL ON public.consultation_requests TO service_role;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public submit consultation" ON public.consultation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read consultation" ON public.consultation_requests FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin update consultation" ON public.consultation_requests FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin delete consultation" ON public.consultation_requests FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER consultation_requests_updated BEFORE UPDATE ON public.consultation_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.consent_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  date_of_birth date NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  emergency_contact_name text NOT NULL DEFAULT '',
  emergency_contact_phone text NOT NULL DEFAULT '',
  artist_name text NOT NULL DEFAULT '',
  tattoo_description text NOT NULL DEFAULT '',
  placement text NOT NULL DEFAULT '',
  health_conditions text[] NOT NULL DEFAULT '{}',
  health_notes text NOT NULL DEFAULT '',
  confirms_18_plus boolean NOT NULL DEFAULT false,
  confirms_not_impaired boolean NOT NULL DEFAULT false,
  confirms_accurate_health_info boolean NOT NULL DEFAULT false,
  understands_risks boolean NOT NULL DEFAULT false,
  understands_aftercare boolean NOT NULL DEFAULT false,
  consents_to_procedure boolean NOT NULL DEFAULT false,
  signature_name text NOT NULL,
  signature_date date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.consent_forms TO anon, authenticated;
GRANT SELECT, DELETE ON public.consent_forms TO authenticated;
GRANT ALL ON public.consent_forms TO service_role;
ALTER TABLE public.consent_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public submit consent" ON public.consent_forms FOR INSERT WITH CHECK (
  confirms_18_plus = true
  AND confirms_not_impaired = true
  AND confirms_accurate_health_info = true
  AND understands_risks = true
  AND understands_aftercare = true
  AND consents_to_procedure = true
  AND length(trim(signature_name)) > 0
);
CREATE POLICY "admin read consent" ON public.consent_forms FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin delete consent" ON public.consent_forms FOR DELETE TO authenticated USING (public.is_admin());
