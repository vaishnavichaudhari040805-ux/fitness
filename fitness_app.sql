-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: fitness_app
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('30aa2651-c08d-46d7-ac2e-f4ea1b55036f','b2de538f6b24858aca29f7380b882d31442285486d3aeb4d9902de81a2b59f48','2026-03-12 19:31:44.185','20260312193144_add_profile_enums',NULL,NULL,'2026-03-12 19:31:44.101',1),('97824d46-1499-40e4-8b73-765e8d21cafc','f830998c5f5ff9bff0f9816c4618c18f12bf96b3a8c95e2b4c597e5943d8da3a','2026-03-12 19:17:29.278','20260312184323_init',NULL,NULL,'2026-03-12 19:17:28.242',1),('ff80ef03-57d3-4dda-ab19-d82b62352bc7','d8f1da22a8d9c8e55e7d611944ecd48c2c856f9daf5d4d4c830cef05a01ca974','2026-03-12 19:17:32.157','20260312191731_init',NULL,NULL,'2026-03-12 19:17:31.545',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nutritionlog`
--

DROP TABLE IF EXISTS `nutritionlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutritionlog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `foodName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calories` int NOT NULL,
  `proteinG` double NOT NULL,
  `carbsG` double NOT NULL,
  `fatsG` double NOT NULL,
  `loggedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `NutritionLog_userId_fkey` (`userId`),
  CONSTRAINT `NutritionLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutritionlog`
--

LOCK TABLES `nutritionlog` WRITE;
/*!40000 ALTER TABLE `nutritionlog` DISABLE KEYS */;
INSERT INTO `nutritionlog` VALUES ('2ddc7ce9-f816-4c70-b601-fb14c0e0c2b6','5d5847c5-a3a4-4c78-8c58-1116a123f096','Banana',89,1,23,0.3,'2026-03-12 20:25:22.759'),('55ae85b6-2054-46ef-81ab-07885c1ead85','5d5847c5-a3a4-4c78-8c58-1116a123f096','Chicken Breast 100g',165,31,0,3.6,'2026-03-12 20:25:15.292'),('6ece3ef1-7448-4bf7-902a-e2ac0dc6ca50','5d5847c5-a3a4-4c78-8c58-1116a123f096','Brown Rice 100g',216,4,45,1.8,'2026-03-12 20:25:18.209'),('f2d8975d-a8f2-43ca-9ea1-f0f10452147e','5d5847c5-a3a4-4c78-8c58-1116a123f096','Whole Egg',72,6,0.4,5,'2026-03-12 20:25:12.053');
/*!40000 ALTER TABLE `nutritionlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int NOT NULL,
  `weightKg` double NOT NULL,
  `heightCm` double NOT NULL,
  `goal` enum('Weight_Loss','Muscle_Gain','Endurance','Flexibility','General_Fitness') COLLATE utf8mb4_unicode_ci NOT NULL,
  `activityLevel` enum('Sedentary','Lightly_Active','Moderately_Active','Very_Active','Super_Active') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Profile_userId_key` (`userId`),
  CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` VALUES ('2c6fefd9-e3fc-4f7f-a14d-284c1d7db8dd','5d5847c5-a3a4-4c78-8c58-1116a123f096','hello','test',23,80,171,'General_Fitness','Lightly_Active');
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('USER','TRAINER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `xpPoints` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('3ab06d53-c45e-431f-a592-517503f5b471','test@123gmail.com','$2a$12$FwABWmr9v/A2km4JRT2QZ.1uYwQYYqgXDoZMO.K.R.DWA.bApibcG','USER',0,'2026-04-30 19:13:09.575'),('5d5847c5-a3a4-4c78-8c58-1116a123f096','moviesindia369@gmail.com','$2a$12$YDNFbjU/iaekIThOcHPF6OhrEcg1PuZS3UzWlBD05PaW8ti179IYa','USER',100,'2026-03-12 20:12:02.902'),('6bee0c08-1bd6-4ca1-b322-6b1c13cb56d8','moviesindia3695@gmail.com','$2a$12$lzJtO51zFrCs3zpqJN4DTuYLUdD1NrEmYa6T/NndQ8rRQ8pyuwCsW','USER',0,'2026-03-13 04:33:31.986');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workout`
--

DROP TABLE IF EXISTS `workout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isAiGenerated` tinyint(1) NOT NULL DEFAULT '0',
  `scheduledFor` datetime(3) NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `Workout_userId_fkey` (`userId`),
  CONSTRAINT `Workout_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workout`
--

LOCK TABLES `workout` WRITE;
/*!40000 ALTER TABLE `workout` DISABLE KEYS */;
INSERT INTO `workout` VALUES ('8ff55239-74c7-4b31-aa10-7f6072da9f57','5d5847c5-a3a4-4c78-8c58-1116a123f096','test',0,'2026-03-13 04:57:00.000',0);
/*!40000 ALTER TABLE `workout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workoutexercise`
--

DROP TABLE IF EXISTS `workoutexercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workoutexercise` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `workoutId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sets` int NOT NULL,
  `reps` int NOT NULL,
  `weightKg` double DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `WorkoutExercise_workoutId_fkey` (`workoutId`),
  CONSTRAINT `WorkoutExercise_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `workout` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workoutexercise`
--

LOCK TABLES `workoutexercise` WRITE;
/*!40000 ALTER TABLE `workoutexercise` DISABLE KEYS */;
INSERT INTO `workoutexercise` VALUES ('6cf4b76f-fa0e-4a96-8602-54af6792662a','8ff55239-74c7-4b31-aa10-7f6072da9f57','etst',3,12,NULL,0);
/*!40000 ALTER TABLE `workoutexercise` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-01 11:17:24
