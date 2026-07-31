import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout.js';
import { HealthCheck } from './pages/HealthCheck.js';
import { NotFound } from './pages/NotFound.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { RegisterPage } from './pages/auth/RegisterPage.js';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage.js';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage.js';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage.js';
import { ProfilePage } from './pages/auth/ProfilePage.js';
import { ProtectedRoute } from './components/common/ProtectedRoute.js';
import { RoleRoute } from './components/common/RoleRoute.js';
import { RestaurantsPage } from './pages/RestaurantsPage.js';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderHistoryPage } from './pages/OrderHistoryPage.js';
import { OrderTrackerPage } from './pages/OrderTrackerPage.js';
import { OwnerDashboardPage } from './pages/owner/OwnerDashboardPage.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RestaurantsPage />,
      },
      {
        path: 'restaurants',
        element: <RestaurantsPage />,
      },
      {
        path: 'restaurants/:id',
        element: <RestaurantDetailPage />,
      },
      {
        path: 'health',
        element: <HealthCheck />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'verify-email/:token',
        element: <VerifyEmailPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password/:token',
        element: <ResetPasswordPage />,
      },
      // Protected Customer Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'checkout',
            element: <CheckoutPage />,
          },
          {
            path: 'orders',
            element: <OrderHistoryPage />,
          },
          {
            path: 'orders/:id',
            element: <OrderTrackerPage />,
          },
        ],
      },
      // Owner Dashboard Route
      {
        element: <RoleRoute allowedRoles={['restaurant-owner', 'admin']} />,
        children: [
          {
            path: 'owner/dashboard',
            element: <OwnerDashboardPage />,
          },
        ],
      },
      // Admin Dashboard Route
      {
        element: <RoleRoute allowedRoles={['admin']} />,
        children: [
          {
            path: 'admin/dashboard',
            element: <AdminDashboardPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
