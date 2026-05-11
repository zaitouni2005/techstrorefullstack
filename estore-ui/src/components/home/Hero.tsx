import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import hero from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> Nouveautés 2025
            </span>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-[1.05]">
              Le meilleur de la{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                high-tech
              </span>
              , livré chez vous.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Smartphones, ordinateurs, tablettes et accessoires premium. Sélection rigoureuse, prix
              imbattables.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] hover:bg-primary-glow transition"
              >
                Voir les produits <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent transition"
              >
                Explorer les offres
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                ["+200", "marques"],
                ["24h", "livraison"],
                ["4.8★", "satisfaction"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl font-bold">{n}</div>
                  <div className="text-xs text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <div
              className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-primary/20 to-primary-glow/10 blur-3xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elegant)]">
              <img
                src={hero}
                alt="Produits high-tech TechStore"
                width={1536}
                height={1024}
                loading="eager"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
