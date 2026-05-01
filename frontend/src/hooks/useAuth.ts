import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

// ─── useAuth Hook ──────────────────────────────────────────────
// Provides auth state and actions to any component
const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  } = useAuthStore();

  // ─── Derived State ──────────────────────────────────────────
  const isAdmin   = user?.role === "ADMIN";
  const isTrainer = user?.role === "TRAINER";
  const isUser    = user?.role === "USER";

  return {
    // ─── State ───────────────────────────────────────────────
    user,
    token,
    isAuthenticated,
    isLoading,

    // ─── Role Helpers ─────────────────────────────────────────
    isAdmin,
    isTrainer,
    isUser,

    // ─── Actions ─────────────────────────────────────────────
    login,
    register,
    logout,
    updateUser,
  };
};

// ─── useRequireAuth Hook ───────────────────────────────────────
// Redirects to login if user is not authenticated
export const useRequireAuth = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return { isAuthenticated };
};

// ─── useRedirectIfAuth Hook ────────────────────────────────────
// Redirects to dashboard if user is already authenticated
export const useRedirectIfAuth = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return { isAuthenticated };
};

export default useAuth;