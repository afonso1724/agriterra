import { useEffect } from "react";
import { AlertTriangle, HeartHandshake, Sprout, Truck } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import farmerImg from "@/assets/farmer-portrait.jpg";

export default function SobrePage() {
  useEffect(() => {
    document.title = "Sobre Nós — Agriterra";
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">A nossa história</span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-6xl">
            Nascemos para não deixar mais nenhuma colheita morrer em silêncio.
          </h1>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <img
              src={farmerImg}
              alt="Agricultor angolano"
              width={1200}
              height={1400}
              loading="lazy"
              className="rounded-3xl object-cover shadow-[var(--shadow-elegant)]"
            />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground lg:col-span-3">
            <p>
              Em Benguela, no Huambo, na Huíla as pessoas do campo alimentam Angola. Mas todos
              os anos milhares de toneladas de milho, batata e mandioca são perdidas por dois
              motivos evitáveis: <strong className="text-foreground">falta de informação a tempo</strong> e
              <strong className="text-foreground"> falta de escoamento até ao mercado</strong>.
            </p>
            <p>
              A chuva forte que estraga a plantação já era previsível pelo satélite. A batata que
              apodrece à espera de transporte já tinha comprador em Luanda. O elo em falta era
              tecnológico e nenhum agricultor devia ter que descarregar uma app para receber uma
              notícia que lhe pode salvar o ano.
            </p>
            <p>
              Foi por isso que nasceu a <strong className="text-foreground">Agriterra</strong>: uma
              plataforma 2 em 1 que fala com o agricultor por SMS, na sua língua, no seu tempo e
              que ao mesmo tempo organiza a logística para levar a colheita ao supermercado certo,
              no dia certo.
            </p>
          </div>
        </section>

        <section className="border-y border-border/60 bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
              O problema que atacamos
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Problem
                icon={AlertTriangle}
                title="Alertas que não chegam"
                text="Sem internet no campo, previsões meteorológicas ficam presas em capitais e ecrãs e não chegam a quem semeia."
              />
              <Problem
                icon={Truck}
                title="Desperdício logístico"
                text="Produção fica na lavra sem transporte, ou passa por vários intermediários que reduzem o valor recebido pelo agricultor."
              />
              <Problem
                icon={Sprout}
                title="Divisão digital"
                text="Soluções tecnológicas assumem smartphones, cartões e apps. A maioria das lavras angolanas não tem nada disso."
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
            A nossa resposta: <span className="text-primary">2 em 1</span>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Solution
              tone="primary"
              icon={HeartHandshake}
              title="Um SMS que salva uma colheita"
              text="Combinamos dados climáticos reais com o conhecimento da cultura de cada lavra para gerar recomendações em português e nossas linguas nacionais, entregues por SMS. Sem internet. Sem app. Sem barreiras."
            />
            <Solution
              tone="earth"
              icon={Truck}
              title="Da lavra ao supermercado"
              text="Coordenamos entregadores, contratos e rotas para que a produção chegue directamente às cadeias parceiras sem intermediários desnecessários."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Problem({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function Solution({ icon: Icon, title, text, tone }) {
  const wrap =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-earth text-earth-foreground";
  return (
    <div className={`rounded-3xl p-8 shadow-[var(--shadow-elegant)] ${wrap}`}>
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 font-display text-2xl font-bold">{title}</h3>
      <p className="mt-3 opacity-90">{text}</p>
    </div>
  );
}
