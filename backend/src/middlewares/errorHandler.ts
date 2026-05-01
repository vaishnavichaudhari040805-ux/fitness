import { Request, Response, NextFunction } from "express";
import { sendError, HttpStatus } from "../utils/apiResponse";
import logger from "../utils/logger";

// ─── Custom App Error Class ────────────────────────────────────
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // ─── Capture stack trace ────────────────────────────────
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Handle Prisma Errors ──────────────────────────────────────
const handlePrismaError = (error: any): AppError => {
  switch (error.code) {
    case "P2002":
      return new AppError(
        `Duplicate field value: ${error.meta?.target}. Please use a unique value.`,
        HttpStatus.CONFLICT
      );
    case "P2014":
      return new AppError(
        `Invalid relation: ${error.meta?.relation_name}.`,
        HttpStatus.BAD_REQUEST
      );
    case "P2025":
      return new AppError(
        `Record not found: ${error.meta?.cause}`,
        HttpStatus.NOT_FOUND
      );
    default:
      return new AppError(
        "A database error occurred.",
        HttpStatus.INTERNAL_SERVER
      );
  }
};

// ─── Handle JWT Errors ─────────────────────────────────────────
const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again.", HttpStatus.UNAUTHORIZED);

const handleJWTExpiredError = (): AppError =>
  new AppError("Token expired. Please log in again.", HttpStatus.UNAUTHORIZED);

// ─── Global Error Handler Middleware ───────────────────────────
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER;

  // ─── Log the error ──────────────────────────────────────────
  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl}`);

  // ─── Transform known error types ────────────────────────────
  let error = { ...err, message: err.message };

  if (err.code?.startsWith("P"))       error = handlePrismaError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  // ─── Operational errors: send clean message to client ───────
  if (error.isOperational) {
    sendError(res, error.message, error.statusCode);
    return;
  }

  // ─── Programming errors: don't leak details to client ───────
  logger.error("UNEXPECTED ERROR 💥", err);
  sendError(res, "Something went wrong!", HttpStatus.INTERNAL_SERVER);
};