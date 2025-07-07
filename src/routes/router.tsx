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
import SkillDetail from "@/pages/SkillDetail";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />, // Middleware component to verify auth permission
    children: [
      {
        path: routes.dashboard.path,
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardUser /> },
          { path: routes.skills.path, element: <Skills /> },
          { path: `${routes.skills.path}/:skillId`, element: <SkillDetail /> },
          { path: routes.profil.path, element: <Profil /> },
          { path: routes.store.path, element: <Store /> },
        ],
      },
      { path: routes.canvas.path, element: <CanvasPage /> },
    ],
  },
  { path: routes.notfound.path, element: <NotFoundPage /> },
]);
