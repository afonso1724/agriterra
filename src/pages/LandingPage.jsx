import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Signal,
  Truck,
  Sprout,
  Shield,
  MapPin,
  Zap,
  Users,
  Github,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { TEAM_MEMBERS, memberInitials } from "@/data/team";
import heroImg from "@/assets/hero-farmland.jpg";
import logisticsImg from "@/assets/logistics.jpg";

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    document.title = "Agriterra — Salvar colheitas, conectar mercados";
  }, []);

  useEffect(() => {
    if (location.hash === "#equipa") {
      requestAnimationFrame(() => {
        document.getElementById("equipa")?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [location.hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <StoryTeaser />
        <Team />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Lavras angolanas ao pôr-do-sol"
          className="h-full w-full object-cover"
          width={1600}
          height={1000}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-24 sm:px-6 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-12 lg:items-center lg:py-32 lg:px-8">
        <div className="lg:col-span-8">
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.05] text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
            Salvamos colheitas. <br />
            <span className="text-primary-glow">Ligamos o campo ao mercado.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 drop-shadow sm:text-xl">
            Uma plataforma <strong>2 em 1</strong>: alertas SMS que chegam ao agricultor sem
            internet, e logística que leva a produção da lavra directamente ao supermercado.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-14 px-8 text-base font-semibold shadow-[var(--shadow-elegant)]">
              <Link to="/contactos">
                Fale connosco <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 border-white/40 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              <Link to="/sobre">Conhecer a nossa missão</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { value: "SMS", label: "Alertas sem precisar de internet" },
    { value: "24/7", label: "Dados climáticos em tempo real" },
    { value: "0km", label: "Da lavra ao supermercado" },
  ];
  return (
    <section className="border-b border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8">
        {items.map((it) => (
          <div key={it.label} className="text-center">
            <div className="font-display text-4xl font-bold text-primary lg:text-5xl">{it.value}</div>
            <div className="mt-2 text-sm text-muted-foreground">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Duas soluções, uma missão
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          Tecnologia que atravessa a divisão digital
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Do satélite ao telemóvel do agricultor. Da lavra à prateleira do supermercado.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <article className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] lg:p-10">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Signal className="h-7 w-7" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-bold">Monitorização Inteligente por SMS</h3>
            <p className="mt-3 text-muted-foreground">
              Recolhemos dados climáticos em tempo real e enviamos alertas personalizados por SMS
              directamente ao telemóvel do agricultor. <strong>Sem app. Sem internet.</strong>
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Recomendações accionáveis em português e linguas nacionais
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Delimitação por polígono de cada lavra
              </li>
              <li className="flex items-start gap-2">
                <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Adaptado à cultura: milho, batata, mandioca, feijão, café
              </li>
            </ul>
          </div>
        </article>

        <article className="group relative overflow-hidden rounded-3xl border border-border bg-earth p-8 text-earth-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] lg:p-10">
          <img
            src={logisticsImg}
            alt=""
            loading="lazy"
            width={1400}
            height={900}
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-earth-foreground text-earth shadow-lg">
              <Truck className="h-7 w-7" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-bold">Logística Agriterra</h3>
            <p className="mt-3 text-earth-foreground/90">
              Ligamos lavras directamente a supermercados. Menos
              intermediários, menos desperdício, mais valor para o agricultor.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Truck className="mt-0.5 h-4 w-4 shrink-0" />
                Rotas coordenadas por entregadores parceiros
              </li>
              <li className="flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                Contratos activos com cadeias nacionais
              </li>
              <li className="flex items-start gap-2">
                <Zap className="mt-0.5 h-4 w-4 shrink-0" />
                Kanban em tempo real: recolha → trânsito → entrega
              </li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}

function StoryTeaser() {
  return (
    <section className="border-y border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-bold uppercase tracking-wider text-earth">A nossa missão</span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Todos os anos, colheitas inteiras morrem em silêncio.
        </h2>
        <p className="mt-6 text-lg text-muted-foreground">
          Chuvas que não foram anunciadas. Secas sem aviso. Produção que apodrece à espera de
          transporte. A Agriterra existe para acabar com essas duas perdas — usando a tecnologia
          mais poderosa que o campo já tem: o telemóvel do agricultor.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" variant="outline">
            <Link to="/sobre">Ler a história completa</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TeamSocialLink({ href, label, children }) {
  if (!href || href === "#") {
    return (
      <span
        className="grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground/50"
        aria-hidden
        title={`${label} (em breve)`}
      >
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      {children}
    </a>
  );
}

function Team() {
  return (
    <section id="equipa" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <Users className="h-4 w-4" /> Nossa equipa
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
          Quatro pessoas, uma missão no campo
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Somos uma equipa angolana a unir tecnologia, clima e logística para que nenhuma colheita
          se perca por falta de informação ou de escoamento.
        </p>
      </div>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM_MEMBERS.map((member, index) => (
          <li key={`${member.name}-${index}`}>
            <article className="flex h-full flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-primary/5 shadow-inner">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt=""
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-primary">
                    {memberInitials(member.name)}
                  </div>
                )}
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{member.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{member.role}</p>
              <div className="mt-5 flex justify-center gap-2">
                <TeamSocialLink href={member.social?.linkedin} label={`LinkedIn de ${member.name}`}>
                  <Linkedin className="h-4 w-4" />
                </TeamSocialLink>
                <TeamSocialLink href={member.social?.instagram} label={`Instagram de ${member.name}`}>
                  <Instagram className="h-4 w-4" />
                </TeamSocialLink>
                <TeamSocialLink href={member.social?.github} label={`GitHub de ${member.name}`}>
                  <Github className="h-4 w-4" />
                </TeamSocialLink>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground shadow-[var(--shadow-elegant)] lg:p-16">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Pronto para transformar o campo angolano?
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/80">
              Se é agricultor, comprador ou quer uma parceria, diga-nos como podemos ajudar e respondemos
              em 24h úteis.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="h-14 shrink-0 px-8 text-base font-bold">
            <Link to="/contactos">
              Contactar a Agriterra <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
