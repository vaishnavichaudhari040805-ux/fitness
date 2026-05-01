import { Router } from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// ─── All Profile Routes are Protected ─────────────────────────
router.use(protect);

// POST /api/v1/profile
router.post("/", createProfile);

// GET /api/v1/profile
router.get("/", getProfile);

// PATCH /api/v1/profile
router.patch("/", updateProfile);

// DELETE /api/v1/profile
router.delete("/", deleteProfile);

export default router;