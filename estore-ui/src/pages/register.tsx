import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Loader2, Eye, EyeOff, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Veuillez renseigner votre prénom et nom");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    setLoading(true);
    try {
      const data = await api.auth.register(firstName, lastName, email, password);
      login("customer", data.user);
      toast.success("Compte créé avec succès");
      navigate("/");
    } catch {
      toast.error("Erreur lors de la création du compte");
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
            <User className="h-6 w-6" />
          </div>
          <h1 className="font-display text-3xl font-bold">Créer un compte</h1>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Rejoignez TechStore pour une expérience unique.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Prénom
              </Label>
              <Input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jean"
                className="rounded-2xl border-border bg-background h-12 focus-visible:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
              >
                Nom
              </Label>
              <Input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dupont"
                className="rounded-2xl border-border bg-background h-12 focus-visible:ring-primary/20 transition-all"
              />
            </div>
          </div>

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
            <Label
              htmlFor="password"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
            >
              Mot de passe
            </Label>
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

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
            >
              Confirmer le mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-2xl border-border bg-background pl-10 pr-10 h-12 focus-visible:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary-glow shadow-lg shadow-primary/10 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "S'inscrire"}
          </Button>
        </form>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
