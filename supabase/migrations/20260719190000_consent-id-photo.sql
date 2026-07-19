
-- ID photo capture/upload for the digital consent form
ALTER TABLE public.consent_forms ADD COLUMN id_photo_path text NOT NULL DEFAULT '';

DROP POLICY "public submit consent" ON public.consent_forms;
CREATE POLICY "public submit consent" ON public.consent_forms FOR INSERT WITH CHECK (
  confirms_18_plus = true
  AND confirms_not_impaired = true
  AND confirms_accurate_health_info = true
  AND understands_risks = true
  AND understands_aftercare = true
  AND consents_to_procedure = true
  AND length(trim(signature_name)) > 0
  AND length(trim(id_photo_path)) > 0
);

-- Private bucket: clients can upload their ID photo, only admins can read it back.
INSERT INTO storage.buckets (id, name, public) VALUES ('id-photos', 'id-photos', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public upload id-photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'id-photos');
CREATE POLICY "admin read id-photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'id-photos' AND public.is_admin());
CREATE POLICY "admin delete id-photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'id-photos' AND public.is_admin());
