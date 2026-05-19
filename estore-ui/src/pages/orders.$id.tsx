import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Truck, Check, Loader2 } from "lucide-react";
import { api } from "@/services/api";
import type { Order } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusLabels: Record<string, string> = {
  pending: "Commande validée",
  processing: "Préparation en cours",
  shipped: "En transit",
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

const STEP_ORDER: string[] = ["pending", "processing", "shipped", "delivered"];

function stepIndex(status: string): number {
  const idx = STEP_ORDER.indexOf(status);
  return idx === -1 ? STEP_ORDER.length : idx;
}

export function OrderTrackingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!id) return;
    api.orders
      .get(id)
      .then((data) => {
        if (data.customerId !== user.email) {
          navigate("/orders", { replace: true });
          return;
        }
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        navigate("/orders", { replace: true });
      });
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-20 text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary/40 mb-4" />
        <p className="text-muted-foreground">Chargement de la commande...</p>
      </div>
    );
  }

  if (!order) return null;

  const currentStep = stepIndex(order.status);
  const isCancelled = order.status === "cancelled" || order.status === "return_requested";
  const statusHistory = order.statusHistory || [];
  const tracking = order.tracking;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 lg:py-16">
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à mes commandes
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Package className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-black flex items-center gap-3">
              Commande {order.id}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Passée le{" "}
              {new Date(order.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`text-sm px-4 py-1.5 gap-1.5 ${statusColors[order.status] || ""}`}
        >
          {statusLabels[order.status] || order.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-12">
          {/* Status Timeline */}
          {!isCancelled && (
            <div>
              <h2 className="font-display text-xl font-bold mb-8 flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Suivi de livraison
              </h2>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-8">
                  {STEP_ORDER.map((step, i) => {
                    const historyEntry = statusHistory.find((h) => h.status === step);
                    const isCompleted = i < currentStep;
                    const isCurrent = i === currentStep;
                    return (
                      <div key={step} className="relative flex items-start gap-5">
                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            isCompleted
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : isCurrent
                                ? "border-primary bg-primary text-white"
                                : "border-border bg-card text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${isCurrent ? "bg-white" : "bg-muted-foreground/40"}`}
                            />
                          )}
                        </div>
                        <div className="pt-1.5 min-w-0 flex-1">
                          <div
                            className={`font-bold text-sm ${
                              isCompleted || isCurrent
                                ? "text-foreground"
                                : "text-muted-foreground/60"
                            }`}
                          >
                            {statusLabels[step]}
                          </div>
                          {historyEntry && (
                            <>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {new Date(historyEntry.timestamp).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              {historyEntry.location && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground/70 mt-1">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  {historyEntry.location}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Cancelled / Return requested */}
          {isCancelled && (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <div
                className={`text-lg font-bold mb-2 ${order.status === "cancelled" ? "text-destructive" : "text-purple-600"}`}
              >
                {order.status === "cancelled" ? "Commande annulée" : "Retour demandé"}
              </div>
              <p className="text-sm text-muted-foreground">
                {order.status === "cancelled"
                  ? "Cette commande a été annulée et ne sera pas traitée."
                  : "Votre demande de retour a été prise en compte. Vous serez contacté sous 48h."}
              </p>
            </div>
          )}

          {/* Tracking Info */}
          {tracking && (
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Informations de suivi
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Transporteur
                  </div>
                  <div className="font-semibold">{tracking.carrier}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Numéro de suivi
                  </div>
                  <div className="font-semibold font-mono text-sm">{tracking.number}</div>
                </div>
              </div>
              {tracking.url && (
                <Button variant="outline" className="mt-6 rounded-xl w-full" asChild>
                  <a href={tracking.url} target="_blank" rel="noopener noreferrer">
                    Suivre sur le site du transporteur
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-display text-lg font-bold mb-6">Articles commandés</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-border bg-surface">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm line-clamp-1">{item.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Qté: {item.quantity}</div>
                    <div className="font-bold text-sm mt-1">
                      {(item.unitPrice * item.quantity).toFixed(2)} €
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-semibold">{order.total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Livraison</span>
                <span className="text-emerald-600 font-medium">Gratuite</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{order.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-display text-lg font-bold mb-4">Adresse de livraison</h2>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress || "Non renseignée"}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-display text-lg font-bold mb-4">Paiement</h2>
            <p className="text-sm text-muted-foreground">
              {order.paymentMethod || "Non renseigné"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
