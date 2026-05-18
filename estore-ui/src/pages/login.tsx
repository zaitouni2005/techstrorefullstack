import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Loader2, Zap, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      login(data.role as "admin" | "customer", data.user);
      toast.success(`Bonjour ${data.user?.firstName || ""} !`);
      const redirect = searchParams.get("redirect") || (data.role === "admin" ? "/admin" : "/");
      navigate(redirect);
    } catch {
      toast.error("Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-[2.5rem] border border-border bg-card p-10 shadow-(--shadow-elegant) relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary/50 via-primary to-primary/50" />

        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Zap className="h-6 w-6" />
          </div>
          <h1 className="font-display text-3xl font-bold">Bienvenue</h1>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Connectez-vous pour accéder à votre espace TechStore.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="rounded-2xl border-border bg-background pl-10 h-12 focus-visible:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Mot de passe
              </Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-2xl border-border bg-background pl-10 pr-10 h-12 focus-visible:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-muted-foreground hover:text-primary transition"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary-glow shadow-lg shadow-primary/10 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
          </Button>
        </form>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link to="/register" className="font-bold text-primary hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
