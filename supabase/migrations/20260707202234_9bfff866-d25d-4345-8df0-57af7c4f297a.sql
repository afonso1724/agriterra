
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  province TEXT NOT NULL,
  municipality TEXT NOT NULL,
  crop TEXT NOT NULL,
  contact TEXT NOT NULL,
  area_ha NUMERIC NOT NULL DEFAULT 0,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  boundary JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farms TO anon, authenticated;
GRANT ALL ON public.farms TO service_role;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read farms" ON public.farms FOR SELECT USING (true);
CREATE POLICY "public write farms" ON public.farms FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  region TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('sent','pending','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO anon, authenticated;
GRANT ALL ON public.alerts TO service_role;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "public write alerts" ON public.alerts FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','busy')),
  current_route TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drivers TO anon, authenticated;
GRANT ALL ON public.drivers TO service_role;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read drivers" ON public.drivers FOR SELECT USING (true);
CREATE POLICY "public write drivers" ON public.drivers FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.supermarkets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  contract_active BOOLEAN NOT NULL DEFAULT true,
  requested_stock TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supermarkets TO anon, authenticated;
GRANT ALL ON public.supermarkets TO service_role;
ALTER TABLE public.supermarkets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read supermarkets" ON public.supermarkets FOR SELECT USING (true);
CREATE POLICY "public write supermarkets" ON public.supermarkets FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  supermarket_id UUID REFERENCES public.supermarkets(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  product TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('ready','in_transit','delivered')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deliveries TO anon, authenticated;
GRANT ALL ON public.deliveries TO service_role;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read deliveries" ON public.deliveries FOR SELECT USING (true);
CREATE POLICY "public write deliveries" ON public.deliveries FOR ALL USING (true) WITH CHECK (true);
