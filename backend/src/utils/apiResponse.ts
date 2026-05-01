import { Response } from "express";

// ─── Standard API Response Shape ──────────────────────────────
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

// ─── Success Response ──────────────────────────────────────────
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// ─── Error Response ────────────────────────────────────────────
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: unknown
): Response<ApiResponse<null>> => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors || null,
  });
};

// ─── Common HTTP Status Codes ──────────────────────────────────
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER: 500,
} as const;