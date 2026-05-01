import { Request, Response, NextFunction } from "express";
import { registerService, loginService } from "../services/authService";
import { sendSuccess, HttpStatus } from "../utils/apiResponse";
import { AppError } from "../middlewares/errorHandler";

// ─── Input Validation Helper ───────────────────────────────────
const validateEmailPassword = (
  email: string,
  password: string
): void => {
  if (!email || !password) {
    throw new AppError(
      "Email and password are required.",
      HttpStatus.BAD_REQUEST
    );
  }

  // ─── Basic email format check ───────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError(
      "Please provide a valid email address.",
      HttpStatus.BAD_REQUEST
    );
  }

  // ─── Password strength check ────────────────────────────────
  if (password.length < 8) {
    throw new AppError(
      "Password must be at least 8 characters long.",
      HttpStatus.BAD_REQUEST
    );
  }
};

// ─── Register Controller ───────────────────────────────────────
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    // ─── Validate inputs ────────────────────────────────────
    validateEmailPassword(email, password);

    // ─── Call service layer ─────────────────────────────────
    const result = await registerService({ email, password, role });

    sendSuccess(
      res,
      "Account created successfully. Welcome!",
      result,
      HttpStatus.CREATED
    );
  } catch (error) {
    next(error);
  }
};

// ─── Login Controller ──────────────────────────────────────────
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // ─── Validate inputs ────────────────────────────────────
    validateEmailPassword(email, password);

    // ─── Call service layer ─────────────────────────────────
    const result = await loginService({ email, password });

    sendSuccess(
      res,
      "Logged in successfully.",
      result,
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get Current User Controller ───────────────────────────────
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ─── User is already attached by protect middleware ─────
    const user = (req as any).user;

    sendSuccess(
      res,
      "User profile fetched successfully.",
      { user },
      HttpStatus.OK
    );
  } catch (error) {
    next(error);
  }
};