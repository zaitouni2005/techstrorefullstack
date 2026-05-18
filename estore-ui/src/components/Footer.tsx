import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Github, Twitter, Instagram } from "lucide-react";
import { api } from "@/services/api";
import type { Category } from "@/types";

export function Footer() {
  const year = new Date().getFullYear();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.categories
      .list()
      .then(setCategories)
      .catch(() => console.error("Échec du chargement des catégories"));
  }, []);

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </span>
              TechStore
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Le meilleur de la high-tech sélectionné pour vous. Performance, design et innovation
              au meilleur prix.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-4">Boutique</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Tous les produits
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-4">Aide</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Contactez-nous
                </Link>
              </li>
              <li>
                <Link
                  to="/livraison"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Livraison
                </Link>
              </li>
              <li>
                <Link
                  to="/retours"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Retours & Garanties
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm mb-4">Compte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Profil
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-foreground transition">
                  Panier
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {year} TechStore. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-foreground">
              Confidentialité
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
