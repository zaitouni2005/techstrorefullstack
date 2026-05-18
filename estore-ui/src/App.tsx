import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { HomePage } from "@/pages/index";
import { ProductsPage } from "@/pages/products";
import { ProductDetailPage } from "@/pages/products.$id";
import { CartPage } from "@/pages/cart";
import { CheckoutPage } from "@/pages/checkout";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ContactPage } from "@/pages/contact";
import { LivraisonPage } from "@/pages/livraison";
import { RetoursPage } from "@/pages/retours";
import { ReturnRequestPage } from "@/pages/returns.request.$id";
import { ProfilePage } from "@/pages/profile";
import { OrdersPage } from "@/pages/orders";
import { OrderTrackingPage } from "@/pages/orders.$id";
import { PrivacyPage } from "@/pages/privacy";
import { TermsPage } from "@/pages/terms";

// Admin Imports
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/pages/admin/index";
import { AdminProducts } from "@/pages/admin/products";
import { AdminCategories } from "@/pages/admin/categories";
import { AdminUsers } from "@/pages/admin/users";
import { AdminOrders } from "@/pages/admin/orders";
import { AdminOrderDetail } from "@/pages/admin/orders.$id";
import { AdminPlaceholder } from "@/pages/admin/placeholder";
import { AdminGuard } from "@/components/AdminGuard";

function Layout() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <ScrollRestoration />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster />
    </CartProvider>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "livraison",
        element: <LivraisonPage />,
      },
      {
        path: "retours",
        element: <RetoursPage />,
      },
      {
        path: "returns/request/:id",
        element: <ReturnRequestPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "orders/:id",
        element: <OrderTrackingPage />,
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
      },
      {
        path: "terms",
        element: <TermsPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "products",
            element: <AdminProducts />,
          },
          {
            path: "categories",
            element: <AdminCategories />,
          },
          {
            path: "users",
            element: <AdminUsers />,
          },
          {
            path: "orders",
            children: [
              {
                index: true,
                element: <AdminOrders />,
              },
              {
                path: ":id",
                element: <AdminOrderDetail />,
              },
            ],
          },
          {
            path: "settings",
            element: <AdminPlaceholder title="Paramètres" />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
