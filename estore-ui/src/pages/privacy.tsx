export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-16">
      <h1 className="font-display text-3xl md:text-5xl font-bold mb-8">
        Politique de Confidentialité
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-foreground font-bold text-xl mb-4">1. Collecte des données</h2>
          <p>
            Chez TechStore, nous accordons une importance capitale à la protection de vos données
            personnelles. Nous collectons les informations que vous nous fournissez lors de la
            création d'un compte, d'un achat ou d'une inscription à notre newsletter.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-bold text-xl mb-4">
            2. Utilisation des informations
          </h2>
          <p>
            Les données collectées sont utilisées pour traiter vos commandes, améliorer votre
            expérience sur notre site, et vous informer de nos offres spéciales (avec votre
            consentement).
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-bold text-xl mb-4">3. Protection des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité rigoureuses pour préserver la sécurité de
            vos informations personnelles. Vos données ne sont jamais vendues à des tiers.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-bold text-xl mb-4">4. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de
            suppression de vos données personnelles. Vous pouvez exercer ces droits en nous
            contactant via notre formulaire de contact.
          </p>
        </section>

        <p className="text-sm pt-8 italic">Dernière mise à jour : Mai 2026</p>
      </div>
    </div>
  );
}
