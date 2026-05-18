import { http, HttpResponse, delay } from "msw";
import { db, API_DELAY } from "../db";
import { requireAdmin } from "./auth";
import { notFound } from "../helpers/validation";

export const handlers = [
  http.get("/api/categories", async () => {
    await delay(API_DELAY);
    return HttpResponse.json(db.categories);
  }),

  http.get("/api/categories/:id", async ({ params }) => {
    await delay(API_DELAY);
    const cat = db.categories.find((c) => c.id === params.id);
    return cat ? HttpResponse.json(cat) : notFound("Catégorie");
  }),

  http.post("/api/categories", async ({ request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    const c = (await request.json()) as Record<string, unknown>;
    const newCat = {
      ...c,
      id: `cat-${Math.random().toString(36).substring(7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as (typeof db.categories)[number];
    db.categories.push(newCat);
    await delay(API_DELAY);
    return HttpResponse.json(newCat);
  }),

  http.patch("/api/categories/:id", async ({ params, request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    const c = (await request.json()) as Record<string, unknown>;
    const idx = db.categories.findIndex((x) => x.id === params.id);
    if (idx === -1) return notFound("Catégorie");
    db.categories[idx] = {
      ...db.categories[idx],
      ...c,
      updatedAt: new Date().toISOString(),
    } as (typeof db.categories)[number];
    await delay(API_DELAY);
    return HttpResponse.json(db.categories[idx]);
  }),

  http.delete("/api/categories/:id", async ({ params, request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    const idx = db.categories.findIndex((x) => x.id === params.id);
    if (idx === -1) return notFound("Catégorie");
    const categoryId = params.id as string;
    db.categories.splice(idx, 1);
    for (const product of db.products) {
      if (product.categoryId === categoryId) {
        product.categoryId = "";
        product.category = "";
      }
    }
    await delay(API_DELAY);
    return new HttpResponse(null, { status: 204 });
  }),
];
