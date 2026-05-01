import { LEVELS } from "./constants";

// ─── Calculate BMI ─────────────────────────────────────────────
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
};

// ─── Get BMI Category ──────────────────────────────────────────
export const getBMICategory = (
  bmi: number
): { category: string; color: string } => {
  if (bmi < 18.5) return { category: "Underweight", color: "#3b82f6" };
  if (bmi < 25.0) return { category: "Normal",      color: "#22c55e" };
  if (bmi < 30.0) return { category: "Overweight",  color: "#f59e0b" };
  return             { category: "Obese",         color: "#ef4444" };
};

// ─── Get User Level from XP ────────────────────────────────────
// ─── Get User Level from XP ────────────────────────────────────
export const getUserLevel = (xpPoints: number) => {
  // ─── Find current level ─────────────────────────────────────
  const currentLevel = [...LEVELS]
    .reverse()
    .find((level) => xpPoints >= level.minXp) ?? LEVELS[0];

  // ─── Find next level ────────────────────────────────────────
  const currentIndex = LEVELS.findIndex(
    (l) => l.level === currentLevel.level
  );
  const nextLevel = LEVELS[currentIndex + 1];

  // ─── Calculate progress percentage ──────────────────────────
  const progressPercent = nextLevel
    ? Math.round(
        ((xpPoints - currentLevel.minXp) /
          (nextLevel.minXp - currentLevel.minXp)) *
          100
      )
    : 100;

  return {
    ...currentLevel,
    nextLevel,
    progressPercent,
    xpToNext: nextLevel ? nextLevel.minXp - xpPoints : 0,
  };
};

// ─── Format Date ───────────────────────────────────────────────
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year:    "numeric",
    month:   "short",
    day:     "numeric",
  });
};

// ─── Format Time ───────────────────────────────────────────────
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

// ─── Calculate Calorie Percentage ─────────────────────────────
export const getCaloriePercentage = (
  current: number,
  target: number
): number => {
  return Math.min(Math.round((current / target) * 100), 100);
};

// ─── Get Greeting Based on Time ───────────────────────────────
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

// ─── Truncate Text ─────────────────────────────────────────────
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// ─── Format Large Numbers ──────────────────────────────────────
export const formatNumber = (num: number): string => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

// ─── Get Workout Completion Rate ───────────────────────────────
export const getCompletionRate = (
  completed: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// ─── Check if Date is Today ────────────────────────────────────
export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getFullYear() === checkDate.getFullYear() &&
    today.getMonth()    === checkDate.getMonth() &&
    today.getDate()     === checkDate.getDate()
  );
};

// ─── Get Days of Current Week ──────────────────────────────────
export const getCurrentWeekDays = (): string[] => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days;
};