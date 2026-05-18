import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/types";

export type CartItem = { product: Product; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "techstore_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch (error) {
      console.error("Failed to load cart from local storage", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add: CartCtx["add"] = (p, qty = 1) => {
    setItems((cur) => {
      const exist = cur.find((i) => i.product.id === p.id);
      if (exist) return cur.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + qty } : i));
      return [...cur, { product: p, qty }];
    });
  };
  const remove: CartCtx["remove"] = (id) => setItems((c) => c.filter((i) => i.product.id !== id));
  const setQty: CartCtx["setQty"] = (id, qty) =>
    setItems((c) => c.map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.product.price, 0);

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
