import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Loader2, MessageSquare } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Product, Review } from "@/types";
import { api } from "@/services/api";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
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
  const { add } = useCart();

  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentImg, setCurrentImg] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on("select", () => {
      setCurrentImg(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const productData = await api.products.get(id!);
        setProduct(productData);
        const { data: similarData } = await api.products.list({
          category: productData.categoryId,
          limit: 5,
        });
        setSimilarProducts(similarData.filter((p) => p.id !== productData.id).slice(0, 4));
        const reviewsData = await api.products.reviews.list(productData.id);
        setReviews(reviewsData);
        if (user) {
          const ordersRes = await api.orders.list();
          setHasPurchased(
            ordersRes.data.some((o) => o.items.some((i) => i.productId === productData.id)),
          );
        }
      } catch {
        setProduct(null);
        toast.error("Impossible de charger le produit");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const slides = useMemo(
    () => (product ? product.images.map((src) => ({ src })) : []),
    [product?.images],
  );

  const existingReview = useMemo(
    () => reviews.find((r) => r.userId === user?.email || r.userId === user?.id) || null,
    [reviews, user?.email, user?.id],
  );
  const isEditing = !!existingReview;
  const hasPrefilled = useRef(false);
  useEffect(() => {
    hasPrefilled.current = false;
    setReviewRating(0);
    setReviewComment("");
    setHasPurchased(false);
  }, [id]);
  useEffect(() => {
    if (existingReview && !hasPrefilled.current) {
      setReviewRating(existingReview.rating);
      setReviewComment(existingReview.comment);
      hasPrefilled.current = true;
    }
  }, [existingReview?.id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary/40 mb-4" />
        <p className="text-muted-foreground">Chargement du produit...</p>
      </div>
    );
  }

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

  const handleSubmitReview = async () => {
    if (reviewRating === 0 || !reviewComment.trim() || !product) return;
    setSubmitting(true);
    try {
      const review = await api.products.reviews.add(product.id, reviewRating, reviewComment);
      if (isEditing) {
        setReviews((prev) =>
          prev.map((r) => (r.userId === user?.email || r.userId === user?.id ? review : r)),
        );
        toast.success("Avis mis à jour !");
      } else {
        setReviews((prev) => [review, ...prev]);
        toast.success("Avis publié !");
      }
      setReviewRating(0);
      setReviewComment("");
    } catch (err) {
      if (err instanceof Response && err.status === 403) {
        toast.error("Vous devez acheter ce produit avant de laisser un avis");
      } else {
        toast.error("Erreur lors de la publication");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

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
            <Carousel setApi={setCarouselApi} className="w-full">
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
          <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => carouselApi?.scrollTo(i)}
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
              {product.rating > 0 ? product.rating : "—"}
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

          <p className="text-muted-foreground text-lg leading-relaxed mb-6 border-l-4 border-primary/20 pl-6 italic">
            &ldquo;{product.description}&rdquo;
          </p>

          {product.descriptionMarkdown && (
            <div className="prose prose-sm dark:prose-invert max-w-none mb-10 p-6 rounded-2xl bg-card border border-border">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {product.descriptionMarkdown}
              </ReactMarkdown>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <Button
              size="lg"
              onClick={async () => {
                try {
                  await add(product);
                  toast.success(`${product.name} ajouté au panier`);
                } catch {
                  toast.error("Erreur lors de l'ajout au panier");
                }
              }}
              className="h-16 rounded-2xl text-lg font-bold gap-3 shadow-(--shadow-elegant) active:scale-95"
            >
              <ShoppingCart className="h-6 w-6" />
              Ajouter au panier
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={async () => {
                try {
                  await add(product);
                  navigate("/cart");
                } catch {
                  toast.error("Erreur lors de l'ajout au panier");
                }
              }}
              className="h-16 rounded-2xl text-lg font-bold border-2 active:scale-95"
            >
              Acheter maintenant
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16">
        <h2 className="font-display text-3xl font-black mb-10 flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          Avis clients ({reviews.length})
          <div className="h-px flex-1 bg-linear-to-r from-border to-transparent" />
        </h2>

        {reviews.length === 0 ? (
          <p className="text-muted-foreground">Aucun avis pour le moment.</p>
        ) : (
          <div className="space-y-8 max-w-3xl">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-border/50 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-sm">{r.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user ? (
          hasPurchased ? (
            <div className="mt-10 p-8 rounded-2xl border border-border bg-card max-w-xl">
              <h3 className="font-display font-bold mb-5">Donnez votre avis</h3>
              <div className="flex gap-1 mb-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="transition-colors"
                  >
                    <Star
                      className={`h-7 w-7 ${star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30 hover:text-amber-400/50"}`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Partagez votre expérience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mb-5"
                rows={4}
              />
              <Button
                onClick={handleSubmitReview}
                disabled={submitting || reviewRating === 0 || !reviewComment.trim()}
                className="gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? "Mettre à jour" : "Publier"}
              </Button>
            </div>
          ) : (
            <div className="mt-10 p-8 rounded-2xl border border-dashed border-border text-center max-w-xl">
              <p className="text-muted-foreground">
                Vous devez acheter ce produit avant de laisser un avis.
              </p>
            </div>
          )
        ) : (
          <div className="mt-10 p-8 rounded-2xl border border-dashed border-border text-center max-w-xl">
            <p className="text-muted-foreground">
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Connectez-vous
              </Link>{" "}
              pour laisser un avis.
            </p>
          </div>
        )}
      </section>

      {similarProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-display text-3xl font-black">Produits similaires</h2>
            <div className="h-px flex-1 bg-linear-to-r from-border to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
