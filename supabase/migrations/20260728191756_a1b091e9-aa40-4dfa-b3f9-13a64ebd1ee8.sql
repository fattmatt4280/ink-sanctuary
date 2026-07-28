CREATE TABLE IF NOT EXISTS public.admin_authorized_emails (
  email text PRIMARY KEY,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_authorized_emails_normalized_email CHECK (
    email = lower(btrim(email))
    AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  )
);

GRANT ALL ON public.admin_authorized_emails TO service_role;

ALTER TABLE public.admin_authorized_emails ENABLE ROW LEVEL SECURITY;

INSERT INTO public.admin_authorized_emails (email, note)
VALUES
  ('leontattoo92@gmail.com', 'Original studio administrator'),
  ('dreamtattoocompany@gmail.com', 'Additional studio administrator')
ON CONFLICT (email) DO UPDATE
SET note = EXCLUDED.note;