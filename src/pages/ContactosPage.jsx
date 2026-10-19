import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Sprout, ShoppingBag, Handshake } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CROPS, PROVINCES } from "@/lib/angola";

const CONTACT_TYPES = [
  { id: "agricultor", label: "Agricultor", icon: Sprout },
  { id: "comprador", label: "Comprador", icon: ShoppingBag },
  { id: "parcerias", label: "Parcerias", icon: Handshake },
];

export default function ContactosPage() {
  const [sending, setSending] = useState(false);
  const [tipo, setTipo] = useState("agricultor");

  useEffect(() => {
    document.title = "Contactos — Agriterra";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Mensagem enviada. Vamos responder em breve.");
      e.target.reset();
    }, 700);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 pb-6 pt-16 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Contactos</span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Vamos falar sobre o próximo ciclo da sua colheita.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Escolha o seu perfil: agricultor, comprador ou parcerias e preencha os campos que
            fazem sentido para si. Respondemos em 24 horas úteis.
          </p>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-4 lg:col-span-1">
            <InfoRow icon={MapPin} title="Sede">
             Luanda, Angola
            </InfoRow>
            <InfoRow icon={Phone} title="Telefone">
              +244 947 854 364
            </InfoRow>
            <InfoRow icon={Mail} title="Email">
              contato@agriterra.ao
            </InfoRow>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:col-span-2">
            <h2 className="font-display text-2xl font-bold">Fale connosco</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Indique quem está a contactar para recebermos a informação certa.
            </p>

            <Tabs value={tipo} onValueChange={setTipo} className="mt-6">
              <TabsList className="grid h-auto w-full grid-cols-1 gap-1 sm:grid-cols-3">
                {CONTACT_TYPES.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger key={id} value={id} className="gap-2 py-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <form onSubmit={handleSubmit} className="mt-6">
                <input type="hidden" name="tipo" value={tipo} />

                {tipo === "agricultor" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="ag-nome" label="Nome completo" required />
                    <Field id="ag-tel" label="Telemóvel (SMS)" type="tel" placeholder="+244 …" required />
                    <div>
                      <Label htmlFor="ag-prov">Província</Label>
                      <Select name="provincia" required>
                        <SelectTrigger id="ag-prov" className="mt-1.5">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Field id="ag-mun" label="Município" required />
                    <div>
                      <Label htmlFor="ag-cultura">Cultura principal</Label>
                      <Select name="cultura" required>
                        <SelectTrigger id="ag-cultura" className="mt-1.5">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {CROPS.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Field id="ag-area" label="Área aproximada (ha)" type="number" step="0.1" min="0" />
                  </div>
                  <div>
                    <Label htmlFor="ag-msg">O que precisa da Agriterra?</Label>
                    <Textarea id="ag-msg" name="mensagem" rows={4} className="mt-1.5" placeholder="Alertas SMS, escoamento, outra necessidade…" />
                  </div>
                </div>
                )}

                {tipo === "comprador" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="cp-nome" label="Nome de contacto" required />
                    <Field id="cp-empresa" label="Empresa / cadeia" required />
                    <Field id="cp-email" label="Email" type="email" required />
                    <Field id="cp-tel" label="Telefone" type="tel" placeholder="+244 …" />
                    <div className="sm:col-span-2">
                      <Field
                        id="cp-produtos"
                        label="Produtos de interesse"
                        required
                        placeholder="Ex.: batata, milho, mandioca…"
                      />
                    </div>
                    <Field
                      id="cp-volume"
                      label="Volume estimado (ton/mês)"
                      type="number"
                      min="0"
                      placeholder="Opcional"
                    />
                    <Field id="cp-regiao" label="Região de abastecimento" placeholder="Ex.: Luanda, Benguela…" />
                  </div>
                  <div>
                    <Label htmlFor="cp-msg">Detalhes do pedido</Label>
                    <Textarea id="cp-msg" name="mensagem" rows={4} className="mt-1.5" required placeholder="Frequência, certificações, prazos…" />
                  </div>
                </div>
                )}

                {tipo === "parcerias" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="pa-nome" label="Nome de contacto" required />
                    <Field id="pa-org" label="Organização" required />
                    <Field id="pa-email" label="Email" type="email" required />
                    <Field id="pa-tel" label="Telefone" type="tel" placeholder="+244 …" />
                    <div className="sm:col-span-2">
                      <Label htmlFor="pa-tipo">Tipo de parceria</Label>
                      <Select name="tipo_parceria" required>
                        <SelectTrigger id="pa-tipo" className="mt-1.5">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="institucional">Institucional / ONG</SelectItem>
                          <SelectItem value="logistica">Logística & transporte</SelectItem>
                          <SelectItem value="tecnologia">Tecnologia & dados</SelectItem>
                          <SelectItem value="comercial">Comercial / distribuição</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pa-msg">Proposta ou objectivo da parceria</Label>
                    <Textarea id="pa-msg" name="mensagem" rows={5} className="mt-1.5" required />
                  </div>
                </div>
                )}

                <Button type="submit" size="lg" disabled={sending} className="mt-6 w-full sm:w-auto">
                  {sending ? "A enviar…" : "Enviar mensagem"}
                </Button>
              </form>
            </Tabs>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({ id, label, required, className, ...props }) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} required={required} className="mt-1.5" {...props} />
    </div>
  );
}

function InfoRow({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="mt-1 text-sm">{children}</div>
      </div>
    </div>
  );
}
