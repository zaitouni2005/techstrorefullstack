import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { HomePage } from "@/pages/index";
import { ProductsPage } from "@/pages/products";
import { ProductDetailPage } from "@/pages/products.$id";
import { CartPage } from "@/pages/cart";
import { CheckoutPage } from "@/pages/checkout";
import { LoginPage } from "@/pages/login";
import { ContactPage } from "@/pages/contact";
import { LivraisonPage } from "@/pages/livraison";
import { RetoursPage } from "@/pages/retours";
import { ProfilePage } from "@/pages/profile";

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
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
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
        path: "profile",
        element: <ProfilePage />,
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
  return <RouterProvider router={router} />;
}
