import { Sprout } from "lucide-react";

export function AgriterraLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
        <Sprout className="h-5 w-5" />
      </span>
      {!compact && (
        <span className="font-display text-xl font-bold tracking-tight">
          Agri<span className="text-primary">terra</span>
        </span>
      )}
    </div>
  );
}
