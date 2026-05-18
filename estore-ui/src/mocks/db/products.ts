import type { Product } from "@/types";

const img = (q: string) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=80`;
const placeholder = (text: string) =>
  `https://placehold.co/800x800/6366f1/ffffff?text=${encodeURIComponent(text)}`;

const mk = (
  id: string,
  name: string,
  brand: string,
  category: string,
  categoryId: string,
  price: number,
  rating: number,
  stock: number,
  oldPrice?: number,
): Product => ({
  id,
  name,
  brand,
  category,
  categoryId,
  price,
  oldPrice,
  rating,
  stock,
  mainImage: placeholder(name),
  images: [placeholder(name)],
  description: `${name} — ${brand}. Qualité premium aux meilleurs prix.`,
  descriptionMarkdown: `## ${name}\n\n${name} de **${brand}** — alliez performance et style au quotidien.`,
  specs: [],
});

const phoneBrands = [
  {
    brand: "Apple",
    models: [
      { id: "iphone-16", name: "iPhone 16", price: 999, rating: 4.7, stock: 20, oldPrice: 1099 },
      { id: "iphone-16-plus", name: "iPhone 16 Plus", price: 1149, rating: 4.6, stock: 15 },
      {
        id: "iphone-16-pro",
        name: "iPhone 16 Pro",
        price: 1399,
        rating: 4.9,
        stock: 18,
        oldPrice: 1499,
      },
      { id: "iphone-16-pro-max", name: "iPhone 16 Pro Max", price: 1599, rating: 4.9, stock: 10 },
      { id: "iphone-15", name: "iPhone 15", price: 849, rating: 4.5, stock: 25, oldPrice: 949 },
      { id: "iphone-15-plus", name: "iPhone 15 Plus", price: 999, rating: 4.4, stock: 12 },
      { id: "iphone-se", name: "iPhone SE", price: 539, rating: 4.3, stock: 30 },
    ],
  },
  {
    brand: "Samsung",
    models: [
      { id: "galaxy-s25", name: "Galaxy S25", price: 899, rating: 4.6, stock: 22 },
      { id: "galaxy-s25-plus", name: "Galaxy S25+", price: 1099, rating: 4.7, stock: 14 },
      {
        id: "galaxy-s25-ultra",
        name: "Galaxy S25 Ultra",
        price: 1399,
        rating: 4.8,
        stock: 9,
        oldPrice: 1499,
      },
      { id: "galaxy-a56", name: "Galaxy A56", price: 499, rating: 4.3, stock: 35 },
      { id: "galaxy-a36", name: "Galaxy A36", price: 349, rating: 4.1, stock: 40 },
      { id: "galaxy-z-fold-7", name: "Galaxy Z Fold 7", price: 1999, rating: 4.7, stock: 5 },
      { id: "galaxy-z-flip-7", name: "Galaxy Z Flip 7", price: 1199, rating: 4.5, stock: 8 },
    ],
  },
  {
    brand: "Xiaomi",
    models: [
      { id: "xiaomi-15", name: "Xiaomi 15", price: 799, rating: 4.5, stock: 18 },
      { id: "xiaomi-15-pro", name: "Xiaomi 15 Pro", price: 999, rating: 4.6, stock: 12 },
      { id: "xiaomi-15-ultra", name: "Xiaomi 15 Ultra", price: 1299, rating: 4.7, stock: 7 },
      { id: "redmi-note-14", name: "Redmi Note 14", price: 299, rating: 4.2, stock: 45 },
      { id: "redmi-note-14-pro", name: "Redmi Note 14 Pro", price: 399, rating: 4.3, stock: 30 },
    ],
  },
  {
    brand: "Google",
    models: [
      { id: "pixel-10", name: "Pixel 10", price: 799, rating: 4.6, stock: 16 },
      { id: "pixel-10-pro", name: "Pixel 10 Pro", price: 1099, rating: 4.8, stock: 11 },
      { id: "pixel-10-pro-xl", name: "Pixel 10 Pro XL", price: 1299, rating: 4.7, stock: 8 },
      { id: "pixel-9a", name: "Pixel 9a", price: 499, rating: 4.4, stock: 25 },
    ],
  },
  {
    brand: "OnePlus",
    models: [
      { id: "oneplus-13", name: "OnePlus 13", price: 899, rating: 4.6, stock: 14 },
      { id: "oneplus-13r", name: "OnePlus 13R", price: 699, rating: 4.4, stock: 20 },
      { id: "oneplus-12", name: "OnePlus 12", price: 799, rating: 4.5, stock: 10, oldPrice: 899 },
    ],
  },
  {
    brand: "Nothing",
    models: [
      { id: "nothing-phone-3", name: "Nothing Phone (3)", price: 649, rating: 4.3, stock: 13 },
      { id: "nothing-phone-2a", name: "Nothing Phone (2a)", price: 399, rating: 4.2, stock: 22 },
    ],
  },
];

