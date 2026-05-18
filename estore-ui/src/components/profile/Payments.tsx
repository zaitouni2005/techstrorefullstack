import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Payments() {
  const methods = [
    { type: "Visa", last4: "4242", expiry: "12/26" },
    { type: "Mastercard", last4: "8888", expiry: "05/27" },
  ];

  return (
    <Card className="rounded-[2.5rem] border-muted-foreground/10 shadow-sm">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-primary" /> Méthodes de paiement
        </CardTitle>
        <CardDescription>Gérez vos moyens de paiement enregistrés.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4 space-y-4">
        {methods.map((method, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/20"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-background border border-border">
                <CreditCard className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold">
                  {method.type} se terminant par {method.last4}
                </p>
                <p className="text-sm text-muted-foreground">Expire le {method.expiry}</p>
              </div>
            </div>
            <Button variant="ghost" className="text-destructive font-bold">
              Supprimer
            </Button>
          </div>
        ))}
        <Button variant="outline" className="w-full h-12 rounded-2xl gap-2 font-bold">
          <Plus className="w-5 h-5" /> Ajouter une carte
        </Button>
      </CardContent>
    </Card>
  );
}
