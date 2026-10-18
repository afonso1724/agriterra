import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { AgriterraLogo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-1">
          <AgriterraLogo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Agritech angolano que liga o campo ao mercado — do alerta SMS à entrega no supermercado.
          </p>
        </div>

        <div className="invisible">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider">Navegação</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Início</Link></li>
            <li><Link to="/sobre" className="hover:text-foreground">Sobre Nós</Link></li>
            <li><Link to="/#equipa" className="hover:text-foreground">Equipa</Link></li>
            <li><Link to="/contactos" className="hover:text-foreground invisible">Contactos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider">Contactos</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              Luanda, Angola
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              +244 947 854 364
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              contato@agriterra.ao
            </li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Facebook" className="rounded-full bg-background p-2 text-muted-foreground hover:text-primary">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="rounded-full bg-background p-2 text-muted-foreground hover:text-primary">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 py-5">
        <p className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Agriterra. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
