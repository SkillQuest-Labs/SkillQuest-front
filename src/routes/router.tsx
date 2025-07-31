import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { routes } from "./router.const";
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout";
import { DashboardUser } from "@/pages/dashboard/DashboardUser";
import { CanvasPage } from "@/pages/CanvasPage";
import { Skills } from "@/pages/dashboard/Skills";
import { Profil } from "@/pages/dashboard/Profil";
import { Store } from "@/pages/dashboard/Store";
import { NotFoundPage } from "@/pages/404";
import Login from "@/pages/auth/Login";
//import SignUp from "@/pages/auth/Singup";
import { AuthLayout } from "@/component/AuthLayout";
import { UnauthorizedPage } from "@/pages/Unauthorized";
import "../pages/auth/auth.css";

export const router = createBrowserRouter([
  // Public routes for authentication
  {
    path: routes.signIn.path,
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },

  //{
  //path: routes.signUp.path,
  //element: (
  //<AuthLayout>
  //<SignUp />
  //</AuthLayout>
  //),
  //},

  // Middleware route to protect the dashboard and its children
  {
    element: <ProtectedRoute />, // Middleware component to verify auth permission
    children: [
      {
        path: routes.dashboard.path,
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardUser />,
          },
          {
            path: routes.skills.path,
            element: <Skills />,
          },
          {
            path: routes.profil.path,
            element: <Profil />,
          },
          {
            path: routes.store.path,
            element: <Store />,
          },
        ],
      },
      {
        path: routes.canvas.path,
        element: <CanvasPage />,
      },
    ],
  },
  { path: routes.notfound.path, element: <NotFoundPage /> },
  { path: routes.unauthorized.path, element: <UnauthorizedPage /> },
]);
