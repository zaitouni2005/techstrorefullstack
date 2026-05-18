import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-(--shadow-card)"
    >
      <div className="relative aspect-square overflow-hidden bg-surface">
        {discount > 0 && (
          <Badge
            variant="destructive"
            className="absolute left-3 top-3 z-10 rounded-full px-2 py-0.5 font-bold"
          >
            -{discount}%
          </Badge>
        )}
        <img
          src={product.mainImage}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 p-4 transition duration-300 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              add(product);
              toast.success(`${product.name} ajouté`);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary-glow transition"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>{product.brand}</span>
          <div className="flex items-center gap-0.5 text-amber-400">
            <Star className="h-3 w-3 fill-amber-400" />
            <span>{product.rating > 0 ? product.rating : "—"}</span>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mt-1 font-display font-semibold text-foreground group-hover:text-primary transition line-clamp-1 cursor-default">
              {product.name}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{product.name}</p>
          </TooltipContent>
        </Tooltip>

        <div className="mt-auto pt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold">{product.price} €</span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">{product.oldPrice} €</span>
          )}
        </div>
      </div>
    </Link>
  );
}
