import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Github, Loader2, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("is_admin", "false");
      toast.success("Connexion réussie");
      navigate("/");
    }, 1000);
  };

  const handleAdminLogin = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("is_admin", "true");
      setLoading(false);
      toast.success("Mode Administrateur activé");
      navigate("/admin");
    }, 800);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-[2.5rem] border border-border bg-card p-10 shadow-[var(--shadow-elegant)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

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
                placeholder="nom@exemple.com"
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
              <button
                type="button"
                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter"
              >
                Oublié ?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="rounded-2xl border-border bg-background pl-10 h-12 focus-visible:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary-glow shadow-lg shadow-primary/10 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
          </Button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
            <span className="bg-card px-3 text-muted-foreground/60">Ou tester</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="rounded-2xl h-12 border-border hover:bg-accent transition-all font-semibold gap-2"
            onClick={() => {}}
          >
            <Github className="h-4 w-4" /> GitHub
          </Button>
          <Button
            variant="outline"
            className="rounded-2xl h-12 border-primary/20 text-primary hover:bg-primary/5 transition-all font-bold gap-2"
            onClick={handleAdminLogin}
            disabled={loading}
          >
            <ShieldCheck className="h-4 w-4" /> Admin
          </Button>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link to="/" className="font-bold text-primary hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