const computerBrands = [
  {
    brand: "Apple",
    models: [
      { id: "macbook-air-15", name: 'MacBook Air 15" M4', price: 1599, rating: 4.8, stock: 14 },
      { id: "macbook-air-13", name: 'MacBook Air 13" M4', price: 1299, rating: 4.7, stock: 18 },
      { id: "macbook-pro-16", name: 'MacBook Pro 16" M4', price: 2999, rating: 4.9, stock: 7 },
      { id: "imac-m4", name: 'iMac 24" M4', price: 1699, rating: 4.7, stock: 9 },
      { id: "mac-mini-m4", name: "Mac Mini M4", price: 799, rating: 4.6, stock: 15 },
    ],
  },
  {
    brand: "Dell",
    models: [
      { id: "dell-xps-13", name: "Dell XPS 13", price: 1399, rating: 4.5, stock: 11 },
      { id: "dell-inspiron-16", name: "Dell Inspiron 16", price: 899, rating: 4.2, stock: 20 },
      { id: "dell-latitude-5540", name: "Dell Latitude 5540", price: 1599, rating: 4.4, stock: 8 },
    ],
  },
  {
    brand: "HP",
    models: [
      {
        id: "hp-spectre-x360",
        name: "HP Spectre x360",
        price: 1499,
        rating: 4.5,
        stock: 10,
        oldPrice: 1699,
      },
      { id: "hp-envy-16", name: "HP Envy 16", price: 1199, rating: 4.3, stock: 13 },
      { id: "hp-pavilion-15", name: "HP Pavilion 15", price: 699, rating: 4.1, stock: 25 },
    ],
  },
  {
    brand: "Lenovo",
    models: [
      {
        id: "lenovo-thinkpad-x1",
        name: "Lenovo ThinkPad X1 Carbon",
        price: 2199,
        rating: 4.8,
        stock: 6,
      },
      { id: "lenovo-yoga-9i", name: "Lenovo Yoga 9i", price: 1399, rating: 4.5, stock: 12 },
      { id: "lenovo-ideapad-5", name: "Lenovo IdeaPad 5", price: 649, rating: 4.2, stock: 28 },
    ],
  },
  {
    brand: "ASUS",
    models: [
      { id: "asus-zenbook-14", name: "ASUS ZenBook 14 OLED", price: 1299, rating: 4.6, stock: 16 },
      {
        id: "asus-rog-zephyrus",
        name: "ASUS ROG Zephyrus G16",
        price: 2199,
        rating: 4.7,
        stock: 5,
      },
      { id: "asus-vivobook-15", name: "ASUS VivoBook 15", price: 549, rating: 4.0, stock: 32 },
    ],
  },
];

