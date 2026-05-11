import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Truck, CreditCard, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState("card");
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Votre panier est vide</h1>
        <p className="mt-2 text-muted-foreground text-sm">Ajoutez des produits pour commander.</p>
        <Button asChild className="mt-8 rounded-full px-8">
          <Link to="/products">Voir le catalogue</Link>
        </Button>
      </div>
    );
  }

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Commande confirmée ! Merci de votre confiance.");
      clear();
      navigate("/");
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 lg:py-16">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Retour au panier
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <form id="checkout-form" onSubmit={handleOrder} className="space-y-10">
          <Section icon={Truck} title="Informations de livraison">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Prénom</Label>
                <Input id="firstname" required className="rounded-xl border-border bg-card" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Nom</Label>
                <Input id="lastname" required className="rounded-xl border-border bg-card" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" required className="rounded-xl border-border bg-card" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" required className="rounded-xl border-border bg-card" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Code postal</Label>
                <Input id="zip" required className="rounded-xl border-border bg-card" />
              </div>
            </div>
          </Section>

          <Section icon={CreditCard} title="Méthode de paiement">
            <div className="grid gap-3">
              <PayOption
                active={payMethod === "card"}
                onClick={() => setPayMethod("card")}
                title="Carte bancaire"
                desc="Visa, Mastercard, AMEX"
              />
              <PayOption
                active={payMethod === "paypal"}
                onClick={() => setPayMethod("paypal")}
                title="PayPal"
                desc="Paiement sécurisé en un clic"
              />
            </div>

            {payMethod === "card" && (
              <div className="mt-6 space-y-4 p-5 rounded-2xl bg-muted/30 border border-border/50 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Numéro de carte</Label>
                  <Input
                    id="card-number"
                    placeholder="0000 0000 0000 0000"
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exp">Expiration</Label>
                    <Input id="exp" placeholder="MM/YY" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" className="rounded-xl" />
                  </div>
                </div>
              </div>
            )}
          </Section>
        </form>

        <aside>
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-6">
              <ShoppingBag className="h-5 w-5 text-primary" /> Résumé de la commande
            </h2>
            <div className="space-y-4 max-h-[300px] overflow-auto pr-2 scrollbar-thin">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 text-sm">
                  <img
                    src={item.product.mainImage}
                    alt={item.product.name}
                    className="h-14 w-14 rounded-xl object-cover border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold line-clamp-1">{item.product.name}</div>
                    <div className="text-muted-foreground text-xs">Quantité: {item.qty}</div>
                  </div>
                  <div className="font-bold">{(item.product.price * item.qty).toFixed(2)}€</div>
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison</span>
                <span className="text-emerald-600 font-medium">Gratuite</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{total.toFixed(2)}€</span>
              </div>
            </div>
            <Button
              form="checkout-form"
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-2xl h-12 text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `Payer ${total.toFixed(2)}€`
              )}
            </Button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Paiement 100% sécurisé
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

interface SectionProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

function Section({ icon: Icon, title, children }: SectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
      </div>
      <div className="pl-0 md:pl-13">{children}</div>
    </div>
  );
}

interface PayOptionProps {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}

function PayOption({ active, onClick, title, desc }: PayOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left transition-all ${
        active
          ? "border-primary bg-primary/5 shadow-inner"
          : "border-border bg-card hover:border-border/80 hover:bg-muted/50"
      }`}
    >
      <div>
        <div className={`font-bold ${active ? "text-primary" : ""}`}>{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <div
        className={`h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center ${
          active ? "border-primary" : "border-border"
        }`}
      >
        {active && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </div>
    </button>
  );
}
