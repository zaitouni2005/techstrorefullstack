import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
import { api } from "@/services/api";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingBag, Euro, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.users
      .list()
      .then(({ data }) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Erreur lors du chargement des utilisateurs");
        setLoading(false);
      });
  }, []);

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const updated = await api.users.updateStatus(user.id, newStatus);
      setUsers(users.map((u) => (u.id === user.id ? updated : u)));
      toast.success(`Compte ${newStatus === "active" ? "activé" : "suspendu"}`);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      id: "name",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-semibold"
          onClick={() => column.toggleSorting()}
        >
          Utilisateur <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-primary/5 text-primary font-bold text-xs">
              {(row.original.firstName[0] || "") + (row.original.lastName[0] || "").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-bold text-sm">
              {row.original.firstName} {row.original.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "active" ? "default" : "secondary"}
          className={
            row.original.status === "active"
              ? "bg-emerald-500 hover:bg-emerald-600 shadow-none"
              : "shadow-none"
          }
        >
          {row.original.status === "active" ? "Actif" : "Inactif"}
        </Badge>
      ),
    },
    {
      accessorKey: "orders",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-semibold"
          onClick={() => column.toggleSorting()}
        >
          Commandes <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="p-1.5 bg-muted rounded-md">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-foreground">{row.original.orders}</span>
        </div>
      ),
    },
    {
      accessorKey: "totalSpent",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-semibold"
          onClick={() => column.toggleSorting()}
        >
          Dépenses <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-bold">
          <Euro className="w-4 h-4 text-primary" />
          {row.original.totalSpent.toFixed(2)}€
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleStatus(row.original)}
            className={row.original.status === "active" ? "text-destructive" : "text-emerald-600"}
          >
            {row.original.status === "active" ? "Suspendre" : "Activer"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
        <p className="text-muted-foreground">{users.length} clients.</p>
      </div>
      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Rechercher un utilisateur..."
        loading={loading}
      />
    </div>
  );
}
