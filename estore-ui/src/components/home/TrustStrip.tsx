import { Truck, Shield, Headphones, type LucideIcon } from "lucide-react";

const trustItems: [LucideIcon, string, string][] = [
  [Truck, "Livraison gratuite", "Dès 50€ d'achat"],
  [Shield, "Garantie 2 ans", "Sur tous les produits"],
  [Headphones, "Support 7j/7", "Une équipe à votre écoute"],
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {trustItems.map(([Icon, title, subtitle]) => (
          <div key={title} className="flex items-center gap-4 group cursor-default">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="font-bold text-sm">{title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
