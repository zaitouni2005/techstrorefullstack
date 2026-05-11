import {
  initialProducts,
  initialCategories,
  initialUsers,
  initialOrders,
  type Product,
  type Category,
  type User,
  type Order,
} from "@/data/products";

const DELAY = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  products: {
    list: async (): Promise<Product[]> => {
      await sleep(DELAY);
      return [...initialProducts];
    },
    get: async (id: string): Promise<Product | undefined> => {
      await sleep(DELAY);
      return initialProducts.find((p) => p.id === id);
    },
    create: async (p: Omit<Product, "id">): Promise<Product> => {
      await sleep(DELAY);
      const newProduct = { ...p, id: Math.random().toString(36).substring(7) };
      initialProducts.push(newProduct);
      return newProduct;
    },
    update: async (id: string, p: Partial<Product>): Promise<Product> => {
      await sleep(DELAY);
      const idx = initialProducts.findIndex((x) => x.id === id);
      initialProducts[idx] = { ...initialProducts[idx], ...p };
      return initialProducts[idx];
    },
    delete: async (id: string): Promise<void> => {
      await sleep(DELAY);
      const idx = initialProducts.findIndex((x) => x.id === id);
      if (idx > -1) initialProducts.splice(idx, 1);
    },
  },
  categories: {
    list: async (): Promise<Category[]> => {
      await sleep(DELAY);
      return [...initialCategories];
    },
    create: async (c: Omit<Category, "id">): Promise<Category> => {
      await sleep(DELAY);
      const newCat = { ...c, id: `cat-${Math.random().toString(36).substring(7)}` };
      initialCategories.push(newCat);
      return newCat;
    },
    delete: async (id: string): Promise<void> => {
      await sleep(DELAY);
      const idx = initialCategories.findIndex((x) => x.id === id);
      if (idx > -1) initialCategories.splice(idx, 1);
    },
  },
  users: {
    list: async (): Promise<User[]> => {
      await sleep(DELAY);
      return [...initialUsers];
    },
  },
  orders: {
    list: async (): Promise<Order[]> => {
      await sleep(DELAY);
      return [...initialOrders];
    },
    updateStatus: async (id: string, status: Order["status"]): Promise<Order> => {
      await sleep(DELAY);
      const idx = initialOrders.findIndex((o) => o.id === id);
      initialOrders[idx].status = status;
      return initialOrders[idx];
    },
  },
};
