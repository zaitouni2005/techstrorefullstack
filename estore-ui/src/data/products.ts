export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  stock: number;
  mainImage: string;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  orders: number;
  totalSpent: number;
  status: "active" | "inactive";
};

export type Order = {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
};

const img = (q: string) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=80`;
const placeholder = (text: string) =>
  `https://placehold.co/800x800/6366f1/ffffff?text=${encodeURIComponent(text)}`;

export const initialCategories: Category[] = [
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

export const initialProducts: Product[] = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Smartphones",
    price: 1299,
    oldPrice: 1449,
    rating: 4.8,
    stock: 12,
    mainImage: img("photo-1592750475338-74b7b21085ab"),
    images: [
      img("photo-1592750475338-74b7b21085ab"),
      img("photo-1616348436168-de43ad0db179"),
      placeholder("iPhone Pro View 1"),
      placeholder("iPhone Pro View 2"),
      placeholder("iPhone Pro View 3"),
    ],
    description:
      "Le smartphone le plus avancé d'Apple avec puce A17 Pro, châssis titane et système photo Pro 48 Mpx.",
    specs: [
      { label: "Écran", value: '6.1" Super Retina XDR' },
      { label: "Processeur", value: "Apple A17 Pro" },
      { label: "RAM", value: "8 Go" },
      { label: "Stockage", value: "256 Go" },
    ],
  },
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    price: 1199,
    oldPrice: 1299,
    rating: 4.7,
    stock: 8,
    mainImage: img("photo-1610945265064-0e34e5519bbf"),
    images: [
      img("photo-1610945265064-0e34e5519bbf"),
      img("photo-1610945415295-d9bbf067e59c"),
      placeholder("S24 Ultra Zoom"),
      placeholder("S24 Ultra Side"),
    ],
    description:
      'Smartphone Galaxy AI avec S Pen, écran 6.8" Dynamic AMOLED 2X et zoom optique 5x.',
    specs: [
      { label: "Écran", value: '6.8" QHD+ AMOLED' },
      { label: "Processeur", value: "Snapdragon 8 Gen 3" },
      { label: "RAM", value: "12 Go" },
      { label: "Stockage", value: "512 Go" },
    ],
  },
  {
    id: "macbook-pro-14",
    name: 'MacBook Pro 14" M3',
    brand: "Apple",
    category: "Ordinateurs",
    price: 2199,
    rating: 4.9,
    stock: 5,
    mainImage: img("photo-1517336714731-489689fd1ca8"),
    images: [
      img("photo-1517336714731-489689fd1ca8"),
      img("photo-1541807084-5c52b6b3adef"),
      placeholder("MacBook Keyboard"),
      placeholder("MacBook Ports"),
    ],
    description:
      "Performances exceptionnelles avec la puce M3 Pro, écran Liquid Retina XDR et autonomie record.",
    specs: [
      { label: "Écran", value: '14.2" Liquid Retina XDR' },
      { label: "Processeur", value: "Apple M3 Pro" },
      { label: "RAM", value: "18 Go" },
      { label: "Stockage", value: "512 Go SSD" },
    ],
  },
  {
    id: "sony-wh1000xm5",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Accessoires",
    price: 349,
    oldPrice: 399,
    rating: 4.9,
    stock: 15,
    mainImage: img("photo-1618366712010-f4ae9c647dcb"),
    images: [
      img("photo-1618366712010-f4ae9c647dcb"),
      img("photo-1505740420928-5e560c06d30e"),
      placeholder("Sony Detail 1"),
      placeholder("Sony Detail 2"),
    ],
    description:
      "Le meilleur casque à réduction de bruit du marché avec une qualité sonore exceptionnelle et un confort inégalé.",
    specs: [
      { label: "Autonomie", value: "30 heures" },
      { label: "Réduction de bruit", value: "Active (ANC)" },
      { label: "Connexion", value: "Bluetooth 5.2" },
      { label: "Poids", value: "250g" },
    ],
  },
  {
    id: "ipad-pro-m2",
    name: "iPad Pro 12.9 M2",
    brand: "Apple",
    category: "Tablettes",
    price: 1449,
    rating: 4.9,
    stock: 10,
    mainImage: img("photo-1544244015-0df4b3ffc6b0"),
    images: [
      img("photo-1544244015-0df4b3ffc6b0"),
      img("photo-1561154464-82e9adf32764"),
      placeholder("iPad Pencil Detail"),
      placeholder("iPad Screen"),
    ],
    description:
      "L'iPad le plus puissant avec la puce M2, écran Liquid Retina XDR et compatibilité avec l'Apple Pencil 2.",
    specs: [
      { label: "Écran", value: '12.9" Liquid Retina XDR' },
      { label: "Processeur", value: "Apple M2" },
      { label: "RAM", value: "8 Go" },
      { label: "Stockage", value: "256 Go" },
    ],
  },
  {
    id: "dell-xps-15",
    name: "Dell XPS 15",
    brand: "Dell",
    category: "Ordinateurs",
    price: 1899,
    oldPrice: 2099,
    rating: 4.7,
    stock: 6,
    mainImage: img("photo-1593642632823-8f785ba67e45"),
    images: [
      img("photo-1593642632823-8f785ba67e45"),
      img("photo-1588872657578-7efd1f1555ed"),
      placeholder("XPS Screen View"),
      placeholder("XPS Ports View"),
    ],
    description:
      "Le parfait équilibre entre puissance et portabilité. Écran InfinityEdge et performances haut de gamme.",
    specs: [
      { label: "Écran", value: '15.6" OLED 4K' },
      { label: "Processeur", value: "Intel Core i7" },
      { label: "RAM", value: "32 Go" },
      { label: "Stockage", value: "1 To SSD" },
    ],
  },
  {
    id: "mx-master-3s",
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    category: "Accessoires",
    price: 99,
    rating: 4.8,
    stock: 25,
    mainImage: img("photo-1527864550417-7fd91fc51a46"),
    images: [
      img("photo-1527864550417-7fd91fc51a46"),
      placeholder("MX Scroll Wheel"),
      placeholder("MX Side Buttons"),
    ],
    description:
      "La souris emblématique pour les créateurs et les codeurs. Précision, silence et ergonomie.",
    specs: [
      { label: "Capteur", value: "8000 DPI" },
      { label: "Boutons", value: "7 programmables" },
      { label: "Autonomie", value: "70 jours" },
      { label: "Connexion", value: "Logi Bolt / Bluetooth" },
    ],
  },
  {
    id: "surface-pro-9",
    name: "Surface Pro 9",
    brand: "Microsoft",
    category: "Tablettes",
    price: 1149,
    oldPrice: 1299,
    rating: 4.6,
    stock: 12,
    mainImage: img("photo-1664478546384-d27e2870e28e"),
    images: [
      img("photo-1664478546384-d27e2870e28e"),
      img("photo-1664478546394-d27e2870e28e"),
      placeholder("Surface Stand"),
    ],
    description:
      "La polyvalence d'une tablette et la puissance d'un ordinateur portable dans un seul appareil.",
    specs: [
      { label: "Écran", value: '13" PixelSense' },
      { label: "Processeur", value: "Intel Core i5" },
      { label: "RAM", value: "16 Go" },
      { label: "Stockage", value: "256 Go SSD" },
    ],
  },
];

