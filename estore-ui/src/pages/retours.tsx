import { Link } from "react-router-dom";
import { RotateCcw, ShieldCheck, HelpCircle, MessageCircle } from "lucide-react";

export function RetoursPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold">Retours & Garanties</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Votre satisfaction est notre priorité absolue.
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
              <RotateCcw className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold">Retours sous 30 jours</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Vous avez changé d'avis ? Pas de problème. Vous disposez de 30 jours calendaires à
            compter de la date de réception pour nous retourner votre article. L'article doit être
            dans son état d'origine, non utilisé et dans son emballage d'origine.
          </p>
          <div className="mt-6 p-6 rounded-2xl bg-surface border border-border">
            <h3 className="font-semibold mb-3">Comment faire un retour ?</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Connectez-vous à votre espace client.</li>
              <li>Allez dans l'historique de vos commandes.</li>
              <li>Sélectionnez la commande et cliquez sur "Effectuer un retour".</li>
              <li>Imprimez l'étiquette et déposez votre colis.</li>
            </ol>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold">Garantie Constructeur</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Tous nos produits bénéficient de la garantie légale de conformité de 2 ans. Certains
            articles haut de gamme incluent une extension de garantie gratuite. Si votre produit
            présente un défaut technique, nous assurons la réparation ou l'échange à neuf.
          </p>
        </section>

        <section className="rounded-3xl bg-primary p-8 md:p-12 text-primary-foreground text-center">
          <HelpCircle className="mx-auto h-12 w-12 opacity-20 mb-6" />
          <h2 className="font-display text-3xl font-bold mb-4">Besoin d'aide ?</h2>
          <p className="mb-8 opacity-90 max-w-lg mx-auto">
            Notre service client est disponible du lundi au samedi pour répondre à toutes vos
            questions concernant vos retours ou le SAV.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-primary hover:bg-white/90 transition"
          >
            <MessageCircle className="h-4 w-4" /> Contacter le support
          </Link>
        </section>
      </div>
    </div>
  );
}
