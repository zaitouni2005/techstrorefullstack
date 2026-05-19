import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Loader2, ArrowRight, Package } from "lucide-react";
import { api } from "@/services/api";
import { type Order } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusLabels: Record<string, string> = {
  pending: "En attente",
  processing: "En cours",
  shipped: "Expédié",
  delivered: "Livré",
  cancelled: "Annulé",
  return_requested: "Retour demandé",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  return_requested: "bg-purple-100 text-purple-700 border-purple-200",
};

export function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    api.orders.list().then(({ data }) => {
      setOrders(data.filter((o) => o.customerId === user.email));
      setLoading(false);
    });
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary/40 mb-4" />
        <p className="text-muted-foreground">Chargement de vos commandes...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 lg:py-16">
      <div className="flex items-center gap-4 mb-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Package className="h-7 w-7" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-black">Mes commandes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Suivez l'état de vos commandes en temps réel.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-bold mb-2">Aucune commande</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Vous n'avez pas encore passé de commande.
          </p>
          <Button asChild className="rounded-full px-8">
            <Link to="/products">Découvrir le catalogue</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="h-12 w-12 rounded-xl border-2 border-background overflow-hidden bg-surface"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="h-12 w-12 rounded-xl border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-muted-foreground mb-0.5">{order.id}</div>
                  <div className="font-semibold">{order.items.map((i) => i.name).join(", ")}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(order.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:text-right">
                <div>
                  <div className="font-bold text-lg">{order.total.toFixed(2)} €</div>
                  <Badge
                    variant="outline"
                    className={`mt-1 gap-1.5 ${statusColors[order.status] || ""}`}
                  >
                    {statusLabels[order.status] || order.status}
                  </Badge>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