export const initialUsers: User[] = [
  {
    id: "user-1",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    avatar: "https://i.pravatar.cc/150?u=user-1",
    orders: 5,
    totalSpent: 1250.5,
    status: "active",
  },
  {
    id: "user-2",
    name: "Marie Curie",
    email: "marie.curie@example.com",
    avatar: "https://i.pravatar.cc/150?u=user-2",
    orders: 12,
    totalSpent: 3420.0,
    status: "active",
  },
  {
    id: "user-3",
    name: "Lucas Bernard",
    email: "lucas.b@example.com",
    avatar: "https://i.pravatar.cc/150?u=user-3",
    orders: 2,
    totalSpent: 450.0,
    status: "inactive",
  },
];

export const initialOrders: Order[] = [
  {
    id: "ORD-9283",
    customerName: "Jean Dupont",
    date: "2024-05-08",
    total: 1299.0,
    status: "delivered",
    items: 1,
  },
  {
    id: "ORD-1294",
    customerName: "Marie Curie",
    date: "2024-05-09",
    total: 279.0,
    status: "processing",
    items: 2,
  },
  {
    id: "ORD-4567",
    customerName: "Lucas Bernard",
    date: "2024-05-09",
    total: 450.0,
    status: "pending",
    items: 3,
  },
  {
    id: "ORD-8821",
    customerName: "Sophie Martin",
    date: "2024-05-07",
    total: 899.0,
    status: "shipped",
    items: 1,
  },
];

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

// Compatibility exports
export const products = initialProducts.map((p) => ({
  ...p,
  image: p.mainImage,
}));

export const categories = initialCategories;
