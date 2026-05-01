import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import {
  createNutritionLogService,
  getAllNutritionLogsService,
  getDailyNutritionService,
  deleteNutritionLogService,
  getWeeklyNutritionService,
} from "../services/nutritionService";
import { sendSuccess, HttpStatus } from "../utils/apiResponse";
import { AppError } from "../middlewares/errorHandler";

// ─── Validate Nutrition Inputs ─────────────────────────────────
const validateNutritionInputs = (body: any): void => {
  const { foodName, calories, proteinG, carbsG, fatsG } = body;

  if (!foodName || calories === undefined || proteinG === undefined ||
      carbsG === undefined || fatsG === undefined) {
    throw new AppError(
      "All fields are required: foodName, calories, proteinG, carbsG, fatsG.",
      HttpStatus.BAD_REQUEST
    );
  }

  if (calories < 0 || proteinG < 0 || carbsG < 0 || fatsG < 0) {
    throw new AppError(
      "Nutrition values cannot be negative.",
      HttpStatus.BAD_REQUEST
    );
  }
};

// ─── Create Nutrition Log ──────────────────────────────────────
export const createNutritionLog = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validateNutritionInputs(req.body);

    const log = await createNutritionLogService(req.user!.id, req.body);

    sendSuccess(
      res,
      "Nutrition log created successfully.",
      log,
      HttpStatus.CREATED
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get All Nutrition Logs ────────────────────────────────────
export const getAllNutritionLogs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const logs = await getAllNutritionLogsService(req.user!.id);

    sendSuccess(
      res,
      "Nutrition logs fetched successfully.",
      logs,
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get Today's Nutrition Summary ────────────────────────────
export const getDailyNutrition = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const summary = await getDailyNutritionService(req.user!.id);

    sendSuccess(
      res,
      "Daily nutrition summary fetched successfully.",
      summary,
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get Weekly Nutrition Summary ─────────────────────────────
export const getWeeklyNutrition = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const summary = await getWeeklyNutritionService(req.user!.id);

    sendSuccess(
      res,
      "Weekly nutrition summary fetched successfully.",
      summary,
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};

// ─── Delete Nutrition Log ──────────────────────────────────────
export const deleteNutritionLog = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await deleteNutritionLogService(
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