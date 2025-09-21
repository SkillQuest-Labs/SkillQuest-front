import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { routes } from "./router.const";
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout";
import { DashboardUser } from "@/pages/dashboard/DashboardUser";
import { CanvasPage } from "@/pages/canvas/CanvasPage";
import { Skills } from "@/pages/dashboard/Skills";
import { SkillDetail } from "@/modules/skills/components/SkillDetail";
import { Profil } from "@/pages/dashboard/Profil";
import { Store } from "@/pages/dashboard/Store";
import { NotFoundPage } from "@/pages/404";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { authAppearance } from "@/shared/constants/auth.const";
import { AuthLayout } from "@/component/AuthLayout";
import { UnauthorizedPage } from "@/pages/Unauthorized";
import { WorkSession } from "@/pages/dashboard/WorkSession";
import { Stats } from "@/pages/dashboard/Stats";
import { SessionsListingPage } from "@/pages/dashboard/SessionsListingPage";
import { Dojo } from "@/pages/dashboard/Dojo";

export const router = createBrowserRouter([
  // Public routes for authentication
  {
    path: routes.signIn.path,
    element: (
      <AuthLayout>
        <SignIn
          appearance={authAppearance}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      </AuthLayout>
    ),
  },
  {
    path: routes.signUp.path,
    element: (
      <AuthLayout>
        <SignUp
          appearance={authAppearance}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/sign-in"
          unsafeMetadata={{ role: "mentor" }}
        />
      </AuthLayout>
    ),
  },

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
            path: routes.skillDetail.path,
            element: <SkillDetail />,
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
          {
            path: routes.dojo.path,
            element: <Dojo />,
          },
          {
            path: routes.stats.path,
            element: <Stats />,
          },
          {
            path: routes.sessionsListing.path,
            element: <SessionsListingPage />,
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
