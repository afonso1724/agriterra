import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Sprout,
  Truck,
  Bell,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const harvestData = [
  { m: "Jan", milho: 42, batata: 28, feijao: 15 },
  { m: "Fev", milho: 48, batata: 30, feijao: 18 },
  { m: "Mar", milho: 55, batata: 34, feijao: 22 },
  { m: "Abr", milho: 60, batata: 32, feijao: 25 },
  { m: "Mai", milho: 72, batata: 38, feijao: 28 },
  { m: "Jun", milho: 68, batata: 40, feijao: 30 },
  { m: "Jul", milho: 80, batata: 45, feijao: 34 },
];

const deliveriesData = [
  { m: "Jan", entregas: 24 },
  { m: "Fev", entregas: 31 },
  { m: "Mar", entregas: 38 },
  { m: "Abr", entregas: 44 },
  { m: "Mai", entregas: 52 },
  { m: "Jun", entregas: 61 },
  { m: "Jul", entregas: 73 },
];

export default function AdminDashboardPage() {
  useEffect(() => {
    document.title = "Dashboard — Agriterra Admin";
  }, []);

  const { data } = useQuery({
    queryKey: ["dashboard-counts"],
    queryFn: async () => {
      const [farms, deliveries, alerts] = await Promise.all([
        supabase.from("farms").select("id, area_ha"),
        supabase.from("deliveries").select("id, status"),
        supabase
          .from("alerts")
          .select("id, status, message, created_at, region")
          .order("created_at", { ascending: false })
          .limit(6),
      ]);
      const totalFarms = farms.data?.length ?? 0;
      const totalArea = (farms.data ?? []).reduce((s, f) => s + Number(f.area_ha ?? 0), 0);
      const activeDeliveries = (deliveries.data ?? []).filter((d) => d.status !== "delivered").length;
      const weekAlerts = alerts.data?.length ?? 0;
      const alertStatusCounts = { sent: 0, pending: 0, failed: 0 };
      (alerts.data ?? []).forEach((a) => (alertStatusCounts[a.status] = (alertStatusCounts[a.status] ?? 0) + 1));
      return {
        totalFarms,
        totalArea,
        activeDeliveries,
        weekAlerts,
        alertStatusCounts,
        recentAlerts: alerts.data ?? [],
      };
    },
  });

  const metrics = [
    { label: "Agricultores Registados", value: data?.totalFarms ?? "—", icon: Users, tone: "primary" },
    { label: "Hectares Monitorizados", value: data ? `${data.totalArea.toFixed(1)} ha` : "—", icon: Sprout, tone: "earth" },
    { label: "Entregas Activas", value: data?.activeDeliveries ?? "—", icon: Truck, tone: "primary" },
    { label: "Alertas (últ. 7 dias)", value: data?.weekAlerts ?? "—", icon: Bell, tone: "alert" },
  ];

  const pieData = data
    ? [
        { name: "Enviados", value: data.alertStatusCounts.sent, color: "var(--primary)" },
        { name: "Pendentes", value: data.alertStatusCounts.pending, color: "var(--alert)" },
        { name: "Falhados", value: data.alertStatusCounts.failed, color: "var(--destructive)" },
      ]
    : [];

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          const bg =
            m.tone === "primary" ? "bg-primary text-primary-foreground" :
            m.tone === "earth" ? "bg-earth text-earth-foreground" :
            "bg-alert text-alert-foreground";
          return (
            <div
              key={m.label}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </div>
                  <div className="mt-2 font-display text-3xl font-bold">{m.value}</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                    <TrendingUp className="h-3 w-3" /> tendência positiva
                  </div>
                </div>
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl shadow ${bg}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">Previsão de Colheita</h3>
              <p className="text-xs text-muted-foreground">Toneladas estimadas por cultura</p>
            </div>
            <Badge variant="secondary">2026</Badge>
          </div>
          <div className="h-72 min-w-0 w-full max-w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={harvestData} margin={{ left: 0, right: 4, top: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="milho" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="batata" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--earth)" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="var(--earth)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="feijao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--alert)" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="var(--alert)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="m" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Legend />
                <Area type="monotone" dataKey="milho" stroke="var(--primary)" fill="url(#milho)" strokeWidth={2} />
                <Area type="monotone" dataKey="batata" stroke="var(--earth)" fill="url(#batata)" strokeWidth={2} />
                <Area type="monotone" dataKey="feijao" stroke="var(--alert)" fill="url(#feijao)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6">
          <h3 className="font-display text-lg font-bold">Status dos Alertas</h3>
          <p className="text-xs text-muted-foreground">Semana em curso</p>
          <div className="mt-4 h-64 min-w-0 w-full max-w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={72} paddingAngle={3}>
                  {pieData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6 lg:col-span-1">
          <h3 className="font-display text-lg font-bold">Entregas Mensais</h3>
          <p className="text-xs text-muted-foreground">Cadeias parceiras</p>
          <div className="mt-4 h-64 min-w-0 w-full max-w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveriesData} margin={{ left: 0, right: 4, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="m" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Bar dataKey="entregas" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6 lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold">Alertas Recentes</h3>
            <p className="text-xs text-muted-foreground">SMS enviados pela Agriterra</p>
          </div>
          <div className="divide-y divide-border overflow-hidden">
            {(data?.recentAlerts ?? []).map((a) => (
              <div key={a.id} className="flex min-w-0 flex-col gap-2 py-3 sm:flex-row sm:items-start sm:gap-3">
                <StatusPill status={a.status} />
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="break-words text-xs text-muted-foreground">
                    {a.region} · {new Date(a.created_at).toLocaleString("pt-PT", { dateStyle: "short", timeStyle: "short" })}
                  </div>
                  <div className="mt-0.5 line-clamp-2 break-words text-sm">{a.message}</div>
                </div>
              </div>
            ))}
            {!data?.recentAlerts?.length && (
              <div className="py-6 text-center text-sm text-muted-foreground">Ainda sem alertas.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    sent: { label: "Enviado", cls: "bg-primary/15 text-primary" },
    pending: { label: "Pendente", cls: "bg-alert/20 text-alert-foreground" },
    failed: { label: "Falhou", cls: "bg-destructive/15 text-destructive" },
  };
  const s = map[status] ?? { label: status, cls: "bg-muted text-foreground" };
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}
