import { Link } from "react-router-dom";
import { type Product } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PromoProductCardProps {
  product: Product;
}

export function PromoProductCard({ product }: PromoProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group rounded-3xl bg-card/10 backdrop-blur-xl p-4 text-foreground border border-white/10 hover:bg-card/20 transition-all duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl aspect-square">
        <img
          src={product.mainImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="mt-4">
        <div className="text-xs font-bold text-white line-clamp-1 opacity-80 uppercase tracking-tighter">
          {product.brand}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-sm font-bold text-white line-clamp-1 mt-0.5 cursor-default">
              {product.name}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{product.name}</p>
          </TooltipContent>
        </Tooltip>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-black text-white">{product.price}€</span>
          {product.oldPrice && (
            <span className="text-xs text-white/50 line-through">{product.oldPrice}€</span>
          )}
        </div>
      </div>
    </Link>
  );
}
