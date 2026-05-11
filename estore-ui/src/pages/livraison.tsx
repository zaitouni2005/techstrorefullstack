import { Truck, ShieldCheck, Clock, MapPin, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function LivraisonPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20 animate-in fade-in duration-700">
      <div className="text-center space-y-4 mb-16">
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
          Livraison Express
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Nous mettons tout en œuvre pour que vos produits high-tech arrivent chez vous le plus
          rapidement possible, en toute sécurité.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Feature
          icon={Zap}
          title="Préparation ultra-rapide"
          desc="Toute commande passée avant 14h est expédiée le jour même depuis notre centre logistique en France."
        />
        <Feature
          icon={Truck}
          title="Suivi en temps réel"
          desc="Recevez un lien de suivi dès l'expédition pour localiser votre colis à chaque étape de son voyage."
        />
        <Feature
          icon={ShieldCheck}
          title="Assurance incluse"
          desc="Tous nos envois sont assurés à 100% de leur valeur. En cas de perte ou casse, nous vous remboursons."
        />
      </div>

      <div className="mt-20 rounded-[3rem] bg-surface p-8 md:p-16 border border-border">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Nos transporteurs partenaires
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                  1
                </div>
                <div>
                  <div className="font-bold">Colissimo (La Poste)</div>
                  <div className="text-sm text-muted-foreground">
                    Livraison à domicile en 48h. Signature requise pour les produits de valeur.
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                  2
                </div>
                <div>
                  <div className="font-bold">Chronopost</div>
                  <div className="text-sm text-muted-foreground">
                    Livraison express en 24h avant 13h. Idéal pour vos besoins urgents.
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                  3
                </div>
                <div>
                  <div className="font-bold">Mondial Relay</div>
                  <div className="text-sm text-muted-foreground">
                    Retrait dans l'un des 12 000 points relais partout en France sous 3-5 jours.
                  </div>
                </div>
              </div>
            </div>
            <Button
              asChild
              className="rounded-full px-8 py-6 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <Link to="/products">Continuer mes achats</Link>
            </Button>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-primary-glow/5 rounded-[3rem] blur-xl group-hover:scale-105 transition-transform duration-500" />
            <div className="relative bg-card rounded-[2.5rem] border border-border p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="font-bold">Statut de livraison</span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold text-muted-foreground"
                >
                  En cours
                </Badge>
              </div>
              <div className="space-y-6">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[65%]" />
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-bold text-sm">Centre de tri - Lyon</p>
                    <p className="text-xs text-muted-foreground">Arrivé le 10 Mai à 04:12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

function Feature({ icon: Icon, title, desc }: FeatureProps) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-card border border-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/5 text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-inner">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function Badge({
  children,
  variant,
  className,
}: {
  children: React.ReactNode;
  variant?: "outline";
  className?: string;
}) {
  return (
    <span
      className={`px-2 py-1 rounded text-[10px] border ${variant === "outline" ? "border-border" : ""} ${className}`}
    >
      {children}
    </span>
  );
}
