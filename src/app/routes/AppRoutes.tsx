import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { MainLayout } from "@/features/layout";
import { UserForm } from "@/features/user-form";
import { LoginPage, SignupPage, ProtectedRoute } from "@/features/auth";
import { AbacDemoPage } from "@/app/pages/AbacDemoPage";
import DemoPage from "@/features/page";

// Dashboard page component
// function dashboardPage() {
//   return (
//     <div className="space-y-4">
//       <h1 className="text-3xl font-bold">Dashboard</h1>
//       <p className="text-muted-foreground">
//         Welcome to your dashboard. This is a protected route.
//       </p>
//     </div>
//   );
// }

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
        element: <DemoPage />,
      },
      {
        path: "users",
        element: (
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground mt-2">
              Users page coming soon...
            </p>
          </div>
        ),
      },
      {
        path: "settings",
        element: (
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Settings page coming soon...
            </p>
          </div>
        ),
      },
      {
        path: "user-form",
        element: <UserForm />,
      },
      {
        path: "permissions-demo",
        element: <AbacDemoPage />,
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
