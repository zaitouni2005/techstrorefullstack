import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { type Product, categories } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/services/api";

// Home Components
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { PromoSection } from "@/components/home/PromoSection";
import { CategoryCard } from "@/components/home/CategoryCard";

export function HomePage() {
  const [popular, setPopular] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setIsLoading(true);
      const allProducts = await api.products.list();
      setPopular(allProducts.slice(0, 8));
      setPromos(allProducts.filter((p) => p.oldPrice).slice(0, 3));
      setIsLoading(false);
    };
    loadHomeData();
  }, []);

  return (
    <div className="bg-background">
      <Hero />
      <TrustStrip />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 text-center md:text-left">
          <div className="w-full">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Catégories
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Trouvez exactement ce que vous cherchez.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* Popular products */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              Les Incontournables
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Les coups de cœur de notre communauté.
            </p>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition"
          >
            Tout voir{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {popular.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {isLoading ? (
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-16">
          <div className="h-[400px] rounded-[3rem] bg-muted animate-pulse" />
        </div>
      ) : (
        <PromoSection promos={promos} />
      )}

      {/* Modern Newsletter/Newsletter CTA */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-24">
        <div className="relative rounded-[3rem] bg-card border border-border p-8 md:p-20 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
          <h2 className="font-display text-3xl md:text-5xl font-bold max-w-2xl mx-auto leading-tight">
            Rejoignez le futur de la technologie.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Inscrivez-vous pour recevoir les dernières nouveautés, des offres exclusives et des
            invitations à nos événements.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              className="flex-1 px-6 py-4 rounded-full bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
            />
            <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary-glow transition shadow-lg shadow-primary/20">
              S'abonner
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Pas de spam, promis. Vous pouvez vous désabonner à tout moment.
          </p>
        </div>
      </section>
    </div>
  );
}
