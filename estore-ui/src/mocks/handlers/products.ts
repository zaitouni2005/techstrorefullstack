import { http, HttpResponse, delay } from "msw";
import { db, API_DELAY } from "../db";
import { requireAdmin, requireAuth } from "./auth";
import { validateBody, notFound } from "../helpers/validation";

export const handlers = [
  http.get("/api/products", async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 50;
    const sort = url.searchParams.get("sort") || "";
    const order = url.searchParams.get("order") || "asc";
    const category = url.searchParams.get("category") || "";
    const brand = url.searchParams.get("brand") || "";
    const q = url.searchParams.get("q") || "";
    const inStock = url.searchParams.get("inStock");
    const minDiscount = Number(url.searchParams.get("minDiscount")) || 0;
    const minPrice = Number(url.searchParams.get("minPrice")) || 0;
    const maxPrice = Number(url.searchParams.get("maxPrice")) || 0;
    const minRating = Number(url.searchParams.get("minRating")) || 0;
    const brands = url.searchParams.get("brands") || "";

    let filtered = [...db.products];

    if (category)
      filtered = filtered.filter((p) => p.categoryId === category || p.category === category);
    if (brand) filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }
    if (inStock === "true") filtered = filtered.filter((p) => p.stock > 0);
    if (minDiscount > 0) {
      filtered = filtered.filter((p) => {
        const d = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
        return d >= minDiscount;
      });
    }
    if (minPrice > 0) filtered = filtered.filter((p) => p.price >= minPrice);
    if (maxPrice > 0) filtered = filtered.filter((p) => p.price <= maxPrice);
    if (minRating > 0) filtered = filtered.filter((p) => p.rating >= minRating);
    if (brands) {
      const list = brands.split(",").map((b) => b.toLowerCase());
      filtered = filtered.filter((p) => list.includes(p.brand.toLowerCase()));
    }

    if (sort) {
      filtered.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sort] as number;
        const bVal = (b as Record<string, unknown>)[sort] as number;
        return order === "desc" ? bVal - aVal : aVal - bVal;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const data = filtered.slice((page - 1) * limit, page * limit);
    await delay(API_DELAY);
    return HttpResponse.json({ data, total, page, limit, totalPages });
  }),

  http.get("/api/products/popular", async ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || 8;
    await delay(API_DELAY);
    const popular = [...db.products]
      .sort((a, b) => b.rating - a.rating || b.stock - a.stock)
      .slice(0, limit);
    return HttpResponse.json(popular);
  }),

  http.get("/api/products/sales", async ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || 3;
    await delay(API_DELAY);
    const sales = [...db.products]
      .filter((p) => p.oldPrice && p.oldPrice > p.price)
      .sort((a, b) => (b.oldPrice! - b.price) / b.oldPrice! - (a.oldPrice! - a.price) / a.oldPrice!)
      .slice(0, limit);
    return HttpResponse.json(sales);
  }),

  http.get("/api/products/search", async ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase() || "";
    const limit = Number(url.searchParams.get("limit")) || 10;
    await delay(API_DELAY);
    if (!q) return HttpResponse.json([]);
    const results = db.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
    return HttpResponse.json(results.slice(0, limit));
  }),

  http.get("/api/products/brands", async () => {
    await delay(API_DELAY);
    const brands = [...new Set(db.products.map((p) => p.brand))].sort();
    return HttpResponse.json(brands);
  }),

  http.get("/api/products/:id", async ({ params }) => {
    await delay(API_DELAY);
    const product = db.products.find((p) => p.id === params.id);
    return product ? HttpResponse.json(product) : notFound("Produit");
  }),

  http.post("/api/products", async ({ request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    const p = (await request.json()) as Record<string, unknown>;
    const validation = validateBody(p, [
      { name: "name", type: "string", required: true },
      { name: "price", type: "number", required: true },
      { name: "brand", type: "string", required: true },
      { name: "category", type: "string", required: true },
    ]);
    if (validation) return validation;
    const newProduct = {
      ...p,
      id: `prod-${Math.random().toString(36).substring(7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as (typeof db.products)[number];
    db.products.push(newProduct);
    await delay(API_DELAY);
    return HttpResponse.json(newProduct);
  }),

  http.patch("/api/products/:id", async ({ params, request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    const p = (await request.json()) as Record<string, unknown>;
    const idx = db.products.findIndex((x) => x.id === params.id);
    if (idx === -1) return notFound("Produit");
    db.products[idx] = {
      ...db.products[idx],
      ...p,
      updatedAt: new Date().toISOString(),
    } as (typeof db.products)[number];
    await delay(API_DELAY);
    return HttpResponse.json(db.products[idx]);
  }),

  http.delete("/api/products/:id", async ({ params, request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    const idx = db.products.findIndex((x) => x.id === params.id);
    if (idx === -1) return notFound("Produit");
    const productId = params.id as string;
    db.products.splice(idx, 1);
    db.reviews = db.reviews.filter((r) => r.productId !== productId);
    for (const key of Object.keys(db.carts)) {
      db.carts[key].items = db.carts[key].items.filter((i) => i.productId !== productId);
    }
    for (const key of Object.keys(db.wishlists)) {
      db.wishlists[key] = db.wishlists[key].filter((w) => w.productId !== productId);
    }
    await delay(API_DELAY);
    return new HttpResponse(null, { status: 204 });
  }),

  // Reviews
  http.get("/api/products/:id/reviews", async ({ params }) => {
    await delay(API_DELAY);
    const productReviews = db.reviews.filter((r) => r.productId === params.id);
    return HttpResponse.json(productReviews);
  }),

  http.post("/api/products/:id/reviews", async ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const hasPurchased = db.orders.some(
      (o) => o.customerId === auth.sub && o.items.some((i) => i.productId === params.id),
    );
    if (!hasPurchased) {
      return HttpResponse.json(
        { error: "Vous devez acheter ce produit avant de laisser un avis" },
        { status: 403 },
      );
    }
    const user = db.users.find((u) => u.email === auth.sub);
    const userId = user?.id || auth.sub;
    const { rating, comment } = (await request.json()) as { rating: number; comment: string };
    const existing = db.reviews.find(
      (r) => r.productId === params.id && (r.userId === userId || r.userId === auth.sub),
    );
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      existing.createdAt = new Date().toISOString();
    } else {
      const newReview = {
        id: `rev-${Date.now()}`,
        productId: params.id as string,
        userId,
        userName: user ? `${user.firstName} ${user.lastName}` : auth.sub,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };
      db.reviews.push(newReview);
    }
    const allReviews = db.reviews.filter((r) => r.productId === params.id);
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    const productIdx = db.products.findIndex((p) => p.id === params.id);
    if (productIdx !== -1) {
      db.products[productIdx].rating = Math.round(avg * 10) / 10;
    }
    await delay(API_DELAY);
    return HttpResponse.json(existing || db.reviews[db.reviews.length - 1]);
  }),

  // Upload
  http.post("/api/upload", async () => {
    await delay(API_DELAY);
    const id = Math.random().toString(36).substring(7);
    return HttpResponse.json({
      url: `https://placehold.co/800x800/6366f1/ffffff?text=Upload+${id}`,
      filename: `upload-${id}.jpg`,
    });
  }),
];