const tabletBrands = [
  {
    brand: "Apple",
    models: [
      { id: "ipad-pro-13-m4", name: 'iPad Pro 13" M4', price: 1699, rating: 4.9, stock: 11 },
      { id: "ipad-air-11-m2", name: 'iPad Air 11" M2', price: 749, rating: 4.7, stock: 22 },
      { id: "ipad-10", name: "iPad 10e génération", price: 459, rating: 4.5, stock: 30 },
      { id: "ipad-mini-a17", name: "iPad Mini A17 Pro", price: 659, rating: 4.6, stock: 15 },
    ],
  },
  {
    brand: "Samsung",
    models: [
      {
        id: "galaxy-tab-s10-ultra",
        name: "Galaxy Tab S10 Ultra",
        price: 1399,
        rating: 4.7,
        stock: 8,
      },
      { id: "galaxy-tab-s10-plus", name: "Galaxy Tab S10+", price: 1099, rating: 4.5, stock: 14 },
      { id: "galaxy-tab-a9", name: "Galaxy Tab A9+", price: 299, rating: 4.1, stock: 35 },
    ],
  },
  {
    brand: "Microsoft",
    models: [
      {
        id: "surface-pro-10",
        name: "Surface Pro 10",
        price: 1349,
        rating: 4.6,
        stock: 7,
        oldPrice: 1499,
      },
      { id: "surface-laptop-7", name: "Surface Laptop 7", price: 1299, rating: 4.5, stock: 10 },
    ],
  },
  {
    brand: "Huawei",
    models: [
      {
        id: "huawei-matepad-pro",
        name: "Huawei MatePad Pro 13.2",
        price: 899,
        rating: 4.4,
        stock: 9,
      },
      { id: "huawei-matepad-11", name: "Huawei MatePad 11.5", price: 499, rating: 4.2, stock: 18 },
    ],
  },
];

const accessoryBrands = [
  {
    brand: "Sony",
    models: [
      {
        id: "sony-wf-1000xm5",
        name: "Sony WF-1000XM5",
        price: 279,
        rating: 4.8,
        stock: 20,
        oldPrice: 319,
      },
      { id: "sony-wH-720n", name: "Sony WH-720N", price: 199, rating: 4.4, stock: 25 },
      { id: "sony-srs-xb100", name: "Sony SRS-XB100", price: 59, rating: 4.2, stock: 40 },
    ],
  },
  {
    brand: "Logitech",
    models: [
      { id: "logitech-g502", name: "Logitech G502 X", price: 79, rating: 4.7, stock: 30 },
      { id: "logitech-mx-keys", name: "Logitech MX Keys S", price: 119, rating: 4.6, stock: 22 },
      { id: "logitech-c920", name: "Logitech C920 Webcam", price: 89, rating: 4.4, stock: 18 },
    ],
  },
  {
    brand: "Bose",
    models: [
      {
        id: "bose-qc-ultra",
        name: "Bose QC Ultra",
        price: 429,
        rating: 4.8,
        stock: 12,
        oldPrice: 479,
      },
      { id: "bose-qc-45", name: "Bose QC 45", price: 329, rating: 4.6, stock: 16 },
      {
        id: "bose-soundlink-flex",
        name: "Bose SoundLink Flex",
        price: 149,
        rating: 4.4,
        stock: 22,
      },
    ],
  },
  {
    brand: "Anker",
    models: [
      {
        id: "anker-powerbank-26800",
        name: "Anker Power Bank 26800mAh",
        price: 69,
        rating: 4.5,
        stock: 35,
      },
      { id: "anker-charger-gan", name: "Anker 65W GaN Charger", price: 39, rating: 4.6, stock: 45 },
      {
        id: "anker-soundcore-q45",
        name: "Anker Soundcore Q45",
        price: 129,
        rating: 4.3,
        stock: 20,
      },
    ],
  },
  {
    brand: "JBL",
    models: [
      { id: "jbl-tune-770nc", name: "JBL Tune 770NC", price: 129, rating: 4.3, stock: 25 },
      { id: "jbl-flip-6", name: "JBL Flip 6", price: 119, rating: 4.5, stock: 30 },
      { id: "jbl-quantum-360", name: "JBL Quantum 360", price: 79, rating: 4.1, stock: 15 },
    ],
  },
  {
    brand: "Keychron",
    models: [
      { id: "keychron-q1-max", name: "Keychron Q1 Max", price: 199, rating: 4.7, stock: 10 },
      { id: "keychron-k8-pro", name: "Keychron K8 Pro", price: 109, rating: 4.5, stock: 18 },
    ],
  },
  {
    brand: "Razer",
    models: [
      {
        id: "razer-blackshark-v2",
        name: "Razer BlackShark V2 Pro",
        price: 179,
        rating: 4.4,
        stock: 14,
      },
      { id: "razer-viper-v3", name: "Razer Viper V3 Pro", price: 159, rating: 4.6, stock: 12 },
      { id: "razer-kraken-v4", name: "Razer Kraken V4", price: 129, rating: 4.2, stock: 20 },
    ],
  },
];

