import { useState } from "react";
import { api } from "@/services/api";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function ReturnRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    try {
      await api.orders.updateStatus(id!, "return_requested");
      toast.success(`Demande de retour pour la commande ${id} envoyée avec succès.`);
      navigate("/profile?tab=orders");
    } catch {
      toast.error("Une erreur est survenue lors de l'envoi de la demande.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Button variant="ghost" className="mb-6 -ml-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à mes commandes
      </Button>

      <Card className="rounded-[2.5rem] border-muted-foreground/10 shadow-sm">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <RotateCcw className="w-6 h-6 text-primary" /> Effectuer un retour
          </CardTitle>
          <CardDescription>Commande {id}</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4 space-y-6">
          <div className="space-y-2">
            <Label>Raison du retour</Label>
            <Select onValueChange={setReason}>
              <SelectTrigger className="rounded-2xl h-12">
                <SelectValue placeholder="Sélectionnez une raison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="defective">Produit défectueux</SelectItem>
                <SelectItem value="wrong">Mauvais article reçu</SelectItem>
                <SelectItem value="changed">Changement d'avis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Commentaire</Label>
            <Textarea
              placeholder="Détails supplémentaires..."
              className="rounded-2xl min-h-[120px]"
            />
          </div>

          <Button
            className="w-full h-12 rounded-2xl font-bold"
            onClick={handleSubmit}
            disabled={!reason}
          >
            Confirmer la demande de retour
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
