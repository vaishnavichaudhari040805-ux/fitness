import { Server, Socket } from "socket.io";
import logger from "../utils/logger";

// ─── Types ─────────────────────────────────────────────────────
interface LiveWorkoutData {
  userId: string;
  workoutId: string;
  exerciseName: string;
  currentSet: number;
  totalSets: number;
  reps: number;
  heartRate: number;
  timestamp: string;
}

interface JoinRoomData {
  workoutId: string;
  userId: string;
  role: "USER" | "TRAINER";
}

// ─── Initialize Socket.io Handlers ────────────────────────────
export const initializeSocketHandlers = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    logger.info(`🔌 New socket connection: ${socket.id}`);

    // ─── Join a live workout room ───────────────────────────
    socket.on("join_workout_room", (data: JoinRoomData) => {
      const roomId = `workout_${data.workoutId}`;
      socket.join(roomId);

      logger.info(
        `👤 ${data.role} (${data.userId}) joined room: ${roomId}`
      );

      // ─── Notify others in the room ──────────────────────
      socket.to(roomId).emit("user_joined", {
        userId: data.userId,
        role: data.role,
        message: `${data.role} has joined the live workout session.`,
        timestamp: new Date().toISOString(),
      });
    });

    // ─── Broadcast live workout update ──────────────────────
    socket.on("workout_update", (data: LiveWorkoutData) => {
      const roomId = `workout_${data.workoutId}`;

      logger.info(
        `💪 Workout update from ${data.userId} in room ${roomId}`
      );

      // ─── Broadcast to everyone in room except sender ────
      socket.to(roomId).emit("workout_update_received", {
        ...data,
        timestamp: new Date().toISOString(),
      });
    });

    // ─── Broadcast live heart rate ──────────────────────────
    socket.on("heart_rate_update", (data: {
      workoutId: string;
      userId: string;
      heartRate: number;
    }) => {
      const roomId = `workout_${data.workoutId}`;

      // ─── Broadcast heart rate to trainer in room ────────
      socket.to(roomId).emit("heart_rate_received", {
        userId: data.userId,
        heartRate: data.heartRate,
        timestamp: new Date().toISOString(),
      });
    });

    // ─── Complete exercise set ──────────────────────────────
    socket.on("set_completed", (data: {
      workoutId: string;
      userId: string;
      exerciseName: string;
      setNumber: number;
    }) => {
      const roomId = `workout_${data.workoutId}`;

      socket.to(roomId).emit("set_completed_received", {
        ...data,
        message: `✅ Set ${data.setNumber} of ${data.exerciseName} completed!`,
        timestamp: new Date().toISOString(),
      });
    });

    // ─── End live workout session ───────────────────────────
    socket.on("end_workout", (data: {
      workoutId: string;
      userId: string;
    }) => {
      const roomId = `workout_${data.workoutId}`;

      // ─── Notify everyone in room workout ended ──────────
      io.to(roomId).emit("workout_ended", {
        userId: data.userId,
        message: "🏁 Live workout session has ended.",
        timestamp: new Date().toISOString(),
      });

      // ─── Remove all sockets from room ───────────────────
      io.socketsLeave(roomId);
      logger.info(`🏁 Workout room closed: ${roomId}`);
    });

    // ─── Handle disconnection ───────────────────────────────
    socket.on("disconnect", () => {
      logger.info(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};