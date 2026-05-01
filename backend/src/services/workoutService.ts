import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import { HttpStatus } from "../utils/apiResponse";

// ─── Types ─────────────────────────────────────────────────────
interface ExercisePayload {
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
}

interface WorkoutPayload {
  title: string;
  scheduledFor: string;
  exercises: ExercisePayload[];
  isAiGenerated?: boolean;
}

// ─── Create Workout Service ────────────────────────────────────
export const createWorkoutService = async (
  userId: string,
  payload: WorkoutPayload
) => {
  const { title, scheduledFor, exercises, isAiGenerated } = payload;

  const workout = await prisma.workout.create({
    data: {
      userId,
      title,
      scheduledFor: new Date(scheduledFor),
      isAiGenerated: isAiGenerated || false,
      exercises: {
        create: exercises.map((exercise) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weightKg: exercise.weightKg || null,
        })),
      },
    },
    include: {
      exercises: true,
    },
  });

  return workout;
};

// ─── Get All Workouts Service ──────────────────────────────────
export const getAllWorkoutsService = async (userId: string) => {
  const workouts = await prisma.workout.findMany({
    where: { userId },
    include: { exercises: true },
    orderBy: { scheduledFor: "desc" },
  });

  return workouts;
};

// ─── Get Single Workout Service ────────────────────────────────
export const getWorkoutByIdService = async (
  userId: string,
  workoutId: string
) => {
  const workout = await prisma.workout.findFirst({
    where: {
      id: workoutId,
      userId,
    },
    include: { exercises: true },
  });

  if (!workout) {
    throw new AppError("Workout not found.", HttpStatus.NOT_FOUND);
  }

  return workout;
};

// ─── Update Workout Service ────────────────────────────────────
export const updateWorkoutService = async (
  userId: string,
  workoutId: string,
  payload: Partial<WorkoutPayload>
) => {
  // ─── Check workout exists and belongs to user ───────────────
  const existing = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
  });

  if (!existing) {
    throw new AppError("Workout not found.", HttpStatus.NOT_FOUND);
  }

  const updated = await prisma.workout.update({
    where: { id: workoutId },
    data: {
      title: payload.title,
      scheduledFor: payload.scheduledFor
        ? new Date(payload.scheduledFor)
        : undefined,
    },
    include: { exercises: true },
  });

  return updated;
};

// ─── Complete Workout Service ──────────────────────────────────
export const completeWorkoutService = async (
  userId: string,
  workoutId: string
) => {
  const existing = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
  });

  if (!existing) {
    throw new AppError("Workout not found.", HttpStatus.NOT_FOUND);
  }

  // ─── Mark workout and all exercises as completed ────────────
  const completed = await prisma.workout.update({
    where: { id: workoutId },
    data: {
      completed: true,
      exercises: {
        updateMany: {
          where: { workoutId },
          data: { completed: true },
        },
      },
    },
    include: { exercises: true },
  });

  // ─── Award XP points to user (gamification) ─────────────────
  await prisma.user.update({
    where: { id: userId },
    data: { xpPoints: { increment: 50 } },
  });

  return completed;
};

// ─── Delete Workout Service ────────────────────────────────────
export const deleteWorkoutService = async (
  userId: string,
  workoutId: string
) => {
  const existing = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
  });

  if (!existing) {
    throw new AppError("Workout not found.", HttpStatus.NOT_FOUND);
  }

  await prisma.workout.delete({
    where: { id: workoutId },
  });

  return { message: "Workout deleted successfully." };
};