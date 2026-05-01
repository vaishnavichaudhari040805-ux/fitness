import express, { Application, Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config/env";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { sendSuccess, HttpStatus } from "./utils/apiResponse";
import logger from "./utils/logger";
import prisma from "./config/database";

// ─── Route Imports ─────────────────────────────────────────────
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import workoutRoutes from "./routes/workoutRoutes";
import nutritionRoutes from "./routes/nutritionRoutes";
import aiRoutes from "./routes/aiRoutes";

// ─── Socket Handlers ───────────────────────────────────────────
import { initializeSocketHandlers } from "./sockets/workoutSocket";

// ─── Initialize Express App ────────────────────────────────────
const app: Application = express();
const httpServer = createServer(app);

// ─── Initialize Socket.io ──────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: config.cors.clientUrl,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ─── Global Middlewares ────────────────────────────────────────
app.use(
  cors({
    origin: config.cors.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── API Health Check ──────────────────────────────────────────
app.get("/api/health", (req: Request, res: Response) => {
  sendSuccess(
    res,
    "Fitness App API is running 🚀",
    {
      status: "healthy",
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
      features: [
        "Authentication",
        "Profiles",
        "Workouts",
        "Nutrition",
        "AI Workout Generator",
        "Real-time Sockets",
      ],
    },
    HttpStatus.OK
  );
});

// ─── API v1 Routes ─────────────────────────────────────────────
app.use("/api/v1/auth",      authRoutes);
app.use("/api/v1/profile",   profileRoutes);
app.use("/api/v1/workouts",  workoutRoutes);
app.use("/api/v1/nutrition", nutritionRoutes);
app.use("/api/v1/ai",        aiRoutes);

// ─── Initialize Socket.io Handlers ────────────────────────────
initializeSocketHandlers(io);

// ─── 404 Handler ───────────────────────────────────────────────
app.all("*", (req: Request, res: Response) => {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found on this server.`,
  });
});

// ─── Global Error Handler ──────────────────────────────────────
app.use(globalErrorHandler);

// ─── Start Server ──────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  try {
    // ─── Test DB connection ───────────────────────────────────
    await prisma.$connect();
    logger.info("✅ Database connected successfully.");

    httpServer.listen(config.port, () => {
      logger.info(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
      logger.info(`📡 Health check: http://localhost:${config.port}/api/health`);
      logger.info(`🔌 Socket.io ready for real-time connections.`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ─────────────────────────────────────────
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("unhandledRejection", (reason: Error) => {
  logger.error("UNHANDLED REJECTION 💥:", reason);
  process.exit(1);
});

startServer();

export default app;