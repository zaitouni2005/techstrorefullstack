import { useState } from "react";
import { initialUsers, User } from "@/data/products";
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
import { Search, MoreVertical, UserX, Mail, ShoppingBag, Euro } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            className="pl-10 h-11 bg-card shadow-sm border-muted-foreground/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-muted-foreground/10 bg-card overflow-hidden shadow-sm transition-all duration-300">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-muted-foreground/10">
              <TableHead className="py-4 font-semibold">Utilisateur</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="font-semibold">Commandes</TableHead>
              <TableHead className="font-semibold">Total Dépensé</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className="group border-b-muted-foreground/10 hover:bg-muted/10 transition-colors"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-muted-foreground/10 shadow-sm">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-base">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "active" ? "default" : "secondary"}
                    className={
                      user.status === "active"
                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-none"
                        : "shadow-none"
                    }
                  >
                    {user.status === "active" ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="p-1.5 bg-muted rounded-md">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-foreground">{user.orders}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Euro className="w-4 h-4 text-primary" />
                    <span>{user.totalSpent.toFixed(2)}€</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-52 shadow-xl border-muted-foreground/10"
                    >
                      <DropdownMenuLabel>Gestion Utilisateur</DropdownMenuLabel>
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <Mail className="w-4 h-4 text-muted-foreground" /> Envoyer un email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer">
                        <UserX className="w-4 h-4" /> Suspendre le compte
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 border border-dashed rounded-2xl bg-muted/10 border-muted-foreground/20">
          <UserX className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground font-semibold text-lg">Aucun utilisateur</p>
          <p className="text-sm text-muted-foreground/60">Tentez une autre recherche.</p>
        </div>
      )}
    </div>
  );
}
