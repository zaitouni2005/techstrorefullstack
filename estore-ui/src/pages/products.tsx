import { useState, useEffect, useRef } from "react";
import { Star, SlidersHorizontal, Loader2 } from "lucide-react";
import { type Category } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useProductFilters } from "@/hooks/use-product-filters";
import { api } from "@/services/api";
import { toast } from "sonner";

export function ProductsPage() {
  const { products, isLoading, loadingMore, hasMore, error, loadProducts, loadMore, filters } =
    useProductFilters();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allBrands, setAllBrands] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [cats, brs] = await Promise.all([api.categories.list(), api.products.brands()]);
        setAllCategories(cats);
        setAllBrands(brs);
      } catch {
        toast.error("Impossible de charger les filtres");
      }
    };
    loadFilters();
  }, []);

  const {
    cat,
    setCat,
    selectedBrands,
    toggleBrand,
    price,
    setPrice,
    minRating,
    setMinRating,
    minDiscount,
    setMinDiscount,
  } = filters;

  const [localPrice, setLocalPrice] = useState(price);
  const dragging = useRef(false);
  const pMin = price[0];
  const pMax = price[1];
  useEffect(() => {
    if (!dragging.current) setLocalPrice([pMin, pMax]);
  }, [pMin, pMax]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Catalogue</h1>
        <p className="text-muted-foreground mt-1">
          {isLoading ? "Chargement..." : `${products.length} produits affichés`}
        </p>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className={`${open ? "block" : "hidden"} lg:block`}>
          <div className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <FilterSection title="Promotions">
              <div className="space-y-1">
                {[50, 40, 30, 20, 10, 1].map((d) => (
                  <button
                    key={d}
                    onClick={() => setMinDiscount(d)}
                    className={`block w-full text-left text-sm py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded ${
                      minDiscount === d
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d}% et plus
                  </button>
                ))}
                <button
                  onClick={() => setMinDiscount(0)}
                  className={`block w-full text-left text-sm py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded ${
                    minDiscount === 0
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Toutes
                </button>
              </div>
            </FilterSection>

            <FilterSection title="Catégorie">
              <button
                onClick={() => setCat("")}
                className={`block w-full text-left text-sm py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded ${
                  !cat
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Toutes
              </button>
              {allCategories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCat(c.slug)}
                  className={`block w-full text-left text-sm py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded ${
                    cat === c.slug
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </FilterSection>

            <FilterSection title="Prix">
              <Slider
                min={1}
                max={2500}
                step={10}
                value={localPrice}
                onValueChange={(v) => {
                  dragging.current = true;
                  setLocalPrice(v as [number, number]);
                }}
                onValueCommit={(v) => {
                  dragging.current = false;
                  setPrice(v as [number, number]);
                }}
                className="[&>div:first-child>div:first-child]:h-2"
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground font-medium">
                <span>{localPrice[0]}€</span>
                <span>{localPrice[1]}€</span>
              </div>
            </FilterSection>

            <FilterSection title="Marque">
              <div className="space-y-2">
                {allBrands.map((b) => (
                  <label
                    key={b}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground transition-colors group"
                  >
                    <Checkbox
                      checked={selectedBrands.includes(b)}
                      onCheckedChange={() => toggleBrand(b)}
                    />
                    <span
                      className={
                        selectedBrands.includes(b)
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Note minimum">
              <div className="space-y-1">
                {[0, 3, 4, 4.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`flex items-center gap-1 text-sm py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded ${
                      minRating === r
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === 0 ? (
                      "Toutes"
                    ) : (
                      <>
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {r}+
                      </>
                    )}
                  </button>
                ))}
              </div>
            </FilterSection>
          </div>
        </aside>

        <div>
          <Button
            variant="outline"
            onClick={() => setOpen(!open)}
            className="lg:hidden mb-6 rounded-full px-6 py-2.5 h-auto shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />{" "}
            {open ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>

          {error && !isLoading && (
            <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-6 text-center mb-8">
              <p className="text-destructive font-medium">{error}</p>
              <Button onClick={loadProducts} variant="outline" className="mt-4 gap-2">
                <Loader2 className="h-4 w-4" /> Réessayer
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-border p-20 text-center text-muted-foreground bg-muted/5 animate-in zoom-in-95 duration-300">
              <p className="text-lg font-semibold">Aucun résultat</p>
              <p className="text-sm mt-1">Essayez d'ajuster vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && products.length > 0 && (
            <>
              <div ref={sentinelRef} className="h-10" />
              {loadingMore && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                </div>
              )}
              {!hasMore && (
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Tous les produits sont chargés ({products.length} au total).
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border/50 pb-6 last:border-0 last:pb-0">
      <h3 className="font-display text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground/80">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
