import { useState } from "react";
import { Star, SlidersHorizontal, Loader2 } from "lucide-react";
import { brands, categories } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useProductFilters } from "@/hooks/use-product-filters";

const PER_PAGE = 8;

export function ProductsPage() {
  const { filtered, isLoading, filters } = useProductFilters();
  const { cat, setCat, selectedBrands, setBrands, price, setPrice, minRating, setMinRating } =
    filters;

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const view = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold">Catalogue</h1>
        <p className="text-muted-foreground mt-1">
          {isLoading ? "Chargement..." : `${filtered.length} produits disponibles`}
        </p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Filters */}
        <aside className={`${open ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-24 space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <FilterSection title="Catégorie">
              <button
                onClick={() => {
                  setCat("");
                  setPage(1);
                }}
                className={`block w-full text-left text-sm py-1.5 transition-colors ${
                  !cat
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Toutes
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => {
                    setCat(c.slug);
                    setPage(1);
                  }}
                  className={`block w-full text-left text-sm py-1.5 transition-colors ${
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
                value={price}
                onValueChange={(v) => {
                  setPrice(v as [number, number]);
                  setPage(1);
                }}
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground font-medium">
                <span>{price[0]}€</span>
                <span>{price[1]}€</span>
              </div>
            </FilterSection>

            <FilterSection title="Marque">
              <div className="space-y-2">
                {brands.map((b) => (
                  <label
                    key={b}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground transition-colors group"
                  >
                    <Checkbox
                      checked={selectedBrands.includes(b)}
                      onCheckedChange={(v) => {
                        setBrands((cur) => (v ? [...cur, b] : cur.filter((x) => x !== b)));
                        setPage(1);
                      }}
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
                    onClick={() => {
                      setMinRating(r);
                      setPage(1);
                    }}
                    className={`flex items-center gap-1 text-sm py-1 transition-colors ${
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
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden mb-6 inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-semibold bg-card shadow-sm hover:bg-accent transition"
          >
            <SlidersHorizontal className="h-4 w-4" />{" "}
            {open ? "Masquer les filtres" : "Afficher les filtres"}
          </button>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground animate-in fade-in duration-500">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary/40" />
              <p className="font-medium">Chargement du catalogue...</p>
            </div>
          ) : view.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-border p-20 text-center text-muted-foreground bg-muted/5 animate-in zoom-in-95 duration-300">
              <p className="text-lg font-semibold">Aucun résultat</p>
              <p className="text-sm mt-1">Essayez d'ajuster vos critères de recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
              {view.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {!isLoading && pages > 1 && (
            <div className="mt-16 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setPage(n);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`h-11 w-11 rounded-xl text-sm font-bold transition-all duration-200 ${
                    page === n
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                      : "bg-card border border-border hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
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
