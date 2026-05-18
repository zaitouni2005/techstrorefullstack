import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { type Product } from "@/types";
import { PromoProductCard } from "./PromoProductCard";

export function PromoSection({ promos }: { promos: Product[] }) {
  const validPromos = promos.filter((p): p is Product & { oldPrice: number } => !!p.oldPrice);
  const maxDiscount = validPromos.length
    ? Math.max(...validPromos.map((p) => Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)))
    : 0;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-16">
      <div className="rounded-[2.5rem] bg-linear-to-br from-primary to-primary-glow p-8 md:p-16 text-primary-foreground relative overflow-hidden shadow-2xl">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              Offres du moment
            </span>
            <h2 className="mt-6 font-display text-4xl md:text-6xl font-bold leading-tight">
              Jusqu'à <span className="text-white">-{maxDiscount}%</span>
              <br />
              sur une sélection.
            </h2>
            <p className="mt-5 text-lg text-primary-foreground/80 max-w-md">
              Profitez de nos meilleures réductions sur les marques les plus prisées. Stock limité !
            </p>
            <Link
              to="/products?minDiscount=1"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-primary shadow-xl hover:bg-opacity-90 transition transform hover:-translate-y-1 active:scale-95"
            >
              Voir les promos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {promos.map((p) => (
              <PromoProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
