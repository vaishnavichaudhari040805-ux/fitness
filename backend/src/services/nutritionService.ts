import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import { HttpStatus } from "../utils/apiResponse";

// ─── Types ─────────────────────────────────────────────────────
interface NutritionPayload {
  foodName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
}

interface DailyNutritionSummary {
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatsG: number;
  logs: any[];
}

// ─── Create Nutrition Log Service ──────────────────────────────
export const createNutritionLogService = async (
  userId: string,
  payload: NutritionPayload
) => {
  const log = await prisma.nutritionLog.create({
    data: {
      userId,
      ...payload,
    },
  });

  return log;
};

// ─── Get All Nutrition Logs Service ───────────────────────────
export const getAllNutritionLogsService = async (userId: string) => {
  const logs = await prisma.nutritionLog.findMany({
    where: { userId },
    orderBy: { loggedAt: "desc" },
  });

  return logs;
};

// ─── Get Today's Nutrition Summary Service ─────────────────────
export const getDailyNutritionService = async (
  userId: string
): Promise<DailyNutritionSummary> => {
  // ─── Get start and end of today ─────────────────────────────
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const logs = await prisma.nutritionLog.findMany({
    where: {
      userId,
      loggedAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: { loggedAt: "desc" },
  });

  // ─── Calculate totals ───────────────────────────────────────
  const summary = logs.reduce(
    (acc, log) => {
      acc.totalCalories += log.calories;
      acc.totalProteinG += log.proteinG;
      acc.totalCarbsG += log.carbsG;
      acc.totalFatsG += log.fatsG;
      return acc;
    },
    {
      totalCalories: 0,
      totalProteinG: 0,
      totalCarbsG: 0,
      totalFatsG: 0,
    }
  );

  return {
    ...summary,
    totalProteinG: parseFloat(summary.totalProteinG.toFixed(2)),
    totalCarbsG: parseFloat(summary.totalCarbsG.toFixed(2)),
    totalFatsG: parseFloat(summary.totalFatsG.toFixed(2)),
    logs,
  };
};

// ─── Delete Nutrition Log Service ──────────────────────────────
export const deleteNutritionLogService = async (
  userId: string,
  logId: string
) => {
  // ─── Check log exists and belongs to user ───────────────────
  const existing = await prisma.nutritionLog.findFirst({
    where: { id: logId, userId },
  });

  if (!existing) {
    throw new AppError("Nutrition log not found.", HttpStatus.NOT_FOUND);
  }

  await prisma.nutritionLog.delete({
    where: { id: logId },
  });

  return { message: "Nutrition log deleted successfully." };
};

// ─── Get Weekly Nutrition Summary Service ──────────────────────
export const getWeeklyNutritionService = async (userId: string) => {
  // ─── Get start of current week (Monday) ─────────────────────
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const logs = await prisma.nutritionLog.findMany({
    where: {
      userId,
      loggedAt: { gte: startOfWeek },
    },
    orderBy: { loggedAt: "asc" },
  });

  // ─── Group logs by day ──────────────────────────────────────
  const groupedByDay = logs.reduce((acc: any, log) => {
    const day = log.loggedAt.toISOString().split("T")[0];
    if (!acc[day]) {
      acc[day] = {
        date: day,
        totalCalories: 0,
        totalProteinG: 0,
        totalCarbsG: 0,
        totalFatsG: 0,
      };
    }
    acc[day].totalCalories += log.calories;
    acc[day].totalProteinG += log.proteinG;
    acc[day].totalCarbsG += log.carbsG;
    acc[day].totalFatsG += log.fatsG;
    return acc;
  }, {});

  return Object.values(groupedByDay);
};