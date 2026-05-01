import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────
interface TimerState {
  seconds: number;
  isRunning: boolean;
  isFinished: boolean;
}

// ─── useTimer Hook ─────────────────────────────────────────────
export const useTimer = (initialSeconds: number = 0) => {
  const [state, setState] = useState<TimerState>({
    seconds:    initialSeconds,
    isRunning:  false,
    isFinished: false,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Clear interval on unmount ──────────────────────────────
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ─── Start Timer ────────────────────────────────────────────
  const start = useCallback(() => {
    if (intervalRef.current) return;

    setState((prev) => ({ ...prev, isRunning: true, isFinished: false }));

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        const newSeconds = prev.seconds + 1;
        return { ...prev, seconds: newSeconds };
      });
    }, 1000);
  }, []);

  // ─── Pause Timer ────────────────────────────────────────────
  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  // ─── Reset Timer ────────────────────────────────────────────
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState({
      seconds:    initialSeconds,
      isRunning:  false,
      isFinished: false,
    });
  }, [initialSeconds]);

  // ─── Toggle Timer ────────────────────────────────────────────
  const toggle = useCallback(() => {
    if (state.isRunning) {
      pause();
    } else {
      start();
    }
  }, [state.isRunning, start, pause]);

  // ─── Format Time Display ────────────────────────────────────
  const formatTime = useCallback((secs: number): string => {
    const hrs  = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s    = secs % 60;

    if (hrs > 0) {
      return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  return {
    seconds:     state.seconds,
    isRunning:   state.isRunning,
    isFinished:  state.isFinished,
    displayTime: formatTime(state.seconds),
    start,
    pause,
    reset,
    toggle,
  };
};

// ─── useCountdownTimer Hook ────────────────────────────────────
// Counts DOWN from a given number of seconds
export const useCountdownTimer = (initialSeconds: number) => {
  const [seconds, setSeconds]       = useState(initialSeconds);
  const [isRunning, setIsRunning]   = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current || isFinished) return;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isFinished]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSeconds(initialSeconds);
    setIsRunning(false);
    setIsFinished(false);
  }, [initialSeconds]);

  const formatTime = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const s    = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return {
    seconds,
    isRunning,
    isFinished,
    displayTime: formatTime(seconds),
    start,
    reset,
  };
};

// ─── useRestTimer Hook ─────────────────────────────────────────
// Rest timer between sets — counts down from 60 seconds
export const useRestTimer = () => {
  const REST_DURATION = 60;
  const timer = useCountdownTimer(REST_DURATION);

  return {
    ...timer,
    restDuration: REST_DURATION,
    progressPercent: Math.round(
      ((REST_DURATION - timer.seconds) / REST_DURATION) * 100
    ),
  };
};