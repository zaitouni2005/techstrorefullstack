export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  rating: number;
  stock: number;
  mainImage: string;
  images: string[];
  description: string;
  descriptionMarkdown?: string;
  specs: ProductSpec[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProductFilter = {
  category?: string;
  brand?: string;
  minDiscount?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  orders: number;
  totalSpent: number;
  status: "active" | "inactive";
  createdAt?: string;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "return_requested";

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  image: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  itemCount: number;
  total: number;
  status: OrderStatus;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  tracking?: {
    carrier: string;
    number: string;
    url?: string;
  };
  statusHistory?: {
    status: OrderStatus;
    timestamp: string;
    location?: string;
  }[];
};

export type DashboardStats = {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  products: number;
  productsChange: number;
  customers: number;
  customersChange: number;
  lowStock: number;
};

export type SalesPoint = {
  name: string;
  total: number;
};

export type DashboardActivity = {
  title: string;
  description: string;
  time: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TopProduct = {
  productId: string;
  name: string;
  revenue: number;
  units: number;
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
};

export type WishlistItem = {
  productId: string;
  addedAt: string;
};

export type Coupon = {
  code: string;
  discountPercent: number;
  discountAmount: number;
  minOrder: number;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
};

export type ShippingOption = {
  carrier: string;
  method: string;
  price: number;
  estimatedDays: string;
};

export type ApiError = {
  error: string;
  details?: Record<string, string[]>;
};
