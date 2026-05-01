import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";

// ─── Types ─────────────────────────────────────────────────────
export interface User {
  id:        string;
  email:     string;
  name:      string;
  role:      string;
  xp:        number;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // ─── Actions ───────────────────────────────────────────────
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// ─── Auth Store with Persistence ──────────────────────────────
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // ─── Login Action ───────────────────────────────────────
      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post("/auth/login", {
            email,
            password,
          });

          const { token, user } = response.data.data;

          // ─── Save token to localStorage ───────────────────
          localStorage.setItem("fitpro_token", token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success(`Welcome back, ${user.email}! 💪`);
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      // ─── Register Action ────────────────────────────────────
      register: async (
        email: string,
        password: string,
        role?: string
      ): Promise<boolean> => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post("/auth/register", {
            email,
            password,
            role,
          });

          const { token, user } = response.data.data;

          // ─── Save token to localStorage ───────────────────
          localStorage.setItem("fitpro_token", token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success("Account created successfully! Welcome 🎉");
          return true;
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      // ─── Logout Action ──────────────────────────────────────
      logout: () => {
        localStorage.removeItem("fitpro_token");
        localStorage.removeItem("fitpro_user");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        toast.success("Logged out successfully.");
        window.location.href = "/login";
      },

      // ─── Update User Action ─────────────────────────────────
      updateUser: (updatedUser: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updatedUser } });
        }
      },
    }),

    // ─── Persist Config ─────────────────────────────────────
    {
      name: "fitpro_auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;