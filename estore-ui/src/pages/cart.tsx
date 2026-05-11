import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartPage() {
  const { items, setQty, remove, total, count } = useCart();
  const shipping = total > 50 || total === 0 ? 0 : 4.99;

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Mon panier</h1>
      <p className="text-muted-foreground mb-8">
        {count} article{count > 1 ? "s" : ""}
      </p>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-16 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="font-display text-xl font-semibold">Votre panier est vide</h2>
          <p className="text-muted-foreground mt-2">
            Découvrez nos produits et trouvez votre bonheur.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow transition"
          >
            Explorer les produits <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <Link to={`/products/${item.product.id}`} className="shrink-0">
                  <img
                    src={item.product.mainImage}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-xl object-cover bg-surface"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{item.product.brand}</div>
                  <Link
                    to={`/products/${item.product.id}`}
                    className="font-display font-semibold hover:text-primary transition line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <div className="text-sm text-muted-foreground mt-1">
                    {item.product.price} € / unité
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button
                        onClick={() => setQty(item.product.id, item.qty - 1)}
                        className="grid h-8 w-8 place-items-center hover:bg-accent rounded-full"
                        aria-label="Diminuer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.product.id, item.qty + 1)}
                        className="grid h-8 w-8 place-items-center hover:bg-accent rounded-full"
                        aria-label="Augmenter"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="font-display font-bold">
                      {(item.product.price * item.qty).toFixed(2)} €
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => remove(item.product.id)}
                  className="self-start text-muted-foreground hover:text-destructive transition"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <aside>
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display font-semibold mb-4">Récapitulatif</h2>
              <div className="space-y-2 text-sm">
                <Row label="Sous-total" value={`${total.toFixed(2)} €`} />
                <Row
                  label="Livraison"
                  value={shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)} €`}
                />
              </div>
              <div className="my-4 border-t border-border" />
              <div className="flex justify-between font-display text-lg font-bold">
                <span>Total</span>
                <span>{(total + shipping).toFixed(2)} €</span>
              </div>
              <Link
                to="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow transition"
              >
                Passer à la commande <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products"
                className="mt-2 flex w-full items-center justify-center text-sm text-muted-foreground hover:text-foreground transition py-2"
              >
                Continuer mes achats
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
