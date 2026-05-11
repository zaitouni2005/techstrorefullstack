import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { type Order, initialOrders } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Package, User, MapPin, CreditCard, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Simulation of fetching order detail
    const found = initialOrders.find((o) => o.id === id);
    if (found) setOrder(found);
  }, [id]);

  if (!order)
    return (
      <div className="p-8 text-center text-muted-foreground font-bold">Commande introuvable</div>
    );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link to="/admin/orders">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            {order.id}
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
              {order.status}
            </Badge>
          </h1>
          <p className="text-muted-foreground">Passée le {order.date} à 14:32</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-3xl border-muted-foreground/10 overflow-hidden shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-muted-foreground/10 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" /> Articles
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-muted-foreground/10">
                {[...Array(order.items)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 flex items-center gap-4 hover:bg-muted/5 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-xl bg-muted animate-pulse" />
                    <div className="flex-1">
                      <div className="font-bold">Produit #{i + 1}</div>
                      <div className="text-sm text-muted-foreground">Référence: SKU-9283{i}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{(order.total / order.items).toFixed(2)}€</div>
                      <div className="text-xs text-muted-foreground text-center bg-muted rounded px-1">
                        x1
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-6 bg-muted/20 border-t border-muted-foreground/10">
              <div className="flex justify-between items-center font-bold text-xl">
                <span>Total de la commande</span>
                <span className="text-primary">{order.total.toFixed(2)}€</span>
              </div>
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="rounded-[2rem] border-muted-foreground/10 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-bold">Jean Dupont</p>
                <p>123 Rue de la Technologie</p>
                <p>75000 Paris, France</p>
                <p className="text-muted-foreground pt-2">Standard (2-3 jours)</p>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-muted-foreground/10 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-bold flex items-center gap-2">
                  Carte Bancaire{" "}
                  <span className="text-muted-foreground font-normal">•••• 4242</span>
                </p>
                <p>Date: {order.date}</p>
                <p className="text-emerald-600 font-bold bg-emerald-50 inline-block px-2 rounded-md mt-2">
                  Payé
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-muted-foreground/10 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shadow-inner">
                  JD
                </div>
                <div>
                  <p className="font-bold">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">client depuis 2023</p>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-2xl h-11 text-xs font-bold gap-2">
                Voir le profil client <ChevronRight className="w-3 h-3" />
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-muted-foreground/10 shadow-sm bg-muted/10">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-muted-foreground/20">
                <TimelineItem label="Commande livrée" time="Hier, 10:15" active />
                <TimelineItem label="En cours de livraison" time="Hier, 08:30" />
                <TimelineItem label="Pris en charge" time="9 Mai, 16:45" />
                <TimelineItem label="Commande validée" time="9 Mai, 14:32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ label, time, active }: { label: string; time: string; active?: boolean }) {
  return (
    <div className="pl-6 relative">
      <div
        className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-background ${active ? "bg-primary scale-125 shadow-lg shadow-primary/40" : "bg-muted-foreground/30"}`}
      />
      <p className={`text-sm font-bold ${active ? "text-foreground" : "text-muted-foreground/80"}`}>
        {label}
      </p>
      <p className="text-[10px] text-muted-foreground font-medium uppercase">{time}</p>
    </div>
  );
}
