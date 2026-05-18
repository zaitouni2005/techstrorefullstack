import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types";
import { api } from "@/services/api";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock, Truck, CheckCircle, XCircle, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> =
  {
    pending: {
      label: "En attente",
      className: "border border-border text-muted-foreground bg-transparent",
      icon: Clock,
    },
    processing: {
      label: "Traitement",
      className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
      icon: Clock,
    },
    shipped: {
      label: "Expédiée",
      className:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
      icon: Truck,
    },
    delivered: {
      label: "Livrée",
      className:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
      icon: CheckCircle,
    },
    cancelled: {
      label: "Annulée",
      className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
      icon: XCircle,
    },
  };

export function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders
      .list()
      .then(({ data }) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Erreur lors du chargement des commandes");
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: Order["status"]) => {
    try {
      await api.orders.updateStatus(id, status);
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success(`Statut de la commande ${id} mis à jour`);
    } catch {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-semibold"
          onClick={() => column.toggleSorting()}
        >
          ID <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-primary">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Client",
      cell: ({ row }) => <span className="font-medium">{row.original.customerName}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.date}</span>,
    },
    {
      accessorKey: "items",
      header: "Articles",
      cell: ({ row }) => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-bold">
          {row.original.itemCount}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-semibold"
          onClick={() => column.toggleSorting()}
        >
          Total <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: ({ row }) => <span className="font-bold">{row.original.total.toFixed(2)}€</span>,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const cfg = statusConfig[row.original.status] ?? statusConfig.pending;
        const Icon = cfg.icon;
        return (
          <Badge variant="outline" className={`gap-1.5 shadow-none ${cfg.className}`}>
            <Icon className="w-3 h-3" /> {cfg.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <span className="sr-only">Menu</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="lucide lucide-more-horizontal"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Gérer</DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => navigate(`/admin/orders/${row.original.id}`)}
              >
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">
                Statut
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => updateStatus(row.original.id, "processing")}
              >
                <Clock className="w-4 h-4 text-blue-500" /> En traitement
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => updateStatus(row.original.id, "shipped")}
              >
                <Truck className="w-4 h-4 text-amber-500" /> Expédiée
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => updateStatus(row.original.id, "delivered")}
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Livrée
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-destructive cursor-pointer"
                onClick={() => updateStatus(row.original.id, "cancelled")}
              >
                <XCircle className="w-4 h-4" /> Annuler
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
        <p className="text-muted-foreground">{orders.length} commandes.</p>
      </div>
      <DataTable
        columns={columns}
        data={orders}
        searchKey="customerName"
        searchPlaceholder="Rechercher un client..."
        loading={loading}
        onRowClick={(row) => navigate(`/admin/orders/${row.id}`)}
      />
    </div>
  );
}
