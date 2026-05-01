import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import {
  createProfileService,
  getProfileService,
  updateProfileService,
  deleteProfileService,
} from "../services/profileService";
import { sendSuccess, HttpStatus } from "../utils/apiResponse";
import { AppError } from "../middlewares/errorHandler";

// ─── Validate Profile Inputs ───────────────────────────────────
const validateProfileInputs = (body: any): void => {
  const { firstName, lastName, age, weightKg, heightCm, goal, activityLevel } =
    body;

  if (
    !firstName ||
    !lastName ||
    !age ||
    !weightKg ||
    !heightCm ||
    !goal ||
    !activityLevel
  ) {
    throw new AppError(
      "All fields are required: firstName, lastName, age, weightKg, heightCm, goal, activityLevel.",
      HttpStatus.BAD_REQUEST
    );
  }

  if (age < 10 || age > 120) {
    throw new AppError(
      "Age must be between 10 and 120.",
      HttpStatus.BAD_REQUEST
    );
  }

  if (weightKg < 20 || weightKg > 500) {
    throw new AppError(
      "Weight must be between 20kg and 500kg.",
      HttpStatus.BAD_REQUEST
    );
  }

  if (heightCm < 50 || heightCm > 300) {
    throw new AppError(
      "Height must be between 50cm and 300cm.",
      HttpStatus.BAD_REQUEST
    );
  }
};

// ─── Create Profile ────────────────────────────────────────────
export const createProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    validateProfileInputs(req.body);

    const profile = await createProfileService(req.user!.id, req.body);

    sendSuccess(
      res,
      "Profile created successfully.",
      profile,
      HttpStatus.CREATED
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get Profile ───────────────────────────────────────────────
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await getProfileService(req.user!.id);

    sendSuccess(
      res,
      "Profile fetched successfully.",
      profile,
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};

// ─── Update Profile ────────────────────────────────────────────
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await updateProfileService(req.user!.id, req.body);

    sendSuccess(
      res,
      "Profile updated successfully.",
      profile,
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};

// ─── Delete Profile ────────────────────────────────────────────
export const deleteProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await deleteProfileService(req.user!.id);

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