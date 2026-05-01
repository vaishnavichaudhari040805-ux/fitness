import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// ─── Public Routes ─────────────────────────────────────────────
// POST /api/v1/auth/register
router.post("/register", register);

// POST /api/v1/auth/login
router.post("/login", login);

// ─── Protected Routes ──────────────────────────────────────────
// GET /api/v1/auth/me
router.get("/me", protect, getMe);

export default router;