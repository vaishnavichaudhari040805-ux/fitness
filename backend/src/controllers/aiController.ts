import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { generateAiWorkoutService } from "../services/aiService";
import { sendSuccess, HttpStatus } from "../utils/apiResponse";

// ─── Generate AI Workout Plan Controller ───────────────────────
export const generateAiWorkout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ─── Notify client this may take a few seconds ──────────
    res.setHeader("X-Processing", "AI generating your workout plan...");

    const aiPlan = await generateAiWorkoutService(req.user!.id);

    sendSuccess(
      res,
      "🤖 AI Workout Plan generated and saved successfully!",
      aiPlan,
      HttpStatus.CREATED
    );
  } catch (error) {
    next(error);
  }
};