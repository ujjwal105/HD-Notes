import SignUp from "@/app/auth/SignUp";
import SignIn from "@/app/auth/SignIn";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api";

function PublicRoutes() {
  return {
    path: "/auth",
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        ),
      },
      {
        path: "signin",
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },
    ],
  };
}

export default PublicRoutes;

import type React from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (apiClient.isAuthenticated()) {
      navigate("/notes", { replace: true });
    }
  }, [navigate]);
  if (apiClient.isAuthenticated()) {
    return null;
  }
  return <>{children}</>;
};
