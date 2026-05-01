import { create } from "zustand";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";

// ─── Types ─────────────────────────────────────────────────────
export interface NutritionLog {
  id: string;
  userId: string;
  foodName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  loggedAt: string;
}

export interface DailySummary {
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatsG: number;
  logs: NutritionLog[];
}

export interface WeeklyEntry {
  date: string;
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatsG: number;
}

interface NutritionState {
  logs: NutritionLog[];
  dailySummary: DailySummary | null;
  weeklyData: WeeklyEntry[];
  isLoading: boolean;

  // ─── Actions ───────────────────────────────────────────────
  fetchAllLogs: () => Promise<void>;
  fetchDailySummary: () => Promise<void>;
  fetchWeeklyData: () => Promise<void>;
  createLog: (data: Partial<NutritionLog>) => Promise<boolean>;
  deleteLog: (id: string) => Promise<void>;
}

// ─── Nutrition Store ───────────────────────────────────────────
const useNutritionStore = create<NutritionState>((set) => ({
  logs: [],
  dailySummary: null,
  weeklyData: [],
  isLoading: false,

  // ─── Fetch All Logs ─────────────────────────────────────────
  fetchAllLogs: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/nutrition");
      set({
        logs: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  // ─── Fetch Daily Summary ────────────────────────────────────
  fetchDailySummary: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/nutrition/daily");
      set({
        dailySummary: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  // ─── Fetch Weekly Data ──────────────────────────────────────
  fetchWeeklyData: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/nutrition/weekly");
      set({
        weeklyData: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  // ─── Create Nutrition Log ───────────────────────────────────
  createLog: async (data: Partial<NutritionLog>): Promise<boolean> => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/nutrition", data);
      const newLog = response.data.data;

      set((state) => ({
        logs: [newLog, ...state.logs],
        isLoading: false,
      }));

      toast.success("Nutrition log added successfully! 🥗");
      return true;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  // ─── Delete Nutrition Log ───────────────────────────────────
  deleteLog: async (id: string) => {
    try {
      await axiosInstance.delete(`/nutrition/${id}`);

      set((state) => ({
        logs: state.logs.filter((log) => log.id !== id),
        // ─── Update daily summary if log was today ──────────
        dailySummary: state.dailySummary
          ? {
              ...state.dailySummary,
              logs: state.dailySummary.logs.filter(
                (log) => log.id !== id
              ),
            }
          : null,
      }));

      toast.success("Nutrition log deleted.");
    } catch (error) {}
  },
}));

export default useNutritionStore;