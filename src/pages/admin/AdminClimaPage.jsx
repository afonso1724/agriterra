import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Cloud,
  CloudRain,
  Droplets,
  Send,
  Sparkles,
  Sun,
  Thermometer,
  Wind,
  Copy,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ANGOLA_REGIONS } from "@/lib/angola";
import { fetchWeather } from "@/lib/weather";
import { buildSmsRecommendation } from "@/lib/sms-recommendation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminClimaPage() {
  const qc = useQueryClient();
  const [regionId, setRegionId] = useState(ANGOLA_REGIONS[0].id);
  const region = ANGOLA_REGIONS.find((r) => r.id === regionId);
  const [data, setData] = useState(null);
  const [smsDraft, setSmsDraft] = useState("");

  useEffect(() => {
    document.title = "Clima em Tempo Real — Agriterra";
  }, []);

  const load = useMutation({
    mutationFn: async () => fetchWeather({ lat: region.lat, lng: region.lng }),
    onSuccess: (r) => {
      setData(r);
      if (!r.ok) toast.error(r.error ?? "Falha ao obter dados meteorológicos.");
    },
  });

  const generate = () => {
    if (!data?.ok || !data.current) return;
    const msg = buildSmsRecommendation({
      region: region.province,
      tempC: data.current.tempC,
      humidity: data.current.humidity,
      precipMm: data.current.precipMm,
    });
    setSmsDraft(msg);
  };

  const sendToRegion = async () => {
    if (!smsDraft) return;
    const { error } = await supabase.from("alerts").insert({
      region: region.province,
      message: smsDraft,
      status: "sent",
    });
    if (error) return toast.error(error.message);
    toast.success(`SMS enviado para lavras da região ${region.province}.`);
    qc.invalidateQueries({ queryKey: ["dashboard-counts"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Fonte: OpenWeatherMap · dados em tempo real</p>
          <h2 className="font-display text-2xl font-bold">Clima em {region.province}</h2>
        </div>
        <div className="flex gap-2">
          <Select value={regionId} onValueChange={setRegionId}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ANGOLA_REGIONS.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => load.mutate()} disabled={load.isPending}>
            {load.isPending ? "A obter…" : "Actualizar dados"}
          </Button>
        </div>
      </div>

      {!data && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Escolha uma região e clique em <strong>Actualizar dados</strong> para consultar o OpenWeatherMap em tempo real.
        </div>
      )}

      {data?.ok && data.current && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={Thermometer} label="Temperatura" value={`${data.current.tempC.toFixed(1)}°C`} tone="alert" />
            <Metric icon={Droplets} label="Humidade Relativa" value={`${data.current.humidity}%`} tone="primary" />
            <Metric icon={CloudRain} label="Precipitação (1h)" value={`${data.current.precipMm.toFixed(1)} mm`} tone="primary" />
            <Metric icon={Wind} label="Vento" value={`${data.current.windSpeed.toFixed(1)} m/s`} tone="earth" />
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] lg:col-span-3">
              <div className="mb-2 flex items-center gap-2">
                <Sun className="h-4 w-4 text-alert" />
                <h3 className="font-display text-lg font-bold">Previsão — próximos 5 dias</h3>
              </div>
              <p className="mb-3 text-xs capitalize text-muted-foreground">Actual: {data.current.description}</p>
              <div className="h-72">
                <ResponsiveContainer>
                  <LineChart data={data.forecast} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="dt" fontSize={11} tickFormatter={(d) => d.slice(5)} />
                    <YAxis yAxisId="left" fontSize={11} />
                    <YAxis yAxisId="right" orientation="right" fontSize={11} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                    <Legend />
                    <Line yAxisId="left" name="Temp (°C)" type="monotone" dataKey="tempC" stroke="var(--alert)" strokeWidth={2.5} dot />
                    <Line yAxisId="left" name="Humidade (%)" type="monotone" dataKey="humidity" stroke="var(--primary)" strokeWidth={2.5} dot />
                    <Line yAxisId="right" name="Chuva (mm)" type="monotone" dataKey="precipMm" stroke="var(--earth)" strokeWidth={2.5} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-br from-primary to-primary-glow p-6 text-primary-foreground shadow-[var(--shadow-elegant)] lg:col-span-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <h3 className="font-display text-lg font-bold">Recomendação SMS Agriterra</h3>
              </div>
              <p className="mt-2 text-sm text-primary-foreground/85">
                Gerada com base nas leituras actuais da região.
              </p>
              <Button onClick={generate} variant="secondary" className="mt-4 w-full font-semibold">
                <Sparkles className="mr-2 h-4 w-4" /> Gerar recomendação
              </Button>

              {smsDraft && (
                <>
                  <Textarea
                    value={smsDraft}
                    onChange={(e) => setSmsDraft(e.target.value)}
                    rows={5}
                    className="mt-4 border-white/20 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/60"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="border-white/40 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                      onClick={() => {
                        navigator.clipboard.writeText(smsDraft);
                        toast.success("Copiado.");
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copiar
                    </Button>
                    <Button
                      variant="secondary"
                      className="font-semibold"
                      onClick={sendToRegion}
                    >
                      <Send className="mr-2 h-4 w-4" /> Enviar para lavras da região
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {data && !data.ok && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
          <div className="flex items-center gap-2 font-semibold">
            <Cloud className="h-4 w-4" /> Não foi possível obter dados
          </div>
          <p className="mt-2">{data.error}</p>
        </div>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }) {
  const bg =
    tone === "primary" ? "bg-primary text-primary-foreground" :
    tone === "earth" ? "bg-earth text-earth-foreground" :
    "bg-alert text-alert-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <span className={`grid h-9 w-9 place-items-center rounded-lg ${bg}`}><Icon className="h-4 w-4" /></span>
      </div>
      <div className="mt-3 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}
