import { handlers as auth } from "./auth";
import { handlers as products } from "./products";
import { handlers as categories } from "./categories";
import { handlers as orders } from "./orders";
import { handlers as users } from "./users";
import { handlers as dashboard } from "./dashboard";
import { handlers as features } from "./features";

export const handlers = [
  ...auth,
  ...products,
  ...categories,
  ...orders,
  ...users,
  ...dashboard,
  ...features,
];
