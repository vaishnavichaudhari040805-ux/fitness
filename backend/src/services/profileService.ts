import prisma from "../config/database";
import { AppError } from "../middlewares/errorHandler";
import { HttpStatus } from "../utils/apiResponse";
import { GoalType, ActivityLevel } from "@prisma/client";

interface ProfilePayload {
  firstName: string;
  lastName: string;
  age: number;
  weightKg: number;
  heightCm: number;
  goal: GoalType;
  activityLevel: ActivityLevel;
}

// ─── Types ─────────────────────────────────────────────────────
// interface ProfilePayload {
//   firstName: string;
//   lastName: string;
//   age: number;
//   weightKg: number;
//   heightCm: number;
//   goal: string;
//   activityLevel: string;
// }

// ─── Calculate BMI Helper ──────────────────────────────────────
const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
};

// ─── Create Profile Service ────────────────────────────────────
export const createProfileService = async (
  userId: string,
  payload: ProfilePayload
) => {
  // ─── Check if profile already exists ───────────────────────
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    throw new AppError(
      "Profile already exists. Use update instead.",
      HttpStatus.CONFLICT
    );
  }

  const profile = await prisma.profile.create({
    data: {
      userId,
      ...payload,
    },
  });

  const bmi = calculateBMI(profile.weightKg, profile.heightCm);

  return { ...profile, bmi };
};

// ─── Get Profile Service ───────────────────────────────────────
export const getProfileService = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          email: true,
          role: true,
          xpPoints: true,
          createdAt: true,
        },
      },
    },
  });

  if (!profile) {
    throw new AppError(
      "Profile not found. Please create one.",
      HttpStatus.NOT_FOUND
    );
  }

  const bmi = calculateBMI(profile.weightKg, profile.heightCm);

  return { ...profile, bmi };
};

// ─── Update Profile Service ────────────────────────────────────
export const updateProfileService = async (
  userId: string,
  payload: Partial<ProfilePayload>
) => {
  // ─── Check profile exists ───────────────────────────────────
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new AppError(
      "Profile not found. Please create one first.",
      HttpStatus.NOT_FOUND
    );
  }

  const updated = await prisma.profile.update({
    where: { userId },
    data: { ...payload },
  });

  const bmi = calculateBMI(updated.weightKg, updated.heightCm);

  return { ...updated, bmi };
};

// ─── Delete Profile Service ────────────────────────────────────
export const deleteProfileService = async (userId: string) => {
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new AppError("Profile not found.", HttpStatus.NOT_FOUND);
  }

  await prisma.profile.delete({
    where: { userId },
  });

  return { message: "Profile deleted successfully." };
};