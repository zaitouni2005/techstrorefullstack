import { ShoppingBag, LogOut, ChevronRight, CreditCard, Bell, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PersonalInfo } from "@/components/profile/PersonalInfo";
import { Orders } from "@/components/profile/Orders";
import { Payments } from "@/components/profile/Payments";
import { Notifications } from "@/components/profile/Notifications";
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
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ProfilePage() {
  const { clear } = useCart();
  const { logout: authLogout, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "info";

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleLogout = () => {
    authLogout();
    clear();
    navigate("/login");
  };

  const handleTabChange = (tab: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", tab);
      return next;
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <Orders />;
      case "payments":
        return <Payments />;
      case "notifications":
        return <Notifications />;
      default:
        return <PersonalInfo user={user} onUpdate={updateUser} />;
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : "";

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 lg:py-16 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-80 shrink-0 space-y-8">
          <div className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-card border border-border shadow-sm">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4 border-4 border-background shadow-xl">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{user ? `${user.firstName} ${user.lastName}` : "Utilisateur"}</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">{user?.email || ""}</p>
            {memberSince && (
              <Badge
                variant="secondary"
                className="mt-4 bg-primary/5 text-primary border-none font-bold px-4 py-1"
              >
                Client depuis {memberSince}
              </Badge>
            )}
          </div>

          <nav className="flex flex-col gap-2 p-2 rounded-4xl bg-card border border-border shadow-sm">
            <NavItem
              icon={User}
              label="Informations personnelles"
              active={activeTab === "info"}
              onClick={() => handleTabChange("info")}
            />
            <NavItem
              icon={ShoppingBag}
              label="Mes commandes"
              active={activeTab === "orders"}
              onClick={() => handleTabChange("orders")}
            />
            <NavItem
              icon={CreditCard}
              label="Méthodes de paiement"
              active={activeTab === "payments"}
              onClick={() => handleTabChange("payments")}
            />
            <NavItem
              icon={Bell}
              label="Notifications"
              active={activeTab === "notifications"}
              onClick={() => handleTabChange("notifications")}
            />
            <Separator className="my-2 mx-4 opacity-50" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex items-center justify-between w-full p-4 rounded-2xl text-destructive hover:bg-destructive/5 transition-all group font-bold text-sm">
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    <span>Déconnexion</span>
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir vous déconnecter ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Vous devrez vous reconnecter pour accéder à votre profil et vos commandes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-2xl">Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="rounded-2xl bg-destructive hover:bg-destructive/90"
                  >
                    Déconnexion
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </nav>
        </aside>

        <main className="flex-1 space-y-8">{renderContent()}</main>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
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
