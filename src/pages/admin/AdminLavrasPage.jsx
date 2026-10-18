import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, MapPin, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CROPS, PROVINCES } from "@/lib/angola";
import { FarmsMap } from "@/components/admin/farms-map";

export default function AdminLavrasPage() {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = "Lavras Cadastradas — Agriterra";
  }, []);

  const { data: farms = [] } = useQuery({
    queryKey: ["farms"],
    queryFn: async () => {
      const { data, error } = await supabase.from("farms").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return farms.filter((f) =>
      [f.name, f.farmer_name, f.province, f.municipality, f.crop].some((v) => v?.toLowerCase().includes(s))
    );
  }, [farms, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Rede Agriterra</p>
          <h2 className="font-display text-2xl font-bold">Lavras cadastradas ({farms.length})</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Adicionar Lavra
            </Button>
          </DialogTrigger>
          <AddFarmDialog onClose={() => setOpen(false)} onSaved={() => qc.invalidateQueries({ queryKey: ["farms"] })} />
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="relative z-0 min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] lg:col-span-3">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider">Delimitação de área</h3>
          </div>
          <FarmsMap farms={farms} selectedId={selectedId} onSelect={setSelectedId} />
          <p className="mt-3 text-xs text-muted-foreground">
            Use a ferramenta de polígono no mapa para desenhar a área de uma nova lavra e clique na tabela para focar
            uma existente. Centrado em Benguela.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] lg:col-span-2">
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Procurar lavra, agricultor, cultura…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <ul className="max-h-[520px] divide-y divide-border overflow-auto">
            {filtered.map((f) => {
              const active = f.id === selectedId;
              return (
                <li key={f.id}>
                  <button
                    onClick={() => setSelectedId(f.id)}
                    className={`flex w-full items-start justify-between gap-3 p-4 text-left transition cursor-pointer ${
                      active ? "bg-primary/10" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{f.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {f.farmer_name} · {f.contact}
                      </div>
                      <div className="mt-1 text-xs">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">{f.crop}</span>{" "}
                        <span className="text-muted-foreground">
                          · {f.province}/{f.municipality} · {Number(f.area_ha).toFixed(1)} ha
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
            {!filtered.length && (
              <li className="p-6 text-center text-sm text-muted-foreground">Sem resultados.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function AddFarmDialog({ onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    farmer_name: "",
    province: "Benguela",
    municipality: "",
    crop: "Milho",
    contact: "",
    area_ha: 1,
    lat: -12.58,
    lng: 13.41,
  });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("farms").insert({
      ...form,
      area_ha: Number(form.area_ha),
      lat: Number(form.lat),
      lng: Number(form.lng),
    });
    setSaving(false);
    if (error) {
      toast.error("Erro ao guardar: " + error.message);
      return;
    }
    toast.success("Lavra adicionada à rede Agriterra.");
    onSaved();
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Nova lavra</DialogTitle>
        <DialogDescription>Adicione um agricultor à rede monitorada pela Agriterra.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Nome da lavra</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1.5" />
        </div>
        <div>
          <Label>Nome do agricultor</Label>
          <Input value={form.farmer_name} onChange={(e) => setForm({ ...form, farmer_name: e.target.value })} required className="mt-1.5" />
        </div>
        <div>
          <Label>Província</Label>
          <Select value={form.province} onValueChange={(v) => setForm({ ...form, province: v })}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Município</Label>
          <Input value={form.municipality} onChange={(e) => setForm({ ...form, municipality: e.target.value })} required className="mt-1.5" />
        </div>
        <div>
          <Label>Cultura</Label>
          <Select value={form.crop} onValueChange={(v) => setForm({ ...form, crop: v })}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CROPS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Contacto (SMS)</Label>
          <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="+244 …" required className="mt-1.5" />
        </div>
        <div>
          <Label>Área (ha)</Label>
          <Input type="number" step="0.1" value={form.area_ha} onChange={(e) => setForm({ ...form, area_ha: Number(e.target.value) })} className="mt-1.5" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Latitude</Label>
            <Input type="number" step="0.0001" value={form.lat} onChange={(e) => setForm({ ...form, lat: Number(e.target.value) })} className="mt-1.5" />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input type="number" step="0.0001" value={form.lng} onChange={(e) => setForm({ ...form, lng: Number(e.target.value) })} className="mt-1.5" />
          </div>
        </div>
        <DialogFooter className="sm:col-span-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? "A guardar…" : "Guardar lavra"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
