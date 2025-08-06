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
import { WorkSession } from "@/pages/dashboard/WorkSession";
import { SkillTreePage } from "@/pages/SkillTreePage";

export const router = createBrowserRouter([
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
          {
            path: routes.workSession.path,
            element: <WorkSession />,
          },
        ],
      },
      {
        path: routes.canvas.path,
        element: <CanvasPage />,
      },
      {
        path: routes.skillsTree.path,
        element: <SkillTreePage />,
      },
    ],
  },
  { path: routes.notfound.path, element: <NotFoundPage /> },
]);
