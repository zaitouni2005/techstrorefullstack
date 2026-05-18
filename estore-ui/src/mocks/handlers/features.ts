import { http, HttpResponse, delay } from "msw";
import { db, API_DELAY } from "../db";
import { requireAuth } from "./auth";

export const handlers = [
  // Newsletter
  http.post("/api/newsletter/subscribe", async ({ request }) => {
    const { email } = (await request.json()) as { email: string };
    await delay(API_DELAY);
    if (!email || typeof email !== "string") {
      return HttpResponse.json({ error: "Email requis" }, { status: 422 });
    }
    return HttpResponse.json({ success: true });
  }),

  // Cart
  http.get("/api/cart", async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    await delay(API_DELAY);
    const cart = db.carts[auth.sub] || {
      id: `cart-${auth.sub}`,
      userId: auth.sub,
      items: [],
      updatedAt: new Date().toISOString(),
    };
    db.carts[auth.sub] = cart;
    return HttpResponse.json(cart);
  }),

  http.post("/api/cart/items", async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const { productId, quantity = 1 } = (await request.json()) as {
      productId: string;
      quantity: number;
    };
    await delay(API_DELAY);
    const product = db.products.find((p) => p.id === productId);
    if (!product) return HttpResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    let cart = db.carts[auth.sub];
    if (!cart) {
      cart = {
        id: `cart-${auth.sub}`,
        userId: auth.sub,
        items: [],
        updatedAt: new Date().toISOString(),
      };
      db.carts[auth.sub] = cart;
    }
    const existing = cart.items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.mainImage,
        quantity,
      });
    }
    cart.updatedAt = new Date().toISOString();
    return HttpResponse.json(cart);
  }),

  http.patch("/api/cart/items/:productId", async ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const { quantity } = (await request.json()) as { quantity: number };
    await delay(API_DELAY);
    const cart = db.carts[auth.sub];
    if (!cart) return HttpResponse.json({ error: "Panier vide" }, { status: 404 });
    const item = cart.items.find((i) => i.productId === params.productId);
    if (!item)
      return HttpResponse.json({ error: "Article non trouvé dans le panier" }, { status: 404 });
    item.quantity = Math.max(1, quantity);
    cart.updatedAt = new Date().toISOString();
    return HttpResponse.json(cart);
  }),

  http.delete("/api/cart/items/:productId", async ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    await delay(API_DELAY);
    const cart = db.carts[auth.sub];
    if (!cart) return HttpResponse.json({ error: "Panier vide" }, { status: 404 });
    cart.items = cart.items.filter((i) => i.productId !== params.productId);
    cart.updatedAt = new Date().toISOString();
    return HttpResponse.json(cart);
  }),

  http.delete("/api/cart", async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    await delay(API_DELAY);
    delete db.carts[auth.sub];
    return new HttpResponse(null, { status: 204 });
  }),

  // Wishlist
  http.get("/api/wishlist", async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    await delay(API_DELAY);
    const items = db.wishlists[auth.sub] || [];
    return HttpResponse.json(items);
  }),

  http.post("/api/wishlist/:productId", async ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    await delay(API_DELAY);
    if (!db.wishlists[auth.sub]) db.wishlists[auth.sub] = [];
    const existing = db.wishlists[auth.sub]!.find((w) => w.productId === params.productId);
    if (!existing) {
      db.wishlists[auth.sub]!.push({
        productId: params.productId as string,
        addedAt: new Date().toISOString(),
      });
    }
    return HttpResponse.json(db.wishlists[auth.sub]);
  }),

  http.delete("/api/wishlist/:productId", async ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    await delay(API_DELAY);
    if (db.wishlists[auth.sub]) {
      db.wishlists[auth.sub] = db.wishlists[auth.sub]!.filter(
        (w) => w.productId !== params.productId,
      );
    }
    return HttpResponse.json(db.wishlists[auth.sub] || []);
  }),

  // Shipping
  http.post("/api/shipping/calculate", async ({ request }) => {
    const { address } = (await request.json()) as { address?: { country?: string } };
    await delay(API_DELAY);
    const isFrance = address?.country === "France" || !address?.country;
    return HttpResponse.json([
      {
        carrier: "Colissimo",
        method: "Standard",
        price: isFrance ? 4.99 : 14.99,
        estimatedDays: "3-5 jours",
      },
      {
        carrier: "Colissimo",
        method: "Prioritaire",
        price: isFrance ? 9.99 : 24.99,
        estimatedDays: "1-2 jours",
      },
      {
        carrier: "Chronopost",
        method: "Express",
        price: isFrance ? 14.99 : 34.99,
        estimatedDays: "24h",
      },
      {
        carrier: "Mondial Relay",
        method: "Point relais",
        price: isFrance ? 3.49 : 9.99,
        estimatedDays: "4-6 jours",
      },
    ]);
  }),
];
