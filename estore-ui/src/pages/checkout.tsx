import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Truck, CreditCard, ShieldCheck, ArrowLeft, Loader2, Clock } from "lucide-react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/services/api";

export function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState("cod");
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

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

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await api.orders.create({
        items: items.map((i) => ({ productId: i.product.id, quantity: i.qty })),
        shippingAddress: `${shipping.firstName} ${shipping.lastName}, ${shipping.address}, ${shipping.zip} ${shipping.city}`,
        paymentMethod: payMethod,
      });
      toast.success("Commande confirmée !");
      clear();
      navigate(`/orders/${order.id}`);
    } catch {
      toast.error("Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
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
                <Input
                  id="firstname"
                  required
                  value={shipping.firstName}
                  onChange={(e) => setShipping((s) => ({ ...s, firstName: e.target.value }))}
                  className="rounded-xl border-border bg-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Nom</Label>
                <Input
                  id="lastname"
                  required
                  value={shipping.lastName}
                  onChange={(e) => setShipping((s) => ({ ...s, lastName: e.target.value }))}
                  className="rounded-xl border-border bg-card"
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                required
                value={shipping.address}
                onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                className="rounded-xl border-border bg-card"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  required
                  value={shipping.city}
                  onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                  className="rounded-xl border-border bg-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Code postal</Label>
                <Input
                  id="zip"
                  required
                  value={shipping.zip}
                  onChange={(e) => setShipping((s) => ({ ...s, zip: e.target.value }))}
                  className="rounded-xl border-border bg-card"
                />
              </div>
            </div>
          </Section>

          <Section icon={CreditCard} title="Méthode de paiement">
            <div className="grid gap-3">
              <PayOption
                active={payMethod === "cod"}
                onClick={() => setPayMethod("cod")}
                title="Paiement à la livraison"
                desc="Payez en espèces ou par carte à la réception"
              />
              <PayOption
                active={false}
                comingSoon
                title="Carte bancaire"
                desc="Visa, Mastercard, AMEX"
              />
              <PayOption
                active={false}
                comingSoon
                title="PayPal"
                desc="Paiement sécurisé en un clic"
              />
            </div>
          </Section>
        </form>

        <aside>
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-6">
              <ShoppingBag className="h-5 w-5 text-primary" /> Résumé de la commande
            </h2>
            <div className="space-y-4 max-h-75 overflow-auto pr-2 scrollbar-thin">
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
                `Passer la commande`
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
  onClick?: () => void;
  title: string;
  desc: string;
  comingSoon?: boolean;
}

function PayOption({ active, onClick, title, desc, comingSoon }: PayOptionProps) {
  return (
    <button
      type="button"
      disabled={comingSoon}
      onClick={comingSoon ? undefined : onClick}
      className={`flex w-full items-center justify-between rounded-2xl border-2 p-5 text-left transition-all ${
        comingSoon
          ? "border-dashed border-border/40 bg-muted/20 opacity-60 cursor-not-allowed"
          : active
            ? "border-primary bg-primary/5 shadow-inner"
            : "border-border bg-card hover:border-border/80 hover:bg-muted/50"
      }`}
    >
      <div>
        <div className={`font-bold ${active && !comingSoon ? "text-primary" : ""} flex items-center gap-2`}>
          {title}
          {comingSoon && (
            <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5 font-semibold gap-1">
              <Clock className="w-3 h-3" /> Bientôt disponible
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      {!comingSoon && (
        <div
          className={`h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center ${
            active ? "border-primary" : "border-border"
          }`}
        >
          {active && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
        </div>
      )}
    </button>
  );
}
