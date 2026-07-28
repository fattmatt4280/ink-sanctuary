
-- 1. Harden consultation_requests INSERT: replace WITH CHECK (true) with basic validation
DROP POLICY IF EXISTS "public submit consultation" ON public.consultation_requests;
CREATE POLICY "public submit consultation"
  ON public.consultation_requests
  FOR INSERT
  TO public
  WITH CHECK (
    length(btrim(name)) BETWEEN 1 AND 200
    AND length(btrim(email)) BETWEEN 3 AND 320
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(btrim(tattoo_idea)) BETWEEN 1 AND 5000
    AND length(coalesce(phone, '')) <= 40
    AND length(coalesce(preferred_artist, '')) <= 120
    AND length(coalesce(placement, '')) <= 200
    AND length(coalesce(size_estimate, '')) <= 120
    AND length(coalesce(budget_range, '')) <= 120
    AND length(coalesce(preferred_dates, '')) <= 500
    AND length(coalesce(notes, '')) <= 5000
  );

-- 2. Move SECURITY DEFINER helpers out of the API-exposed public schema.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT private.has_role(auth.uid(), 'admin'::public.app_role)
$$;

-- The RLS runtime evaluates policy expressions as the querying role, so it
-- needs EXECUTE on these helpers. Grant on the private-schema copies only.
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated, service_role;

-- 3. Rewrite every RLS policy that referenced public.is_admin() to use the private copy.
-- blog_posts
DROP POLICY IF EXISTS "Admins can delete posts" ON public.blog_posts;
CREATE POLICY "Admins can delete posts" ON public.blog_posts
  FOR DELETE TO authenticated USING (private.is_admin());
DROP POLICY IF EXISTS "Admins can insert posts" ON public.blog_posts;
CREATE POLICY "Admins can insert posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (private.is_admin());
DROP POLICY IF EXISTS "Admins can update posts" ON public.blog_posts;
CREATE POLICY "Admins can update posts" ON public.blog_posts
  FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());
DROP POLICY IF EXISTS "Admins can view all posts" ON public.blog_posts;
CREATE POLICY "Admins can view all posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (private.is_admin());

-- site_content
DROP POLICY IF EXISTS "admin write site_content" ON public.site_content;
CREATE POLICY "admin write site_content" ON public.site_content
  FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

-- artists
DROP POLICY IF EXISTS "admin write artists" ON public.artists;
CREATE POLICY "admin write artists" ON public.artists
  FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

-- guest_spots
DROP POLICY IF EXISTS "admin write guest_spots" ON public.guest_spots;
CREATE POLICY "admin write guest_spots" ON public.guest_spots
  FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

-- portfolio_items
DROP POLICY IF EXISTS "admin write portfolio" ON public.portfolio_items;
CREATE POLICY "admin write portfolio" ON public.portfolio_items
  FOR ALL TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

-- consent_forms
DROP POLICY IF EXISTS "admin delete consent" ON public.consent_forms;
CREATE POLICY "admin delete consent" ON public.consent_forms
  FOR DELETE TO authenticated USING (private.is_admin());
DROP POLICY IF EXISTS "admin read consent" ON public.consent_forms;
CREATE POLICY "admin read consent" ON public.consent_forms
  FOR SELECT TO authenticated USING (private.is_admin());

-- consultation_requests
DROP POLICY IF EXISTS "admin delete consultation" ON public.consultation_requests;
CREATE POLICY "admin delete consultation" ON public.consultation_requests
  FOR DELETE TO authenticated USING (private.is_admin());
DROP POLICY IF EXISTS "admin read consultation" ON public.consultation_requests;
CREATE POLICY "admin read consultation" ON public.consultation_requests
  FOR SELECT TO authenticated USING (private.is_admin());
DROP POLICY IF EXISTS "admin update consultation" ON public.consultation_requests;
CREATE POLICY "admin update consultation" ON public.consultation_requests
  FOR UPDATE TO authenticated USING (private.is_admin()) WITH CHECK (private.is_admin());

-- Storage object policies for site-images
DROP POLICY IF EXISTS "admin delete site-images" ON storage.objects;
CREATE POLICY "admin delete site-images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND private.is_admin());
DROP POLICY IF EXISTS "admin insert site-images" ON storage.objects;
CREATE POLICY "admin insert site-images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images' AND private.is_admin());
DROP POLICY IF EXISTS "admin update site-images" ON storage.objects;
CREATE POLICY "admin update site-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND private.is_admin())
  WITH CHECK (bucket_id = 'site-images' AND private.is_admin());

-- 4. Now safe to drop the public-schema helpers (no policies reference them).
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
