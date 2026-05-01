import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { config } from "../config/env";
import { AppError } from "./errorHandler";
import { HttpStatus } from "../utils/apiResponse";
import prisma from "../config/database";

// ─── Extend Express Request with User Payload ──────────────────
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

// ─── JWT Payload Shape ─────────────────────────────────────────
interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

// ─── Protect Route: Verify JWT Token ──────────────────────────
export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ─── Extract token from Authorization header ────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "No token provided. Please log in.",
        HttpStatus.UNAUTHORIZED
      );
    }

    const token = authHeader.split(" ")[1];

    // ─── Verify token ───────────────────────────────────────
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // ─── Check if user still exists in DB ───────────────────
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new AppError(
        "User no longer exists.",
        HttpStatus.UNAUTHORIZED
      );
    }

    // ─── Attach user to request object ──────────────────────
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// ─── Restrict Route: Role-Based Access Control (RBAC) ─────────
export const restrictTo = (...roles: Role[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          HttpStatus.FORBIDDEN
        )
      );
    }
    next();
  };
};