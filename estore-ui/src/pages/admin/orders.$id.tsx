import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, User, Loader2 } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "En attente",
  processing: "En traitement",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  return_requested: "Retour demandé",
};

export function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.orders
      .get(id)
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground font-bold text-lg">Commande introuvable</p>
        <Button asChild>
          <Link to="/admin/orders">Retour</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link to="/admin/orders">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{order.id}</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-sm">
              {statusLabels[order.status] ?? order.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">Passée le {order.date}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-muted/30 border-b py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" /> Articles
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">Commande {order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.itemCount} article{order.itemCount > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{order.total.toFixed(2)}€</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{order.customerName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="secondary"
                className="text-sm px-4 py-1.5 bg-primary/10 text-primary border-none"
              >
                {statusLabels[order.status] ?? order.status}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
