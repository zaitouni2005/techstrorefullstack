import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message envoyé ! Nous vous répondrons sous 24h.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-10">
          <div className="space-y-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Contactez-nous
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Une question sur un produit ou une commande ? Notre équipe est là pour vous aider.
            </p>
          </div>

          <div className="space-y-6">
            <ContactInfo
              icon={Mail}
              title="Email"
              desc="support@techstore.fr"
              sub="Réponse sous 24h"
            />
            <ContactInfo
              icon={Phone}
              title="Téléphone"
              desc="+33 1 23 45 67 89"
              sub="Lun-Ven, 9h-18h"
            />
            <ContactInfo
              icon={MapPin}
              title="Siège social"
              desc="42 Rue de l'Innovation"
              sub="75008 Paris, France"
            />
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-border bg-card p-8 md:p-12 shadow-(--shadow-elegant) relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary/30 via-primary to-primary/30" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Jean Dupont" required className="rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jean@exemple.com"
                  required
                  className="rounded-2xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                placeholder="De quoi s'agit-il ?"
                required
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Votre message ici..."
                className="min-h-[150px] rounded-2xl resize-none"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Envoyer le message <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

interface ContactInfoProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  sub: string;
}

function ContactInfo({ icon: Icon, title, desc, sub }: ContactInfoProps) {
  return (
    <div className="flex gap-4 group">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
          {title}
        </div>
        <div className="text-lg font-bold">{desc}</div>
        <div className="text-sm text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
