import {
  User,
  ShoppingBag,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
  Package,
  CreditCard,
  Bell,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ProfilePage() {
  const { clear } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("is_admin");
    clear();
    window.location.href = "/login";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 lg:py-16 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-80 shrink-0 space-y-8">
          <div className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-card border border-border shadow-sm">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl mb-4">
              <AvatarImage src="https://i.pravatar.cc/150?u=techstore" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                JD
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold tracking-tight">Jean Dupont</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">jean.dupont@exemple.fr</p>
            <Badge
              variant="secondary"
              className="mt-4 bg-primary/5 text-primary border-none font-bold px-4 py-1"
            >
              Membre Gold
            </Badge>
          </div>

          <nav className="flex flex-col gap-2 p-2 rounded-[2rem] bg-card border border-border shadow-sm">
            <NavItem icon={User} label="Informations personnelles" active />
            <NavItem icon={ShoppingBag} label="Mes commandes" />
            <NavItem icon={CreditCard} label="Méthodes de paiement" />
            <NavItem icon={Bell} label="Notifications" />
            <NavItem icon={Shield} label="Sécurité" />
            <Separator className="my-2 mx-4 opacity-50" />
            <button
              onClick={handleLogout}
              className="flex items-center justify-between w-full p-4 rounded-2xl text-destructive hover:bg-destructive/5 transition-all group font-bold text-sm"
            >
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </div>
            </button>
          </nav>
        </aside>

        <main className="flex-1 space-y-8">
          <Card className="rounded-[2.5rem] border-muted-foreground/10 shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Settings className="w-6 h-6 text-primary" /> Paramètres du compte
              </CardTitle>
              <CardDescription>
                Gérez vos informations et vos préférences de sécurité.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Prénom
                  </label>
                  <p className="p-4 rounded-2xl bg-muted/30 font-medium border border-border/50">
                    Jean
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Nom
                  </label>
                  <p className="p-4 rounded-2xl bg-muted/30 font-medium border border-border/50">
                    Dupont
                  </p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Adresse Email
                  </label>
                  <p className="p-4 rounded-2xl bg-muted/30 font-medium border border-border/50">
                    jean.dupont@exemple.fr
                  </p>
                </div>
              </div>
              <Button className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20">
                Modifier mon profil
              </Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-[2rem] border-muted-foreground/10 shadow-sm bg-muted/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> Dernière commande
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">#ORD-9283</p>
                    <p className="text-xs text-muted-foreground">8 Mai 2024 • 1 299.00€</p>
                  </div>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Livrée</Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-muted-foreground/10 shadow-sm bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <Shield className="w-5 h-5" /> Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  L'authentification à deux facteurs est activée pour votre sécurité.
                </p>
                <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary">
                  Désactiver
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

function NavItem({ icon: Icon, label, active }: NavItemProps) {
  return (
    <button
      className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all group ${
        active
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${active ? "" : "group-hover:text-primary transition-colors"}`} />
        <span className="font-bold text-sm">{label}</span>
      </div>
      <ChevronRight
        className={`h-4 w-4 transition-transform ${active ? "translate-x-1" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"}`}
      />
    </button>
  );
}
