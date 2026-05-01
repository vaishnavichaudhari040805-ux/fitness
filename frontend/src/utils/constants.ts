export const APP_NAME = "FitPro";
// ─── Socket ─────────────────────────────────────────────────────
export const SOCKET_URL: string =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SOCKET_URL)
    ? (import.meta as any).env.VITE_SOCKET_URL
    : "http://localhost:5000";

// ─── Fitness Goals ──────────────────────────────────────────────
export const FITNESS_GOALS = [
  { value: "Weight_Loss",      label: "Weight Loss",      icon: "🔥" },
  { value: "Muscle_Gain",      label: "Muscle Gain",      icon: "💪" },
  { value: "Endurance",        label: "Endurance",        icon: "🏃" },
  { value: "Flexibility",      label: "Flexibility",      icon: "🧘" },
  { value: "General_Fitness",  label: "General Fitness",  icon: "⚡" },
];

// ─── Activity Levels ────────────────────────────────────────────
export const ACTIVITY_LEVELS = [
  { value: "Sedentary",         label: "Sedentary",          desc: "Little or no exercise"        },
  { value: "Lightly_Active",    label: "Lightly Active",     desc: "Light exercise 1-3 days/week" },
  { value: "Moderately_Active", label: "Moderately Active",  desc: "Moderate exercise 3-5 days"   },
  { value: "Very_Active",       label: "Very Active",        desc: "Hard exercise 6-7 days/week"  },
  { value: "Super_Active",      label: "Super Active",       desc: "Very hard exercise & physical job" },
];

// ─── XP & Levels ────────────────────────────────────────────────
export const XP_REWARDS = {
  WORKOUT_COMPLETE:   50,
  STREAK_BONUS:       25,
  PROFILE_COMPLETE:   20,
  FIRST_WORKOUT:      100,
};

export const LEVELS = [
  { level: 1,  title: "Rookie",      minXp: 0    },
  { level: 2,  title: "Beginner",    minXp: 100  },
  { level: 3,  title: "Intermediate",minXp: 250  },
  { level: 4,  title: "Advanced",    minXp: 500  },
  { level: 5,  title: "Pro",         minXp: 1000 },
  { level: 6,  title: "Elite",       minXp: 2000 },
  { level: 7,  title: "Master",      minXp: 3500 },
  { level: 8,  title: "Legend",      minXp: 5000 },
];

// ─── Daily Nutrition Targets ─────────────────────────────────────
export const DAILY_TARGETS = {
  CALORIES:   2000,
  PROTEIN_G:  150,
  CARBS_G:    250,
  FATS_G:     65,
};

// ─── Chart Colors ───────────────────────────────────────────────
export const CHART_COLORS = {
  protein:  "#a6e3a1",
  carbs:    "#89b4fa",
  fats:     "#f9e2af",
  calories: "#fab387",
};

// ─── Nav Links ──────────────────────────────────────────────────
export const NAV_LINKS = [
  { path: "/dashboard",  label: "Dashboard",  icon: "LayoutDashboard" },
  { path: "/workouts",   label: "Workouts",   icon: "Dumbbell"        },
  { path: "/nutrition",  label: "Nutrition",  icon: "Apple"           },
  { path: "/profile",    label: "Profile",    icon: "User"            },
];