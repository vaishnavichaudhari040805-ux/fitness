import { Router } from "express";
import {
  createNutritionLog,
  getAllNutritionLogs,
  getDailyNutrition,
  getWeeklyNutrition,
  deleteNutritionLog,
} from "../controllers/nutritionController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// ─── All Nutrition Routes are Protected ───────────────────────
router.use(protect);

// POST /api/v1/nutrition
router.post("/", createNutritionLog);

// GET /api/v1/nutrition
router.get("/", getAllNutritionLogs);

// GET /api/v1/nutrition/daily
router.get("/daily", getDailyNutrition);

// GET /api/v1/nutrition/weekly
router.get("/weekly", getWeeklyNutrition);

// DELETE /api/v1/nutrition/:id
router.delete("/:id", deleteNutritionLog);

export default router;