import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import prisma from "../config/database";
import { config } from "../config/env";
import { AppError } from "../middlewares/errorHandler";
import { HttpStatus } from "../utils/apiResponse";

// ─── Types ─────────────────────────────────────────────────────
interface RegisterPayload {
  email: string;
  password: string;
  role?: Role;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    role: Role;
    xpPoints: number;
    createdAt: Date;
  };
}

// ─── Generate JWT Token ────────────────────────────────────────
const generateToken = (id: string, email: string, role: Role): string => {
  return jwt.sign(
    { id, email, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
  );
};

// ─── Register Service ──────────────────────────────────────────
export const registerService = async (
  payload: RegisterPayload
): Promise<AuthResult> => {
  const { email, password, role } = payload;

  // ─── Check if email already exists ─────────────────────────
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError(
      "Email already registered. Please log in.",
      HttpStatus.CONFLICT
    );
  }

  // ─── Hash password ──────────────────────────────────────────
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // ─── Create user in DB ──────────────────────────────────────
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: role || Role.USER,
    },
    select: {
      id: true,
      email: true,
      role: true,
      xpPoints: true,
      createdAt: true,
    },
  });

  // ─── Generate token ─────────────────────────────────────────
  const token = generateToken(user.id, user.email, user.role);

  return { token, user };
};

// ─── Login Service ─────────────────────────────────────────────
export const loginService = async (
  payload: LoginPayload
): Promise<AuthResult> => {
  const { email, password } = payload;

  // ─── Find user by email ─────────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      role: true,
      xpPoints: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid email or password.",
      HttpStatus.UNAUTHORIZED
    );
  }

  // ─── Compare password ───────────────────────────────────────
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password.",
      HttpStatus.UNAUTHORIZED
    );
  }

  // ─── Generate token ─────────────────────────────────────────
  const token = generateToken(user.id, user.email, user.role);

  // ─── Return without passwordHash ────────────────────────────
  const { passwordHash: _, ...safeUser } = user;

  return { token, user: safeUser };
};