const generated: Product[] = [
  // Smartphones
  ...phoneBrands.flatMap((b) =>
    b.models.map((m) =>
      mk(
        `${b.brand.toLowerCase()}-${m.id}`,
        m.name,
        b.brand,
        "Smartphones",
        "cat-1",
        m.price,
        m.rating,
        m.stock,
        m.oldPrice,
      ),
    ),
  ),
  // Ordinateurs
  ...computerBrands.flatMap((b) =>
    b.models.map((m) =>
      mk(
        `${b.brand.toLowerCase()}-${m.id}`,
        m.name,
        b.brand,
        "Ordinateurs",
        "cat-2",
        m.price,
        m.rating,
        m.stock,
        m.oldPrice,
      ),
    ),
  ),
  // Tablettes
  ...tabletBrands.flatMap((b) =>
    b.models.map((m) =>
      mk(
        `${b.brand.toLowerCase()}-${m.id}`,
        m.name,
        b.brand,
        "Tablettes",
        "cat-3",
        m.price,
        m.rating,
        m.stock,
        m.oldPrice,
      ),
    ),
  ),
  // Accessoires
  ...accessoryBrands.flatMap((b) =>
    b.models.map((m) =>
      mk(
        `${b.brand.toLowerCase()}-${m.id}`,
        m.name,
        b.brand,
        "Accessoires",
        "cat-4",
        m.price,
        m.rating,
        m.stock,
        m.oldPrice,
      ),
    ),
  ),
];

