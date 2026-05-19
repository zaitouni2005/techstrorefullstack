import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Product, CartItem } from "@/types";
import { api } from "@/services/api";
import { useAuth } from "./AuthContext";

type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = useCallback(async () => {
    try {
      const cart = await api.cart.get();
      setItems(cart.items);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (user) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [user, isReady, loadCart]);

  const add: CartCtx["add"] = useCallback(async (p, qty = 1) => {
    const cart = await api.cart.addItem(p.id, qty);
    setItems(cart.items);
  }, []);

  const remove: CartCtx["remove"] = useCallback(async (productId) => {
    const cart = await api.cart.removeItem(productId);
    setItems(cart.items);
  }, []);

  const setQty: CartCtx["setQty"] = useCallback(async (productId, qty) => {
    const cart = await api.cart.updateItem(productId, Math.max(1, qty));
    setItems(cart.items);
  }, []);

  const clear = useCallback(async () => {
    await api.cart.clear();
    setItems([]);
  }, []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, count, total }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
