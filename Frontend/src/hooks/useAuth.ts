"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (apiClient.isAuthenticated()) {
        const currentUser = apiClient.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          // Try to fetch user profile to verify token
          const response = await apiClient.getUserProfile();
          if (response.success && response.user) {
            setUser(response.user);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (
    userData: User
    // tokens: { accessToken: string; refreshToken: string }
  ) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate("/auth");
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  };
};
