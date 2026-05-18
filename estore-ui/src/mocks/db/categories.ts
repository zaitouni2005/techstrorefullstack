import type { Category } from "@/types";

const img = (q: string) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=80`;

export const brands = [
  "Apple",
  "Samsung",
  "Dell",
  "Sony",
  "Logitech",
  "Keychron",
  "Anker",
  "Microsoft",
];

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Smartphones",
    slug: "Smartphones",
    image: img("photo-1511707171634-5f897ff02aa9"),
    description:
      "Les derniers smartphones des plus grandes marques avec les meilleures technologies.",
  },
  {
    id: "cat-2",
    name: "Ordinateurs",
    slug: "Ordinateurs",
    image: img("photo-1496181133206-80ce9b88a853"),
    description:
      "PC portables, ordinateurs de bureau et stations de travail pour tous vos besoins.",
  },
  {
    id: "cat-3",
    name: "Tablettes",
    slug: "Tablettes",
    image: img("photo-1544244015-0df4b3ffc6b0"),
    description: "Tablettes tactiles polyvalentes pour le divertissement et la productivité.",
  },
  {
    id: "cat-4",
    name: "Accessoires",
    slug: "Accessoires",
    image: img("photo-1505740420928-5e560c06d30e"),
    description: "Casques, souris, claviers et tout ce dont vous avez besoin pour votre setup.",
  },
];
