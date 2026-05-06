CREATE TABLE IF NOT EXISTS public.site_settings (
  id                    integer PRIMARY KEY DEFAULT 1,
  "siteName"            text DEFAULT 'KrynoluxDC',
  tagline               text DEFAULT 'News by Kids. For the Community.',
  "tickerMsg"           text DEFAULT '',
  "announcementBanner"  text DEFAULT '',
  "announcementColor"   text DEFAULT '#7B2FFF',
  "contactEmail"        text DEFAULT 'contact@krynolux.work',
  "coverageArea"        text DEFAULT 'Fairfax, Loudoun, DC',
  "showWeather"         boolean DEFAULT true,
  "showPoll"            boolean DEFAULT true,
  "maintenanceMode"     boolean DEFAULT false,
  "pollQuestion"        text DEFAULT 'What should we cover more?',
  "pollOptions"         jsonb DEFAULT '["Climate & Environment","School Policies","Local Sports","Youth Entrepreneurs"]'::jsonb,
  CONSTRAINT site_settings_single_row CHECK (id = 1)
);

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "anon write" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
