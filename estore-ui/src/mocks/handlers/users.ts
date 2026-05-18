import { http, HttpResponse, delay } from "msw";
import { db, API_DELAY } from "../db";
import { requireAdmin, requireAuth } from "./auth";
import { notFound } from "../helpers/validation";

export const handlers = [
  http.get("/api/users", async ({ request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 50;
    const total = db.users.length;
    const totalPages = Math.ceil(total / limit);
    const data = db.users.slice((page - 1) * limit, page * limit);
    await delay(API_DELAY);
    return HttpResponse.json({ data, total, page, limit, totalPages });
  }),

  http.patch("/api/users/:id", async ({ params, request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    const body = (await request.json()) as { status: string };
    const idx = db.users.findIndex((u) => u.id === params.id);
    if (idx === -1) return notFound("Utilisateur");
    db.users[idx] = { ...db.users[idx], ...body } as (typeof db.users)[number];
    await delay(API_DELAY);
    return HttpResponse.json(db.users[idx]);
  }),

  http.patch("/api/users/me", async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const body = (await request.json()) as { firstName?: string; lastName?: string };
    const idx = db.users.findIndex((u) => u.email === auth.sub);
    if (idx === -1) return notFound("Utilisateur");
    db.users[idx] = { ...db.users[idx], ...body } as (typeof db.users)[number];
    await delay(API_DELAY);
    return HttpResponse.json(db.users[idx]);
  }),
];
