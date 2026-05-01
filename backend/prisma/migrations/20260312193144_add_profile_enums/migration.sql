/*
  Warnings:

  - You are about to alter the column `goal` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `activityLevel` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `profile` MODIFY `goal` ENUM('Weight_Loss', 'Muscle_Gain', 'Endurance', 'Flexibility', 'General_Fitness') NOT NULL,
    MODIFY `activityLevel` ENUM('Sedentary', 'Lightly_Active', 'Moderately_Active', 'Very_Active', 'Super_Active') NOT NULL;
