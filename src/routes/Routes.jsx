// React Router imports
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";

// Layout components
import BuyerMainLayout from "../components/layouts/BuyerMainLayout";
import SellerMainLayout from "../components/layouts/SellerMainLayout";
import AdminMainLayout from "../components/layouts/AdminMainLayout";

// Buyer page components
import Homepage from "../pages/buyers/Homepage";
import CategoryPage from "../pages/buyers/Categorypage";
import ProductPage from "../pages/buyers/Productpage";
import Cart from "../pages/buyers/Cart";
import CheckoutPage from "../pages/buyers/Checkoutpage";
import OrderConfirmationPage from "../pages/buyers/Orderconfirmpage";
import Dashboard from "../pages/buyers/Dashboard";
import OrderTrackingPage from "../pages/buyers/Ordertrackingpage";
import SearchPage from "../pages/buyers/Searchpage";

// Seller page components
import ProductsPage from "../pages/sellers/Productspage";
import SellerDashboard from "../pages/sellers/Dashboard";
import UploadProductPage from "../pages/sellers/Uploadproduct";
import EditProductPage from "../pages/sellers/Editproduct";
import SettingsPage from "../pages/sellers/Settings";

// Admin page components
import AdminDashboard from "../pages/admin/Dashboard";
import AdminProducts from "../pages/admin/Productspage";
import AdminOrders from "../pages/admin/Orderspage";

// Authentication components
import Authentication from "../pages/auth/Authentication";
import ProtectedRoute from "./ProtectedRoutes";
import BuyerProtectedRoute from "./BuyerProtectedRoute";
import SellerProtectedRoute from "./SellerProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

// Import ErrorPage component
import ErrorPage from "../pages/error/Errorpage";

// Create the router configuration
const router = createBrowserRouter([
  // Buyer routes
  {
    path: "/",
    element: <BuyerMainLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "category/:categoryName", element: <CategoryPage /> },
      { path: "product/:productId", element: <ProductPage /> },
      { path: "search", element: <SearchPage /> },
      // Protected buyer routes
      {
        path: "cart",
        element: (
          <BuyerProtectedRoute>
            <Cart />
          </BuyerProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <BuyerProtectedRoute>
            <CheckoutPage />
          </BuyerProtectedRoute>
        ),
      },
      {
        path: "order-confirmation/:orderId",
        element: (
          <BuyerProtectedRoute>
            <OrderConfirmationPage />
          </BuyerProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "order-tracking",
        element: (
          <ProtectedRoute>
            <OrderTrackingPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Seller routes
  {
    path: "/seller",
    element: <SellerMainLayout />,
    children: [
      {
        index: true,
        element: (
          <SellerProtectedRoute>
            <SellerDashboard />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <SellerProtectedRoute>
            <SellerDashboard />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <SellerProtectedRoute>
            <ProductsPage />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "add-product",
        element: (
          <SellerProtectedRoute>
            <UploadProductPage />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "edit-product/:productId",
        element: (
          <SellerProtectedRoute>
            <EditProductPage />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <SellerProtectedRoute>
            <SettingsPage />
          </SellerProtectedRoute>
        ),
      },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: <AdminMainLayout />,
    children: [
      {
        index: true,
        element: (
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <AdminProtectedRoute>
            <AdminProducts />
          </AdminProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <AdminProtectedRoute>
            <AdminOrders />
          </AdminProtectedRoute>
        ),
      },
    ],
  },

  // Authentication route
  {
    path: "/authentication",
    element: <Authentication />,
  },

  // Error page route (catch-all for unmatched routes)
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

// Main Routes component
export default function Routes() {
  return (
    <RouterProvider router={router}>
      <ScrollRestoration />
    </RouterProvider>
  );
}
