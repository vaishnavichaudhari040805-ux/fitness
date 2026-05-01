import { create } from "zustand";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";

// ─── Types ─────────────────────────────────────────────────────
export interface Exercise {
  id:         string;
  name:       string;
  sets:       number;
  reps:       number;
  weightKg?:  number;
  completed?: boolean;
  notes?:     string;
}

export interface Workout {
  id:             string;
  title:          string;
  description?:   string;
  status:         "Pending" | "Completed" | "pending" | "completed";
  completed?:     boolean;
  isAiGenerated?: boolean;
  scheduledFor?:  string;
  exercises:      Exercise[];
  createdAt?:     string;
  updatedAt?:     string;
}

interface WorkoutState {
  workouts: Workout[];
  currentWorkout: Workout | null;
  isLoading: boolean;
  isGeneratingAi: boolean;

  // ─── Actions ───────────────────────────────────────────────
  fetchWorkouts: () => Promise<void>;
  fetchWorkoutById: (id: string) => Promise<void>;
  createWorkout: (data: Partial<Workout>) => Promise<boolean>;
  completeWorkout: (id: string) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  generateAiWorkout: () => Promise<void>;
  setCurrentWorkout: (workout: Workout | null) => void;
}

// ─── Workout Store ─────────────────────────────────────────────
const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  currentWorkout: null,
  isLoading: false,
  isGeneratingAi: false,

  // ─── Fetch All Workouts ─────────────────────────────────────
  fetchWorkouts: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/workouts");
      set({
        workouts: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  // ─── Fetch Single Workout ───────────────────────────────────
  fetchWorkoutById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/workouts/${id}`);
      set({
        currentWorkout: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  // ─── Create Workout ─────────────────────────────────────────
  createWorkout: async (data: Partial<Workout>): Promise<boolean> => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/workouts", data);
      const newWorkout = response.data.data;

      set((state) => ({
        workouts: [newWorkout, ...state.workouts],
        isLoading: false,
      }));

      toast.success("Workout created successfully! 💪");
      return true;
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  // ─── Complete Workout ───────────────────────────────────────
  completeWorkout: async (id: string) => {
    try {
      const response = await axiosInstance.patch(`/workouts/${id}/complete`);
      const updatedWorkout = response.data.data;

      set((state) => ({
        workouts: state.workouts.map((w) =>
          w.id === id ? updatedWorkout : w
        ),
      }));

      toast.success("Workout completed! +50 XP 🎉");
    } catch (error) {}
  },

  // ─── Delete Workout ─────────────────────────────────────────
  deleteWorkout: async (id: string) => {
    try {
      await axiosInstance.delete(`/workouts/${id}`);

      set((state) => ({
        workouts: state.workouts.filter((w) => w.id !== id),
      }));

      toast.success("Workout deleted successfully.");
    } catch (error) {}
  },

  // ─── Generate AI Workout ────────────────────────────────────
  generateAiWorkout: async () => {
    set({ isGeneratingAi: true });
    try {
      await axiosInstance.post("/ai/generate-workout");

      // ─── Refresh workouts list after AI generation ────────
      await get().fetchWorkouts();

      toast.success("🤖 AI Workout Plan generated successfully!");
    } catch (error) {
      toast.error("Failed to generate AI workout. Check your profile first.");
    } finally {
      set({ isGeneratingAi: false });
    }
  },

  // ─── Set Current Workout ────────────────────────────────────
  setCurrentWorkout: (workout: Workout | null) => {
    set({ currentWorkout: workout });
  },
}));

export default useWorkoutStore;