import { Router } from "express";
import { generateAiWorkout } from "../controllers/aiController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// ─── All AI Routes are Protected ──────────────────────────────
router.use(protect);

// POST /api/v1/ai/generate-workout
// Generates a personalized 4-week AI workout plan
router.post("/generate-workout", generateAiWorkout);

export default router;