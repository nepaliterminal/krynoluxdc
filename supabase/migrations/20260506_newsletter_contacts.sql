-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text UNIQUE NOT NULL,
  active     boolean DEFAULT true,
  source     text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone subscribe"  ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "anon read subs"    ON public.newsletter_subscribers FOR SELECT USING (true);

-- Contact form messages
CREATE TABLE IF NOT EXISTS public.contacts (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  message    text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone contact"      ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "anon read contacts"  ON public.contacts FOR SELECT USING (true);
