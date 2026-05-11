import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { type Product } from "@/data/products";

export function PromoSection({ promos }: { promos: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-16">
      <div className="rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-glow p-8 md:p-16 text-primary-foreground relative overflow-hidden shadow-2xl">
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
              Jusqu'à <span className="text-white">-25%</span>
              <br />
              sur une sélection.
            </h2>
            <p className="mt-5 text-lg text-primary-foreground/80 max-w-md">
              Profitez de nos meilleures réductions sur les marques les plus prisées. Stock limité !
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-primary shadow-xl hover:bg-opacity-90 transition transform hover:-translate-y-1 active:scale-95"
            >
              Voir les promos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {promos.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="group rounded-3xl bg-card/10 backdrop-blur-xl p-4 text-foreground border border-white/10 hover:bg-card/20 transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-square">
                  <img
                    src={p.mainImage}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="mt-4">
                  <div className="text-xs font-bold text-white line-clamp-1 opacity-80 uppercase tracking-tighter">
                    {p.brand}
                  </div>
                  <div className="text-sm font-bold text-white line-clamp-1 mt-0.5">{p.name}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-black text-white">{p.price}€</span>
                    {p.oldPrice && (
                      <span className="text-xs text-white/50 line-through">{p.oldPrice}€</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
