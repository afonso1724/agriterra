import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AgriterraLogo } from "./logo";

const nav = [
  { to: "/", label: "Início", end: true },
  { to: "/sobre", label: "Sobre Nós" },
  { to: "/#equipa", label: "Equipa", hash: "equipa" },
  { to: "/contactos", label: "Contactos" },
];

function scrollToEquipa() {
  document.getElementById("equipa")?.scrollIntoView({ behavior: "smooth" });
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const goEquipa = (closeSheet = false) => {
    if (closeSheet) setOpen(false);
    if (location.pathname === "/") {
      scrollToEquipa();
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <AgriterraLogo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active =
              item.hash === "equipa"
                ? location.pathname === "/" && location.hash === "#equipa"
                : item.end
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
            if (item.hash === "equipa") {
              return (
                <Link
                  key={item.label}
                  to="/#equipa"
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      scrollToEquipa();
                    }
                  }}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    active ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  active ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mt-2 flex flex-col gap-2">
              <AgriterraLogo />
              <div className="mt-6 flex flex-col gap-1">
                {nav.map((item) =>
                  item.hash === "equipa" ? (
                    <Link
                      key={item.label}
                      to="/#equipa"
                      onClick={(e) => {
                        if (location.pathname === "/") {
                          e.preventDefault();
                          goEquipa(true);
                        } else {
                          setOpen(false);
                        }
                      }}
                      className="rounded-lg px-3 py-3 text-base font-medium hover:bg-accent"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-3 text-base font-medium hover:bg-accent"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
