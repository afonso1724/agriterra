import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Store, User, Truck, Plus, Package, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const COLUMNS = [
  { id: "ready", label: "Pronto para Recolha", icon: Package, tone: "bg-earth text-earth-foreground" },
  { id: "in_transit", label: "Em Trânsito", icon: Truck, tone: "bg-alert text-alert-foreground" },
  { id: "delivered", label: "Entregue no Supermercado", icon: CheckCircle2, tone: "bg-primary text-primary-foreground" },
];

export default function AdminLogisticaPage() {
  const qc = useQueryClient();
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    document.title = "Logística e Entregas — Agriterra";
  }, []);

  const { data: deliveries = [] } = useQuery({
    queryKey: ["deliveries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("deliveries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: farms = [] } = useQuery({ queryKey: ["farms"], queryFn: async () => (await supabase.from("farms").select("*")).data ?? [] });
  const { data: supermarkets = [] } = useQuery({ queryKey: ["supermarkets"], queryFn: async () => (await supabase.from("supermarkets").select("*")).data ?? [] });
  const { data: drivers = [] } = useQuery({ queryKey: ["drivers"], queryFn: async () => (await supabase.from("drivers").select("*")).data ?? [] });

  const farmMap = useMemo(() => Object.fromEntries(farms.map((f) => [f.id, f])), [farms]);
  const smMap = useMemo(() => Object.fromEntries(supermarkets.map((s) => [s.id, s])), [supermarkets]);
  const drMap = useMemo(() => Object.fromEntries(drivers.map((d) => [d.id, d])), [drivers]);

  const onDragEnd = async (e) => {
    setActiveId(null);
    if (!e.over) return;
    const id = e.active.id;
    const to = e.over.id;
    const d = deliveries.find((x) => x.id === id);
    if (!d || d.status === to) return;
    qc.setQueryData(["deliveries"], (old) => old?.map((x) => (x.id === id ? { ...x, status: to } : x)));
    const { error } = await supabase.from("deliveries").update({ status: to }).eq("id", id);
    if (error) {
      toast.error("Falha ao actualizar entrega.");
      qc.invalidateQueries({ queryKey: ["deliveries"] });
    } else {
      toast.success("Entrega actualizada.");
    }
  };

  const activeDelivery = deliveries.find((d) => d.id === activeId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Coordenação de recolha e entrega</p>
          <h2 className="font-display text-2xl font-bold">Logística Agriterra</h2>
        </div>
        <NewDeliveryDialog farms={farms} supermarkets={supermarkets} drivers={drivers} />
      </div>

      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban de Entregas</TabsTrigger>
          <TabsTrigger value="drivers">Entregadores</TabsTrigger>
          <TabsTrigger value="supermarkets">Supermercados</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-4">
          <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={onDragEnd}>
            <div className="grid gap-4 lg:grid-cols-3">
              {COLUMNS.map((col) => {
                const items = deliveries.filter((d) => d.status === col.id);
                const Icon = col.icon;
                return (
                  <DroppableColumn key={col.id} id={col.id}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className={`grid h-8 w-8 place-items-center rounded-lg ${col.tone}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="flex-1 font-display font-bold">{col.label}</h3>
                      <Badge variant="secondary">{items.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {items.map((d) => (
                        <DraggableCard
                          key={d.id}
                          delivery={d}
                          farm={farmMap[d.farm_id ?? ""]}
                          supermarket={smMap[d.supermarket_id ?? ""]}
                          driver={drMap[d.driver_id ?? ""]}
                        />
                      ))}
                      {!items.length && (
                        <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                          Arraste uma entrega para aqui.
                        </div>
                      )}
                    </div>
                  </DroppableColumn>
                );
              })}
            </div>
            <DragOverlay>
              {activeDelivery && (
                <DeliveryCard
                  delivery={activeDelivery}
                  farm={farmMap[activeDelivery.farm_id ?? ""]}
                  supermarket={smMap[activeDelivery.supermarket_id ?? ""]}
                  driver={drMap[activeDelivery.driver_id ?? ""]}
                />
              )}
            </DragOverlay>
          </DndContext>
        </TabsContent>

        <TabsContent value="drivers" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {drivers.map((d) => (
              <div key={d.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.phone}</div>
                  </div>
                  <Badge className={d.status === "available" ? "bg-primary/15 text-primary" : "bg-alert/20 text-alert-foreground"}>
                    {d.status === "available" ? "Disponível" : "Ocupado"}
                  </Badge>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  {d.current_route ? <><strong className="text-foreground">Rota:</strong> {d.current_route}</> : "Sem rota atribuída."}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="supermarkets" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {supermarkets.map((s) => (
              <div key={s.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-earth/15 text-earth">
                    <Store className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.city}</div>
                  </div>
                  <Badge className={s.contract_active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}>
                    {s.contract_active ? "Contrato activo" : "Sem contrato"}
                  </Badge>
                </div>
                <div className="mt-3 text-xs">
                  <span className="text-muted-foreground">Stock solicitado:</span>{" "}
                  <span className="font-medium">{s.requested_stock ?? "—"}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DroppableColumn({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition ${
        isOver ? "ring-2 ring-primary" : ""
      }`}
    >
      {children}
    </div>
  );
}

function DraggableCard(props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: props.delivery.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style} className={isDragging ? "opacity-40" : ""}>
      <DeliveryCard {...props} />
    </div>
  );
}

function DeliveryCard({ delivery, farm, supermarket, driver }) {
  return (
    <div className="cursor-grab rounded-xl border border-border bg-background p-4 shadow-sm transition hover:shadow-md active:cursor-grabbing">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
          {delivery.product}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">{delivery.quantity_kg} kg</span>
      </div>
      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
        <div><strong className="text-foreground">De:</strong> {farm?.name ?? "—"}</div>
        <div><strong className="text-foreground">Para:</strong> {supermarket?.name ?? "—"} ({supermarket?.city ?? ""})</div>
        <div><strong className="text-foreground">Entregador:</strong> {driver?.name ?? "Por atribuir"}</div>
      </div>
    </div>
  );
}

function NewDeliveryDialog({ farms, supermarkets, drivers }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    farm_id: "",
    supermarket_id: "",
    driver_id: "",
    product: "",
    quantity_kg: 100,
  });

  const submit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("deliveries").insert({
      ...form,
      driver_id: form.driver_id || null,
      quantity_kg: Number(form.quantity_kg),
      status: "ready",
    });
    if (error) return toast.error(error.message);
    toast.success("Entrega criada.");
    qc.invalidateQueries({ queryKey: ["deliveries"] });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Nova entrega</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova entrega</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div>
            <Label>Origem (lavra)</Label>
            <Select value={form.farm_id} onValueChange={(v) => setForm({ ...form, farm_id: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Escolher lavra" /></SelectTrigger>
              <SelectContent>{farms.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Destino (supermercado)</Label>
            <Select value={form.supermarket_id} onValueChange={(v) => setForm({ ...form, supermarket_id: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Escolher supermercado" /></SelectTrigger>
              <SelectContent>{supermarkets.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} · {s.city}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Entregador (opcional)</Label>
            <Select value={form.driver_id} onValueChange={(v) => setForm({ ...form, driver_id: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>{drivers.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Produto</Label>
              <Input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} required className="mt-1.5" />
            </div>
            <div>
              <Label>Quantidade (kg)</Label>
              <Input type="number" value={form.quantity_kg} onChange={(e) => setForm({ ...form, quantity_kg: Number(e.target.value) })} className="mt-1.5" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={!form.farm_id || !form.supermarket_id || !form.product}>Criar entrega</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
