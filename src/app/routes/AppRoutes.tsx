import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { MainLayout } from "@/features/layout";
import { UserFormTabs } from "@/features/user-form/UserFormTabs";
import { LoginPage, SignupPage, ProtectedRoute } from "@/features/auth";
import DashboardPage from "@/app/pages/DashboardPage";
import { PermissionGuard } from "@/features/authorization/components/PermissionGuard";

const router = createBrowserRouter([
  // Redirect root to dashboard
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // Auth routes (public)
  {
    path: "auth",
    children: [
      {
        path: "login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <LoginPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <ProtectedRoute requireAuth={false}>
            <SignupPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Protected routes (require authentication)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <PermissionGuard subject="Dashboard">
            <DashboardPage />
          </PermissionGuard>
        ),
      },
      {
        path: "users",
        element: (
          <PermissionGuard subject="Hello">
            <div>
              <h1 className="text-3xl font-bold">Users</h1>
              <p className="text-muted-foreground mt-2">
                Users list coming soon...
              </p>
            </div>
          </PermissionGuard>
        ),
      },
      {
        path: "settings",
        element: (
          <PermissionGuard subject="Settings">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Settings page coming soon...
              </p>
            </div>
          </PermissionGuard>
        ),
      },
      {
        path: "user-form",
        element: (
          <PermissionGuard subject="UserForm">
            <UserFormTabs />
          </PermissionGuard>
        ),
      },
      {
        path: "user-form/:id",
        element: (
          <PermissionGuard subject="UserForm">
            <UserFormTabs userId="123" />
          </PermissionGuard>
        ),
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

