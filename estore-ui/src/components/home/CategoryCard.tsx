import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { type Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group relative overflow-hidden rounded-4xl border border-border bg-card p-0 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 w-full"
    >
      <div className="relative h-full w-full">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="font-display text-xl font-bold text-white group-hover:text-primary transition-colors">
            {category.name}
          </div>
          <div className="mt-2 text-[10px] text-white/70 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300 font-bold uppercase tracking-widest">
            Découvrir <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
