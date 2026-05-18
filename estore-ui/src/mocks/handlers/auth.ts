import { http, HttpResponse, delay } from "msw";
import { db, API_DELAY } from "../db";
import { notFound } from "../helpers/validation";

function getUserFromToken(request: Request): { sub: string; role: string } | null {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    return JSON.parse(atob(auth.slice(7)));
  } catch {
    return null;
  }
}

export function requireAuth(request: Request): { sub: string; role: string } | HttpResponse<any> {
  const user = getUserFromToken(request);
  if (!user) return HttpResponse.json({ error: "Non authentifié" }, { status: 401 });
  return user;
}

export function requireAdmin(request: Request): { sub: string; role: string } | HttpResponse<any> {
  const result = requireAuth(request);
  if (result instanceof HttpResponse) return result;
  if (result.role !== "admin") return HttpResponse.json({ error: "Accès refusé" }, { status: 403 });
  return result;
}

function makeToken(email: string, role: string) {
  return btoa(JSON.stringify({ sub: email, role, iat: Date.now(), exp: Date.now() + 86400000 }));
}

export const handlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    await delay(API_DELAY);
    const user = db.users.find((u) => u.email === email);
    if (!user || user.password !== password)
      return HttpResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    const role = email === "admin@example.com" ? "admin" : "customer";
    const token = makeToken(email, role);
    return HttpResponse.json({ token, role, user });
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const { firstName, lastName, email, password } = (await request.json()) as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };
    await delay(API_DELAY);
    if (db.users.find((u) => u.email === email)) {
      return HttpResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }
    const newUser = {
      id: `user-${Date.now()}`,
      firstName,
      lastName,
      email,
      password,
      orders: 0,
      totalSpent: 0,
      status: "active" as const,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    const token = makeToken(email, "customer");
    return HttpResponse.json({ token, role: "customer", user: newUser });
  }),

  http.get("/api/auth/me", async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    await delay(API_DELAY);
    const user = db.users.find((u) => u.email === auth.sub);
    if (!user) return notFound("Utilisateur");
    return HttpResponse.json({ user, role: auth.role });
  }),

  http.post("/api/auth/change-password", async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const { currentPassword, newPassword } = (await request.json()) as {
      currentPassword: string;
      newPassword: string;
    };
    if (!currentPassword || !newPassword) {
      return HttpResponse.json({ error: "Tous les champs sont requis" }, { status: 422 });
    }
    if (newPassword.length < 6) {
      return HttpResponse.json(
        { error: "Le nouveau mot de passe doit contenir au moins 6 caractères" },
        { status: 422 },
      );
    }
    await delay(API_DELAY);
    return HttpResponse.json({ success: true });
  }),
];
