import { Router } from "express";
import {
  createWorkout,
  getAllWorkouts,
  getWorkoutById,
  updateWorkout,
  completeWorkout,
  deleteWorkout,
} from "../controllers/workoutController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// ─── All Workout Routes are Protected ─────────────────────────
router.use(protect);

// POST /api/v1/workouts
router.post("/", createWorkout);

// GET /api/v1/workouts
router.get("/", getAllWorkouts);

// GET /api/v1/workouts/:id
router.get("/:id", getWorkoutById);

// PATCH /api/v1/workouts/:id
router.patch("/:id", updateWorkout);

// PATCH /api/v1/workouts/:id/complete
router.patch("/:id/complete", completeWorkout);

// DELETE /api/v1/workouts/:id
router.delete("/:id", deleteWorkout);

export default router;