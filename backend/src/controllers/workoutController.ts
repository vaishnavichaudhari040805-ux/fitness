import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import {
  createWorkoutService,
  getAllWorkoutsService,
  getWorkoutByIdService,
  updateWorkoutService,
  completeWorkoutService,
  deleteWorkoutService,
} from "../services/workoutService";
import { sendSuccess, HttpStatus } from "../utils/apiResponse";
import { AppError } from "../middlewares/errorHandler";

// ─── Validate Workout Inputs ───────────────────────────────────
const validateWorkoutInputs = (body: any): void => {
  const { title, scheduledFor, exercises } = body;

  if (!title || !scheduledFor || !exercises) {
    throw new AppError(
      "title, scheduledFor and exercises are required.",
      HttpStatus.BAD_REQUEST
    );
  }

  if (!Array.isArray(exercises) || exercises.length === 0) {
    throw new AppError(
      "exercises must be a non-empty array.",
      HttpStatus.BAD_REQUEST
    );
  }

  // ─── Validate each exercise ─────────────────────────────────
  for (const exercise of exercises) {
    if (!exercise.name || !exercise.sets || !exercise.reps) {
      throw new AppError(
        "Each exercise must have name, sets, and reps.",
        HttpStatus.BAD_REQUEST
      );
    }
  }
};

// ─── Create Workout ────────────────────────────────────────────
export const createWorkout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validateWorkoutInputs(req.body);

    const workout = await createWorkoutService(req.user!.id, req.body);

    sendSuccess(
      res,
      "Workout created successfully.",
      workout,
      HttpStatus.CREATED
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get All Workouts ──────────────────────────────────────────
export const getAllWorkouts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workouts = await getAllWorkoutsService(req.user!.id);

    sendSuccess(
      res,
      "Workouts fetched successfully.",
      workouts,
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get Single Workout ────────────────────────────────────────
export const getWorkoutById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workout = await getWorkoutByIdService(
      req.user!.id,
      req.params.id
    );

    sendSuccess(
      res,
      "Workout fetched successfully.",
      workout,
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};

// ─── Update Workout ────────────────────────────────────────────
export const updateWorkout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workout = await updateWorkoutService(
      req.user!.id,
      req.params.id,
      req.body
    );

    sendSuccess(
      res,
      "Workout updated successfully.",
      workout,
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};

// ─── Complete Workout ──────────────────────────────────────────
export const completeWorkout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const workout = await completeWorkoutService(
      req.user!.id,
      req.params.id
    );

    sendSuccess(
      res,
      "Workout completed! +50 XP awarded 🎉",
      workout,
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};

// ─── Delete Workout ────────────────────────────────────────────
export const deleteWorkout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await deleteWorkoutService(
      req.user!.id,
      req.params.id
    );

    sendSuccess(
      res,
      result.message,
      null,
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};