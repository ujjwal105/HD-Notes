import Notes from "@/app/Notes";

function PrivateRoutes() {
  return {
    path: "/",
    children: [
      {
        path: "notes",
        element: (
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        ),
      },
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        ),
      },
    ],
  };
}

export default PrivateRoutes;

import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!apiClient.isAuthenticated()) {
      navigate("/auth");
    }
  }, [navigate]);

  if (!apiClient.isAuthenticated()) {
    return <div>Redirecting...</div>;
  }

  return <>{children}</>;
};
