import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { type Product, type Category } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

// Home Components
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { PromoSection } from "@/components/home/PromoSection";
import { CategoryCard } from "@/components/home/CategoryCard";

export function HomePage() {
  const [popular, setPopular] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const loadHomeData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [popularProducts, saleProducts, cats] = await Promise.all([
        api.products.popular(8),
        api.products.sales(3),
        api.categories.list(),
      ]);
      setPopular(popularProducts);
      setPromos(saleProducts);
      setCategories(cats);
    } catch {
      setError("Impossible de charger les données.");
      toast.error("Erreur lors du chargement de la page");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);
    try {
      await api.newsletter.subscribe(email);
      toast.success("Merci ! Vous êtes bien inscrit à notre newsletter.");
      setEmail("");
    } catch {
      toast.error("Erreur lors de l'inscription");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="bg-background">
      <Hero />
      <TrustStrip />

      {error && (
        <section className="mx-auto max-w-7xl px-4 md:px-6 py-8">
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-6 text-center">
            <p className="text-destructive font-medium">{error}</p>
            <Button onClick={loadHomeData} variant="outline" className="mt-4 gap-2">
              <RotateCcw className="h-4 w-4" /> Réessayer
            </Button>
          </div>
        </section>
      )}

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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-3/4 rounded-4xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        )}
      </section>

      {/* Popular products */}
      <section id="popular-products" className="mx-auto max-w-7xl px-4 md:px-6 py-16">
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
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-3/4 rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {popular.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {isLoading ? (
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-16">
          <div className="h-100 rounded-[3rem] bg-muted animate-pulse" />
        </div>
      ) : (
        <PromoSection promos={promos} />
      )}

      {/* Modern Newsletter/Newsletter CTA */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16">
        <div className="relative rounded-[3rem] bg-card border border-border p-8 md:p-20 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-20" />
          <h2 className="font-display text-3xl md:text-5xl font-bold max-w-2xl mx-auto leading-tight">
            Rejoignez le futur de la technologie.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Inscrivez-vous pour recevoir les dernières nouveautés, des offres exclusives et des
            invitations à nos événements.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="flex-1 rounded-2xl h-12 bg-muted/30"
            />
            <Button
              type="submit"
              disabled={subscribing}
              className="rounded-full min-w-32 h-12 shadow-lg shadow-primary/20"
            >
              {subscribing ? <Loader2 className="h-5 w-5 animate-spin" /> : "S'abonner"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            Pas de spam, promis. Vous pouvez vous désabonner à tout moment.
          </p>
        </div>
      </section>
    </div>
  );
}
