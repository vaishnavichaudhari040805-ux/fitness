import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";
import useAuthStore from "../store/authStore";

// ─── Types ─────────────────────────────────────────────────────
interface WorkoutUpdate {
  userId: string;
  workoutId: string;
  exerciseName: string;
  currentSet: number;
  totalSets: number;
  reps: number;
  heartRate: number;
  timestamp: string;
}

interface SocketState {
  isConnected: boolean;
  isInRoom: boolean;
  roomId: string | null;
  lastUpdate: WorkoutUpdate | null;
  heartRate: number;
  participants: string[];
}

// ─── useWebSocket Hook ─────────────────────────────────────────
const useWebSocket = () => {
  const { user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  const [state, setState] = useState<SocketState>({
    isConnected:  false,
    isInRoom:     false,
    roomId:       null,
    lastUpdate:   null,
    heartRate:    0,
    participants: [],
  });

  // ─── Initialize Socket Connection ──────────────────────────
  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, {
      transports:       ["websocket"],
      autoConnect:      true,
      reconnection:     true,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // ─── Connection Events ────────────────────────────────────
    socket.on("connect", () => {
      setState((prev) => ({ ...prev, isConnected: true }));
    });

    socket.on("disconnect", () => {
      setState((prev) => ({
        ...prev,
        isConnected: false,
        isInRoom:    false,
        roomId:      null,
      }));
    });

    // ─── Room Events ──────────────────────────────────────────
    socket.on("user_joined", (data: any) => {
      setState((prev) => ({
        ...prev,
        participants: [...prev.participants, data.userId],
      }));
    });

    // ─── Workout Update Events ────────────────────────────────
    socket.on("workout_update_received", (data: WorkoutUpdate) => {
      setState((prev) => ({ ...prev, lastUpdate: data }));
    });

    // ─── Heart Rate Events ────────────────────────────────────
    socket.on("heart_rate_received", (data: { heartRate: number }) => {
      setState((prev) => ({ ...prev, heartRate: data.heartRate }));
    });

    // ─── Set Completed Events ─────────────────────────────────
    socket.on("set_completed_received", (data: any) => {
      setState((prev) => ({ ...prev, lastUpdate: data }));
    });

    // ─── Workout Ended ────────────────────────────────────────
    socket.on("workout_ended", () => {
      setState((prev) => ({
        ...prev,
        isInRoom:     false,
        roomId:       null,
        participants: [],
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // ─── Join Workout Room ──────────────────────────────────────
  const joinRoom = useCallback(
    (workoutId: string) => {
      if (!socketRef.current || !user) return;

      socketRef.current.emit("join_workout_room", {
        workoutId,
        userId: user.id,
        role:   user.role,
      });

      setState((prev) => ({
        ...prev,
        isInRoom: true,
        roomId:   workoutId,
      }));
    },
    [user]
  );

  // ─── Send Workout Update ────────────────────────────────────
  const sendWorkoutUpdate = useCallback(
    (data: Partial<WorkoutUpdate>) => {
      if (!socketRef.current || !user || !state.roomId) return;

      socketRef.current.emit("workout_update", {
        ...data,
        userId:    user.id,
        workoutId: state.roomId,
        timestamp: new Date().toISOString(),
      });
    },
    [user, state.roomId]
  );

  // ─── Send Heart Rate ────────────────────────────────────────
  const sendHeartRate = useCallback(
    (heartRate: number) => {
      if (!socketRef.current || !user || !state.roomId) return;

      socketRef.current.emit("heart_rate_update", {
        workoutId: state.roomId,
        userId:    user.id,
        heartRate,
      });

      setState((prev) => ({ ...prev, heartRate }));
    },
    [user, state.roomId]
  );

  // ─── Complete Set ───────────────────────────────────────────
  const completeSet = useCallback(
    (exerciseName: string, setNumber: number) => {
      if (!socketRef.current || !user || !state.roomId) return;

      socketRef.current.emit("set_completed", {
        workoutId:    state.roomId,
        userId:       user.id,
        exerciseName,
        setNumber,
      });
    },
    [user, state.roomId]
  );

  // ─── End Workout ────────────────────────────────────────────
  const endWorkout = useCallback(() => {
    if (!socketRef.current || !user || !state.roomId) return;

    socketRef.current.emit("end_workout", {
      workoutId: state.roomId,
      userId:    user.id,
    });

    setState((prev) => ({
      ...prev,
      isInRoom:     false,
      roomId:       null,
      participants: [],
    }));
  }, [user, state.roomId]);

  return {
    ...state,
    joinRoom,
    sendWorkoutUpdate,
    sendHeartRate,
    completeSet,
    endWorkout,
  };
};

export default useWebSocket;