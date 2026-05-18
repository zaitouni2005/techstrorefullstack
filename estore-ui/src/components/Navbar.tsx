import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, Zap, Sun, Moon, LogIn } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { count } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return (
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark"
    );
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/products?q=${encodeURIComponent(q.trim())}`);
    } else {
      navigate("/products");
    }
    setOpen(false);
  };

  const links = [
    { to: "/", label: "Accueil" },
    { to: "/products", label: "Produits" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          TechStore
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden flex-1 max-w-md md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un produit, une marque…"
              className="pl-9 bg-surface border-transparent focus-visible:ring-primary/20"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 md:ml-0 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full text-muted-foreground"
            title={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user ? (
            <Link
              to="/profile"
              className="hidden md:inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition"
            >
              <User className="h-4 w-4" /> Mon compte
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-primary hover:bg-primary/10 transition"
            >
              <LogIn className="h-4 w-4" /> Connexion
            </Link>
          )}
          <Link
            to="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 px-4 py-3 space-y-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-foreground py-2"
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-foreground py-2"
            >
              Mon profil
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-primary py-2"
            >
              Connexion
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
