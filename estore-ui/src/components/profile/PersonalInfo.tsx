import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Key, Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";
import type { User } from "@/types";

export function PersonalInfo({
  user,
  onUpdate,
}: {
  user: User | null;
  onUpdate: (u: Partial<User>) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.users.updateProfile({ firstName, lastName });
      onUpdate(updated);
      toast.success("Profil mis à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setChangingPassword(true);
    try {
      await api.auth.changePassword(currentPassword, newPassword);
      toast.success("Mot de passe mis à jour");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Erreur lors du changement de mot de passe");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-[2.5rem] border-muted-foreground/10 shadow-sm overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary" /> Paramètres du compte
          </CardTitle>
          <CardDescription>Gérez vos informations personnelles.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Prénom
              </Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-2xl h-12 bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Nom
              </Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-2xl h-12 bg-muted/30"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Adresse Email
            </Label>
            <Input
              value={user?.email || ""}
              disabled
              className="rounded-2xl h-12 bg-muted/30 opacity-60"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[2.5rem] border-muted-foreground/10 shadow-sm overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Key className="w-6 h-6 text-primary" /> Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-4 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Mot de passe actuel
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-2xl h-12 bg-muted/30"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Nouveau mot de passe
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-2xl h-12 bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Confirmer le mot de passe
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-2xl h-12 bg-muted/30"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="rounded-2xl h-12 px-8 font-bold"
            >
              {changingPassword ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Mettre à jour le mot de passe"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
