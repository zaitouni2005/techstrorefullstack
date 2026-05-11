import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Truck, Shield } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const { add } = useCart();

  const [api, setApi] = useState<CarouselApi>();
  const [currentImg, setCurrentImg] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentImg(api.selectedScrollSnap());
    });
  }, [api]);

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Produit introuvable</h1>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const similar = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const slides = product.images.map((src) => ({ src }));

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <nav className="text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">
          Accueil
        </Link>{" "}
        /{" "}
        <Link to="/products" className="hover:text-foreground">
          Produits
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="relative group">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {product.images.map((img, i) => (
                  <CarouselItem key={i}>
                    <div
                      onClick={() => setIsOpen(true)}
                      className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-surface cursor-zoom-in"
                    >
                      {discount > 0 && i === 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute left-6 top-6 z-10 rounded-full px-3 py-1 text-sm font-bold shadow-lg"
                        >
                          -{discount}%
                        </Badge>
                      )}
                      <img src={img} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </div>
            </Carousel>

            <Lightbox
              open={isOpen}
              close={() => setIsOpen(false)}
              index={currentImg}
              slides={slides}
              plugins={[Zoom]}
              controller={{ closeOnBackdropClick: true }}
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300",
                  currentImg === i
                    ? "border-primary ring-4 ring-primary/10 scale-95"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            {product.brand}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black text-foreground mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1 bg-amber-400/10 text-amber-600 px-3 py-1 rounded-full text-sm font-bold">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              {product.rating}
            </div>
            <div
              className={cn(
                "text-sm font-bold px-3 py-1 rounded-full",
                product.stock > 0
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {product.stock > 0 ? `En stock: ${product.stock}` : "Rupture de stock"}
            </div>
          </div>

          <div className="flex items-baseline gap-4 mb-8">
            <div className="font-display text-5xl font-black text-foreground">
              {product.price} €
            </div>
            {product.oldPrice && (
              <div className="text-2xl text-muted-foreground line-through decoration-destructive/30 decoration-2 italic">
                {product.oldPrice} €
              </div>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="h-8 rounded-full px-3 text-sm font-black">
                -{discount}%
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed mb-10 border-l-4 border-primary/20 pl-6 italic">
            "{product.description}"
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <button
              onClick={() => {
                add(product);
                toast.success(`${product.name} ajouté au panier`);
              }}
              className="h-16 flex items-center justify-center gap-3 rounded-2xl bg-primary text-primary-foreground text-lg font-bold shadow-[var(--shadow-elegant)] hover:bg-primary-glow transition-all active:scale-95 group"
            >
              <ShoppingCart className="h-6 w-6 group-hover:animate-bounce" />
              Ajouter au panier
            </button>
            <button
              onClick={() => {
                add(product);
                navigate("/cart");
              }}
              className="h-16 flex items-center justify-center rounded-2xl border-2 border-border bg-background text-foreground text-lg font-bold hover:bg-accent transition-all active:scale-95"
            >
              Acheter maintenant
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="flex flex-col gap-2 rounded-2xl border border-border p-4 bg-card/50">
              <Truck className="h-6 w-6 text-primary" />
              <div className="font-bold text-sm">Livraison express</div>
              <div className="text-xs text-muted-foreground">Sous 24/48h chez vous</div>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-border p-4 bg-card/50">
              <Shield className="h-6 w-6 text-primary" />
              <div className="font-bold text-sm">Garantie 2 ans</div>
              <div className="text-xs text-muted-foreground">Remplacement à neuf</div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8">
            <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              Spécifications techniques
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {product.specs.map((s) => (
                <div
                  key={s.label}
                  className="flex justify-between items-center border-b border-border/50 pb-2"
                >
                  <span className="text-muted-foreground text-sm font-medium">{s.label}</span>
                  <span className="font-bold text-sm">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-32">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-display text-3xl font-black">Produits similaires</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
