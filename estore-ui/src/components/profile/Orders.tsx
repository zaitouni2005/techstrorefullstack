import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingBag, Loader2, XCircle, RotateCcw, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { type Order } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    api.orders.list().then(({ data }) => {
      setOrders(data.filter((o) => o.customerId === user.email));
      setLoading(false);
    });
  }, [user?.email]);

  const handleCancelOrder = (id: string) => {
    api.orders.updateStatus(id, "cancelled").then((updatedOrder) => {
      setOrders(orders.map((o) => (o.id === id ? updatedOrder : o)));
      toast.success(`Commande ${id} annulée avec succès`);
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "return_requested") {
      return (
        <Badge
          variant="secondary"
          className="gap-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 shadow-none"
        >
          <RotateCcw className="w-3 h-3" /> Retour demandé
        </Badge>
      );
    }
    return <span className="capitalize">{status}</span>;
  };

  if (loading) {
    return (
      <Card className="flex items-center justify-center p-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="rounded-[2.5rem] border-muted-foreground/10 shadow-sm">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-primary" /> Mes commandes
        </CardTitle>
        <CardDescription>Retrouvez ici l'historique de vos commandes passées.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commande</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total.toFixed(2)} €</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="gap-1.5" asChild>
                        <Link to={`/orders/${order.id}`}>
                          <ExternalLink className="w-3.5 h-3.5" /> Suivre
                        </Link>
                      </Button>
                      {order.status !== "delivered" &&
                        order.status !== "cancelled" &&
                        order.status !== "return_requested" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive/90 gap-2"
                              >
                                <XCircle className="w-4 h-4" /> Annuler
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Annuler la commande ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Êtes-vous sûr de vouloir annuler la
                                  commande {order.id} ?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-2xl">Non</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="rounded-2xl bg-destructive hover:bg-destructive/90"
                                >
                                  Oui, annuler
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      {order.status === "delivered" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/90 gap-2"
                          asChild
                        >
                          <Link to={`/returns/request/${order.id}`}>
                            <RotateCcw className="w-4 h-4" /> Retour
                          </Link>
                        </Button>
                      )}
                      {order.status === "return_requested" && (
                        <span className="text-xs font-bold text-muted-foreground italic">
                          En attente
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucune commande trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
