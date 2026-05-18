import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function Notifications() {
  return (
    <Card className="rounded-[2.5rem] border-muted-foreground/10 shadow-sm">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" /> Notifications
        </CardTitle>
        <CardDescription>Configurez vos préférences de notification.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-bold">Commandes</Label>
            <p className="text-sm text-muted-foreground">
              Recevez des mises à jour sur vos commandes.
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-bold">Promotions</Label>
            <p className="text-sm text-muted-foreground">Soyez informé des dernières offres.</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
}
