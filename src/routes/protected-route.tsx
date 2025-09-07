import { LoadingComponent } from "@/component/LoadingComponent";
import { useSynchUser } from "@/shared/hooks/useSynchUser";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

// This component use to handle auth permission.

export const ProtectedRoute = () => {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();

  useSynchUser();

  const allowedRoles = ["mentor", "apprenti"];
  const role = user?.unsafeMetadata?.role;

  if (!isLoaded) return <LoadingComponent />;

  if (!isSignedIn) return <Navigate to="/sign-in" />;

  if (!allowedRoles.includes(role as string)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};
