import { useState } from "react";
import { Link } from "react-router-dom";
import { initialOrders, Order } from "@/data/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Eye, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()),
  );

  const updateStatus = (id: string, status: Order["status"]) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`Statut de la commande ${id} mis à jour`);
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1.5">
            <Clock className="w-3 h-3" /> En attente
          </Badge>
        );
      case "processing":
        return (
          <Badge
            variant="secondary"
            className="gap-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 shadow-none"
          >
            <Clock className="w-3 h-3" /> Traitement
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="secondary"
            className="gap-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 shadow-none"
          >
            <Truck className="w-3 h-3" /> Expédiée
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="secondary"
            className="gap-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 shadow-none"
          >
            <CheckCircle className="w-3 h-3" /> Livrée
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="gap-1.5">
            <XCircle className="w-3 h-3" /> Annulée
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une commande ou un client..."
            className="pl-10 h-11 bg-card shadow-sm border-muted-foreground/10 focus-visible:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-muted-foreground/10 bg-card overflow-hidden shadow-sm lg:shadow-md transition-all duration-300">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-muted-foreground/10">
              <TableHead className="font-semibold py-4">ID Commande</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Articles</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                className="group hover:bg-muted/20 border-b-muted-foreground/10 transition-colors"
              >
                <TableCell className="font-mono text-xs font-bold text-primary py-4">
                  {order.id}
                </TableCell>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-[10px] font-bold">
                    {order.items}
                  </span>
                </TableCell>
                <TableCell className="font-bold">{order.total.toFixed(2)}€</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-52 shadow-xl border-muted-foreground/10"
                    >
                      <DropdownMenuLabel>Gérer la commande</DropdownMenuLabel>
                      <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
                        <Link to={`/admin/orders/${order.id}`}>
                          <Eye className="w-4 h-4 text-muted-foreground" /> Voir les détails
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground mt-2">
                        Changer le statut
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => updateStatus(order.id, "processing")}
                        className="gap-2 cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-blue-500" /> Marquer en Traitement
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateStatus(order.id, "shipped")}
                        className="gap-2 cursor-pointer"
                      >
                        <Truck className="w-4 h-4 text-amber-500" /> Marquer en Expédiée
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateStatus(order.id, "delivered")}
                        className="gap-2 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Marquer en Livrée
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => updateStatus(order.id, "cancelled")}
                        className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" /> Annuler la commande
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed rounded-xl bg-muted/20 border-muted-foreground/20">
          <Clock className="w-12 h-12 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground font-medium text-lg">Aucune commande trouvée.</p>
          <p className="text-sm text-muted-foreground/60">Tentez un autre mot-clé ou filtre.</p>
        </div>
      )}
    </div>
  );
}