export const products: Product[] = [
  // Flagship products with rich data
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Smartphones",
    categoryId: "cat-1",
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
    descriptionMarkdown: `## iPhone 15 Pro — L'excellence repoussée

Le **iPhone 15 Pro** redéfinit les standards du smartphone premium.

### Caractéristiques principales

- **Puce A17 Pro** — Performances graphiques de nouvelle génération
- **Châssis titane** — Léger, résistant, élégant
- **Système photo Pro** — 48 Mpx avec zoom optique 5x
- **USB-C** — Connectivité universelle et transferts rapides

> "Le meilleur iPhone jamais créé" — *Tech Reviews*

### Idéal pour

| Usage | Performance |
|-------|-------------|
| Photographie | ⭐⭐⭐⭐⭐ |
| Gaming | ⭐⭐⭐⭐⭐ |
| Productivité | ⭐⭐⭐⭐☆ |`,
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
    categoryId: "cat-1",
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
    descriptionMarkdown: `## Galaxy S24 Ultra — L'IA à portée de main

Découvrez la puissance du **Galaxy AI** avec le S24 Ultra.

### Points forts

- **Galaxy AI** — Traduction, retouche photo, productivité
- **S Pen intégré** — Prenez des notes avec précision
- **Écran 6.8" QHD+** — Dynamic AMOLED 2X, 120 Hz
- **Zoom optique 5x** — Capturez l'instant, même de loin

\`\`\`
Stockage : 512 Go
RAM : 12 Go
Batterie : 5000 mAh
\`\`\``,
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
    categoryId: "cat-2",
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
    descriptionMarkdown: `## MacBook Pro 14" M3 — La puissance à son apogée

Le MacBook Pro avec **puce M3 Pro** est conçu pour les créateurs et les professionnels exigeants.

### Performances

| Composant | Valeur |
|-----------|--------|
| CPU | 12 cœurs (6 performance + 6 efficacité) |
| GPU | 18 cœurs |
| RAM | 18 Go unifiée |
| Stockage | 512 Go SSD |

> *"Un monstre de puissance dans un châssis élégant"*

### Autonomie

- 🎬 Jusqu'à **22h** de lecture vidéo
- 💻 **15h** de navigation web`,
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
    categoryId: "cat-4",
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
    descriptionMarkdown: `## Sony WH-1000XM5 — Le silence absolu

Plongez dans votre univers avec la **réduction de bruit active** la plus avancée du marché.

### Pourquoi choisir le XM5 ?

1. **Réduction de bruit** adaptative (8 micros)
2. **Qualité sonore** Hi-Res Audio Wireless
3. **Confort** design ultra-léger (250g)
4. **Autonomie** 30 heures de lecture

> "Une référence incontestable dans le monde du audio" — *What Hi-Fi*

**Contenu de la boîte :**
- Casque WH-1000XM5
- Câble USB-C
- Câble jack 3.5mm
- Étui de transport`,
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
    categoryId: "cat-3",
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
    descriptionMarkdown: `## iPad Pro 12.9 M2 — L'ultime tablette professionnelle

L'**iPad Pro** avec puce M2 est une véritable station de travail portable.

### Capacités

- **Puce M2** — Des performances qui rivalisent avec un PC
- **Écran Liquid Retina XDR** — 1600 nits de luminosité max
- **Apple Pencil 2** — Précision et fluidité
- **5G** — Restez connecté partout

### Parfait pour

- 🎨 Design et illustration
- 🎬 Montage vidéo
- 📝 Prise de notes
- 💻 Productivité mobile`,
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
    categoryId: "cat-2",
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
    descriptionMarkdown: `## Dell XPS 15 — L'élégance performante

L'**XPS 15** offre le meilleur équilibre entre puissance et mobilité.

### Configuration

- Intel Core i7 **13e génération**
- 32 Go **DDR5**
- 1 To **SSD NVMe**
- Écran **OLED 4K** InfinityEdge

### Design

Avec son format compact et son écran **InfinityEdge** bord à bord, l'XPS 15 vous accompagne partout sans compromis.

> "Le meilleur PC Windows portable" — *Laptop Mag*`,
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
    categoryId: "cat-4",
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
    descriptionMarkdown: `## MX Master 3S — La souris des pros

La souris **MX Master 3S** est l'outil indispensable pour les créateurs et développeurs.

### Caractéristiques

- ✅ Capteur **8000 DPI**
- ✅ **7 boutons** programmables
- ✅ Molette **MAGSPEED** électromagnétique
- ✅ **Silencieux** — clics discrets

### Autonomie

| Usage | Autonomie |
|-------|-----------|
| Standard | 70 jours |
| Intensif | 50 jours |

*Recharge USB-C — 1 min de charge = 3h d'utilisation*`,
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
    categoryId: "cat-3",
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
    descriptionMarkdown: `## Surface Pro 9 — La liberté sans compromis

La **Surface Pro 9** combine la polyvalence d'une tablette avec la puissance d'un PC.

### Ce qui change tout

- **Intel Core i5** — Performances de bureau
- **Écran 13" PixelSense** — Tactile, 120 Hz
- **Jusqu'à 15h** d'autonomie
- **Windows 11** — Tous vos logiciels préférés

### Idéale pour

| Activité | Note |
|----------|------|
| Télétravail | ⭐⭐⭐⭐⭐ |
| Prise de notes | ⭐⭐⭐⭐⭐ |
| Création | ⭐⭐⭐⭐☆ |
| Gaming léger | ⭐⭐⭐☆☆ |`,
    specs: [
      { label: "Écran", value: '13" PixelSense' },
      { label: "Processeur", value: "Intel Core i5" },
      { label: "RAM", value: "16 Go" },
      { label: "Stockage", value: "256 Go SSD" },
    ],
  },
  ...generated,
];
