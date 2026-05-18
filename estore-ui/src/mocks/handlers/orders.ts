import { http, HttpResponse, delay } from "msw";
import { db, API_DELAY } from "../db";
import { requireAuth, requireAdmin } from "./auth";
import { validateBody, notFound } from "../helpers/validation";

export const handlers = [
  http.get("/api/orders", async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 50;
    const status = url.searchParams.get("status") || "";
    const customerId = url.searchParams.get("customerId") || "";
    if (auth.role !== "admin" && customerId && customerId !== auth.sub) {
      return HttpResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    let filtered = [...db.orders];
    if (auth.role !== "admin") {
      filtered = filtered.filter((o) => o.customerId === auth.sub);
    }
    if (status) filtered = filtered.filter((o) => o.status === status);
    if (customerId && auth.role === "admin") {
      filtered = filtered.filter((o) => o.customerId === customerId);
    }
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const data = filtered.slice((page - 1) * limit, page * limit);
    await delay(API_DELAY);
    return HttpResponse.json({ data, total, page, limit, totalPages });
  }),

  http.get("/api/orders/:id", async ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    await delay(API_DELAY);
    const order = db.orders.find((o) => o.id === params.id);
    if (!order) return notFound("Commande");
    if (auth.role !== "admin" && order.customerId !== auth.sub) {
      return HttpResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return HttpResponse.json(order);
  }),

  http.post("/api/orders", async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const body = (await request.json()) as {
      items: { productId: string; quantity: number }[];
      shippingAddress?: string;
      paymentMethod?: string;
    };
    const validation = validateBody(body, [{ name: "items", required: true }]);
    if (validation) return validation;
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return HttpResponse.json(
        { error: "La commande doit contenir au moins un article" },
        { status: 422 },
      );
    }
    const orderItems = body.items.map((item) => {
      const product = db.products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        image: product.mainImage,
      };
    });
    if (orderItems.includes(null)) {
      return notFound("Produit");
    }
    const validItems = orderItems.filter((item): item is NonNullable<typeof item> => item !== null);
    const total = validItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      customerId: auth.sub,
      customerName: (() => {
        const u = db.users.find((u) => u.email === auth.sub);
        return u ? `${u.firstName} ${u.lastName}` : auth.sub;
      })(),
      items: validItems,
      itemCount: validItems.reduce((sum, i) => sum + i.quantity, 0),
      total,
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: body.shippingAddress || "123 Rue de Paris, 75001 Paris",
      paymentMethod: body.paymentMethod || "Carte bancaire",
    };
    const user = db.users.find((u) => u.email === auth.sub);
    if (user) {
      user.orders += 1;
      user.totalSpent += total;
    }
    db.orders.push(newOrder);
    await delay(API_DELAY);
    return HttpResponse.json(newOrder);
  }),

  http.patch("/api/orders/:id", async ({ params, request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    const { status } = (await request.json()) as { status: string };
    const idx = db.orders.findIndex((o) => o.id === params.id);
    if (idx === -1) return notFound("Commande");
    db.orders[idx] = {
      ...db.orders[idx],
      status: status as (typeof db.orders)[number]["status"],
      updatedAt: new Date().toISOString(),
    };
    await delay(API_DELAY);
    return HttpResponse.json(db.orders[idx]);
  }),
];
