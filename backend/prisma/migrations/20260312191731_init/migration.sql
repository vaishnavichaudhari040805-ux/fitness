/*
  Warnings:

  - You are about to drop the `badges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gamification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nutrition_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refresh_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trainer_clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wearable_syncs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workout_exercises` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workouts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `xp_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `badges` DROP FOREIGN KEY `badges_gamificationId_fkey`;

-- DropForeignKey
ALTER TABLE `gamification` DROP FOREIGN KEY `gamification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `nutrition_logs` DROP FOREIGN KEY `nutrition_logs_userId_fkey`;

-- DropForeignKey
ALTER TABLE `profiles` DROP FOREIGN KEY `profiles_userId_fkey`;

-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `refresh_tokens_userId_fkey`;

-- DropForeignKey
ALTER TABLE `trainer_clients` DROP FOREIGN KEY `trainer_clients_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `trainer_clients` DROP FOREIGN KEY `trainer_clients_trainerId_fkey`;

-- DropForeignKey
ALTER TABLE `wearable_syncs` DROP FOREIGN KEY `wearable_syncs_userId_fkey`;

-- DropForeignKey
ALTER TABLE `workout_exercises` DROP FOREIGN KEY `workout_exercises_workoutId_fkey`;

-- DropForeignKey
ALTER TABLE `workouts` DROP FOREIGN KEY `workouts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `xp_events` DROP FOREIGN KEY `xp_events_gamificationId_fkey`;

-- DropTable
DROP TABLE `badges`;

-- DropTable
DROP TABLE `gamification`;

-- DropTable
DROP TABLE `nutrition_logs`;

-- DropTable
DROP TABLE `profiles`;

-- DropTable
DROP TABLE `refresh_tokens`;

-- DropTable
DROP TABLE `trainer_clients`;

-- DropTable
DROP TABLE `users`;

-- DropTable
DROP TABLE `wearable_syncs`;

-- DropTable
DROP TABLE `workout_exercises`;

-- DropTable
DROP TABLE `workouts`;

-- DropTable
DROP TABLE `xp_events`;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'TRAINER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `xpPoints` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `weightKg` DOUBLE NOT NULL,
    `heightCm` DOUBLE NOT NULL,
    `goal` VARCHAR(191) NOT NULL,
    `activityLevel` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Profile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Workout` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `isAiGenerated` BOOLEAN NOT NULL DEFAULT false,
    `scheduledFor` DATETIME(3) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkoutExercise` (
    `id` VARCHAR(191) NOT NULL,
    `workoutId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sets` INTEGER NOT NULL,
    `reps` INTEGER NOT NULL,
    `weightKg` DOUBLE NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NutritionLog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `foodName` VARCHAR(191) NOT NULL,
    `calories` INTEGER NOT NULL,
    `proteinG` DOUBLE NOT NULL,
    `carbsG` DOUBLE NOT NULL,
    `fatsG` DOUBLE NOT NULL,
    `loggedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Workout` ADD CONSTRAINT `Workout_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutExercise` ADD CONSTRAINT `WorkoutExercise_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `Workout`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NutritionLog` ADD CONSTRAINT `NutritionLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
