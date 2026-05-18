import { http, HttpResponse, delay } from "msw";
import { db, API_DELAY } from "../db";
import { requireAdmin } from "./auth";

function computeStats() {
  const totalOrders = db.orders.length;
  const totalProducts = db.products.length;
  const lowStock = db.products.filter((p) => p.stock < 10).length;
  const totalRevenue = db.orders.reduce((acc, o) => acc + o.total, 0);
  return {
    revenue: totalRevenue,
    orders: totalOrders,
    products: totalProducts,
    customers: db.users.length,
    lowStock,
  };
}

function computeWeeklySales() {
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const today = new Date();
  return days.map((name, i) => {
    const dayOrders = db.orders.filter((o) => {
      const d = new Date(o.date);
      return d.getDay() === i && d <= today && d >= new Date(today.getTime() - 7 * 86400000);
    });
    return { name, total: dayOrders.reduce((s, o) => s + o.total, 0) };
  });
}

function computeCategoryBreakdown() {
  const map = new Map<string, number>();
  db.products.forEach((p) => {
    map.set(p.category, (map.get(p.category) || 0) + 1);
  });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

function computeRecentActivity() {
  const activity: { title: string; description: string; time: string }[] = [];
  const now = Date.now();
  db.orders.forEach((o) => {
    const diff = Math.floor((now - new Date(o.date).getTime()) / 60000);
    const time = diff < 60 ? `Il y a ${diff} min` : `Il y a ${Math.floor(diff / 60)}h`;
    activity.push({
      title: `Nouvelle commande #${o.id}`,
      description: `Par ${o.customerName} • ${o.total.toFixed(2)}€`,
      time,
    });
  });
  return activity.sort(() => Math.random() - 0.5).slice(0, 8);
}

export const handlers = [
  http.get("/api/dashboard/stats", async ({ request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    await delay(API_DELAY);
    const s = computeStats();
    return HttpResponse.json({
      revenue: s.revenue,
      revenueChange: 12,
      orders: s.orders,
      ordersChange: 5,
      products: s.products,
      productsChange: 8,
      customers: s.customers,
      customersChange: 18,
      lowStock: s.lowStock,
    });
  }),

  http.get("/api/dashboard/sales", async ({ request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    await delay(API_DELAY);
    return HttpResponse.json(computeWeeklySales());
  }),

  http.get("/api/dashboard/categories", async ({ request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    await delay(API_DELAY);
    return HttpResponse.json(computeCategoryBreakdown());
  }),

  http.get("/api/dashboard/activity", async ({ request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    await delay(API_DELAY);
    return HttpResponse.json(computeRecentActivity());
  }),

  http.get("/api/dashboard/top-products", async ({ request }) => {
    const admin = requireAdmin(request);
    if (admin instanceof HttpResponse) return admin;
    await delay(API_DELAY);
    const productRevenue = new Map<string, { name: string; revenue: number; units: number }>();
    db.orders.forEach((o) =>
      o.items.forEach((item) => {
        const existing = productRevenue.get(item.productId) || {
          name: item.name,
          revenue: 0,
          units: 0,
        };
        existing.revenue += item.unitPrice * item.quantity;
        existing.units += item.quantity;
        productRevenue.set(item.productId, existing);
      }),
    );
    return HttpResponse.json(
      Array.from(productRevenue.entries())
        .sort(([, a], [, b]) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(([productId, data]) => ({ productId, ...data })),
    );
  }),
];
