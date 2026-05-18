import { products as rawProducts } from "./products";
import { categories as rawCategories } from "./categories";
import { users as rawUsers } from "./users";
import { orders as rawOrders } from "./orders";
import { reviews as rawReviews } from "./reviews";
import type { Cart, WishlistItem } from "@/types";

export const API_DELAY = 500;

export const db = {
  products: [...rawProducts],
  categories: [...rawCategories],
  users: [...rawUsers],
  orders: [...rawOrders],
  reviews: [...rawReviews],
  carts: {} as Record<string, Cart>,
  wishlists: {} as Record<string, WishlistItem[]>,
};

// Recalibrate product ratings from seed reviews
for (const product of db.products) {
  const productReviews = db.reviews.filter((r) => r.productId === product.id);
  const avg = productReviews.reduce((s, r) => s + r.rating, 0) / (productReviews.length || 1);
  product.rating = productReviews.length > 0 ? Math.round(avg * 10) / 10 : 0;
}
