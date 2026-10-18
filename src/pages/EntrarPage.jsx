import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgriterraLogo } from "@/components/site/logo";
import { login } from "@/lib/mock-auth";
import heroImg from "@/assets/hero-farmland.jpg";

export default function EntrarPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Entrar — Agriterra Admin";
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login();
      navigate("/admin");
    }, 500);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={heroImg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <AgriterraLogo />
          <div className="max-w-md">
            <h2 className="font-display text-4xl font-bold leading-tight">
              O campo angolano num painel só.
            </h2>
            <p className="mt-3 text-white/85">
              Lavras, clima, alertas e entregas — tudo em tempo real.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <AgriterraLogo />
          </div>
          <div className="mt-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Lock className="h-3.5 w-3.5" /> Área restrita
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold">Entrar no painel</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Demonstração: use qualquer email e palavra-passe para entrar.
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                defaultValue="admin@agriterra.ao"
                className="mt-1.5 h-12"
              />
            </div>
            <div>
              <Label htmlFor="pwd">Palavra-passe</Label>
              <Input id="pwd" type="password" required defaultValue="demo" className="mt-1.5 h-12" />
            </div>
            <Button type="submit" size="lg" className="mt-2 h-12 w-full font-semibold" disabled={loading}>
              {loading ? "A entrar…" : (<>Entrar <ArrowRight className="ml-2 h-4 w-4" /></>)}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Agriterra · Painel Administrativo
          </p>
        </div>
      </div>
    </div>
  );
}
