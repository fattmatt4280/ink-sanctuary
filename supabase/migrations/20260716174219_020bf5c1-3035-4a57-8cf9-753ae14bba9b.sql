
-- Roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- site_content: key/value store for text and small config
CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "admin write site_content" ON public.site_content FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- artists
CREATE TABLE public.artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  specialties text[] NOT NULL DEFAULT '{}',
  bio text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  portrait_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.artists TO anon, authenticated;
GRANT ALL ON public.artists TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.artists TO authenticated;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read artists" ON public.artists FOR SELECT USING (true);
CREATE POLICY "admin write artists" ON public.artists FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER artists_updated BEFORE UPDATE ON public.artists FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- portfolio_items
CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid REFERENCES public.artists(id) ON DELETE SET NULL,
  style text NOT NULL DEFAULT '',
  aspect text NOT NULL DEFAULT 'square',
  image_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_items TO anon, authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read portfolio" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "admin write portfolio" ON public.portfolio_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER portfolio_updated BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- guest_spots
CREATE TABLE public.guest_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid REFERENCES public.artists(id) ON DELETE SET NULL,
  city text NOT NULL,
  venue text NOT NULL DEFAULT '',
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'upcoming',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.guest_spots TO anon, authenticated;
GRANT ALL ON public.guest_spots TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.guest_spots TO authenticated;
ALTER TABLE public.guest_spots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read guest_spots" ON public.guest_spots FOR SELECT USING (true);
CREATE POLICY "admin write guest_spots" ON public.guest_spots FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER guest_spots_updated BEFORE UPDATE ON public.guest_spots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
