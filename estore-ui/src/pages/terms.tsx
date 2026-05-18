export function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-16">
      <h1 className="font-display text-3xl md:text-5xl font-bold mb-8">Conditions d'Utilisation</h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-foreground font-bold text-xl mb-4">1. Acceptation des conditions</h2>
          <p>
            En accédant au site TechStore et en l'utilisant, vous acceptez d'être lié par les
            présentes conditions d'utilisation. Si vous n'accepttez pas ces conditions, veuillez ne
            pas utiliser notre site.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-bold text-xl mb-4">2. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu présent sur ce site, incluant les textes, graphismes, logos,
            images et codes sources, est la propriété exclusive de TechStore ou de ses partenaires.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-bold text-xl mb-4">3. Commandes et Paiements</h2>
          <p>
            Toute commande passée sur le site implique une obligation de paiement. Les prix sont
            affichés en Euros TTC. TechStore se réserve le droit de modifier ses prix à tout moment.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-bold text-xl mb-4">
            4. Limitation de responsabilité
          </h2>
          <p>
            TechStore ne saurait être tenu responsable des dommages directs ou indirects résultant
            de l'utilisation ou de l'impossibilité d'utiliser le site.
          </p>
        </section>

        <p className="text-sm pt-8 italic">Dernière mise à jour : Mai 2026</p>
      </div>
    </div>
  );
}
