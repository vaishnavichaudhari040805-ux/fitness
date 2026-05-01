import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play, Pause, Square, ChevronRight,
  ChevronLeft, CheckCircle, Clock, Zap, Trophy,
} from "lucide-react";
import useWebSocket from "../hooks/useWebSocket";
import { useTimer, useRestTimer } from "../hooks/useTimer";
import LiveHeartRate from "../components/LiveHeartRate";
import useWorkoutStore from "../store/workoutStore";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";

// ─── Types ─────────────────────────────────────────────────────
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds?: number;
  notes?: string;
}

interface SetRecord {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
  completedAt?: string;
}

// ─── Set Row Component ─────────────────────────────────────────
const SetRow = ({
  setNumber,
  record,
  isActive,
  onComplete,
}: {
  setNumber: number;
  record: SetRecord;
  isActive: boolean;
  onComplete: (reps: number, weight: number) => void;
}) => {
  const [reps,   setReps]   = useState(record.reps);
  const [weight, setWeight] = useState(record.weight);

  return (
    <div
      className={`grid grid-cols-4 gap-3 items-center p-3 rounded-xl transition-all
        ${record.completed
          ? "bg-primary-500/10 border border-primary-500/20"
          : isActive
          ? "bg-[#313244] border border-[#44475a]"
          : "bg-[#11111b] border border-[#313244]"
        }`}
    >
      {/* ─── Set Number ─────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {record.completed ? (
          <CheckCircle size={16} className="text-primary-400" />
        ) : (
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${isActive ? "bg-primary-500 text-white" : "bg-[#313244] text-gray-400"}`}
          >
            {setNumber}
          </span>
        )}
      </div>

      {/* ─── Reps Input ─────────────────────────────────────── */}
      <input
        type="number"
        value={reps}
        onChange={(e) => setReps(parseInt(e.target.value) || 0)}
        disabled={record.completed}
        className="bg-[#1e1e2e] border border-[#313244] rounded-lg px-2 py-1.5
          text-white text-sm text-center focus:outline-none focus:border-primary-500
          disabled:opacity-50"
      />

      {/* ─── Weight Input ────────────────────────────────────── */}
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
        disabled={record.completed}
        className="bg-[#1e1e2e] border border-[#313244] rounded-lg px-2 py-1.5
          text-white text-sm text-center focus:outline-none focus:border-primary-500
          disabled:opacity-50"
      />

      {/* ─── Complete Button ─────────────────────────────────── */}
      <button
        disabled={record.completed}
        onClick={() => onComplete(reps, weight)}
        className={`py-1.5 rounded-lg text-xs font-semibold transition-all
          ${record.completed
            ? "bg-primary-500/20 text-primary-400 cursor-not-allowed"
            : isActive
            ? "bg-primary-500 hover:bg-primary-600 text-white"
            : "bg-[#313244] text-gray-400 cursor-not-allowed"
          }`}
      >
        {record.completed ? "✓ Done" : "Log Set"}
      </button>
    </div>
  );
};

// ─── Rest Timer Overlay ────────────────────────────────────────
const RestTimerOverlay = ({
  onSkip,
}: {
  onSkip: () => void;
}) => {
  const { seconds, displayTime, isFinished, start, progressPercent } =
    useRestTimer();

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if (isFinished) onSkip();
  }, [isFinished]);

  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center">
      <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-8 w-80 text-center">
        <p className="text-gray-400 text-sm mb-2">Rest Time</p>
        <p className="text-6xl font-bold text-white mb-4">{displayTime}</p>

        {/* ─── Progress Ring ─────────────────────────────────── */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none"
              stroke="#313244" strokeWidth="8" />
            <circle cx="50" cy="50" r="45" fill="none"
              stroke="#a6e3a1" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercent / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{seconds}s</span>
          </div>
        </div>

        <button
          onClick={onSkip}
          className="w-full bg-[#313244] hover:bg-[#44475a] text-white
            font-semibold py-3 rounded-xl transition-all"
        >
          Skip Rest →
        </button>
      </div>
    </div>
  );
};

// ─── Workout Complete Screen ───────────────────────────────────
const WorkoutCompleteScreen = ({
  duration,
  totalSets,
  onClose,
}: {
  duration: string;
  totalSets: number;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
    <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-8 w-full max-w-sm text-center">
      <div className="text-6xl mb-4">🏆</div>
      <h2 className="text-2xl font-bold text-white mb-2">Workout Complete!</h2>
      <p className="text-gray-400 text-sm mb-6">Amazing work! You crushed it 💪</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#11111b] rounded-xl p-4">
          <Clock size={20} className="text-primary-400 mx-auto mb-2" />
          <p className="text-white font-bold text-lg">{duration}</p>
          <p className="text-gray-500 text-xs">Duration</p>
        </div>
        <div className="bg-[#11111b] rounded-xl p-4">
          <Zap size={20} className="text-yellow-400 mx-auto mb-2" />
          <p className="text-white font-bold text-lg">{totalSets}</p>
          <p className="text-gray-500 text-xs">Sets Done</p>
        </div>
      </div>

      <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 mb-6">
        <Trophy size={20} className="text-yellow-400 mx-auto mb-2" />
        <p className="text-primary-400 font-bold">+50 XP Earned!</p>
        <p className="text-gray-500 text-xs mt-1">Keep it up to level up!</p>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white
          font-semibold py-3 rounded-xl transition-all"
      >
        Back to Workouts
      </button>
    </div>
  </div>
);

// ─── LiveWorkoutPage ───────────────────────────────────────────
const LiveWorkoutPage = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate      = useNavigate();
  const { workouts, completeWorkout } = useWorkoutStore();
  const { user }      = useAuthStore();

  // ─── Find workout ──────────────────────────────────────────
  const workout = workouts.find((w) => w.id === workoutId);
  const exercises: Exercise[] = workout?.exercises || [];

  // ─── State ─────────────────────────────────────────────────
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [activeSetIdx,       setActiveSetIdx]        = useState(0);
  const [showRest,           setShowRest]            = useState(false);
  const [showComplete,       setShowComplete]        = useState(false);
  const [setRecords, setSetRecords] = useState<Record<string, SetRecord[]>>({});

  // ─── Hooks ─────────────────────────────────────────────────
  const timer  = useTimer();
  const socket = useWebSocket();

  const currentExercise = exercises[currentExerciseIdx];

  // ─── Initialize set records ────────────────────────────────
  useEffect(() => {
    if (!exercises.length) return;
    const records: Record<string, SetRecord[]> = {};
    exercises.forEach((ex) => {
      records[ex.id] = Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        reps:      ex.reps,
        weight:    ex.weight || 0,
        completed: false,
      }));
    });
    setSetRecords(records);
  }, [exercises.length]);

  // ─── Join socket room on mount ─────────────────────────────
  useEffect(() => {
    if (workoutId && socket.isConnected) {
      socket.joinRoom(workoutId);
      timer.start();
    }
  }, [workoutId, socket.isConnected]);

  // ─── Complete a set ────────────────────────────────────────
  const handleCompleteSet = useCallback(
    (setIdx: number, reps: number, weight: number) => {
      if (!currentExercise) return;

      setSetRecords((prev) => {
        const updated = { ...prev };
        updated[currentExercise.id] = updated[currentExercise.id].map(
          (s, i) =>
            i === setIdx
              ? { ...s, completed: true, reps, weight, completedAt: new Date().toISOString() }
              : s
        );
        return updated;
      });

      // ─── Emit socket event ────────────────────────────────
      socket.completeSet(currentExercise.name, setIdx + 1);
      socket.sendWorkoutUpdate({
        exerciseName: currentExercise.name,
        currentSet:   setIdx + 1,
        totalSets:    currentExercise.sets,
        reps,
      });

      toast.success(`Set ${setIdx + 1} logged! 💪`);

      // ─── Show rest timer if not last set ──────────────────
      const allSets = setRecords[currentExercise.id] || [];
      const remaining = allSets.filter((s, i) => i > setIdx && !s.completed);
      if (remaining.length > 0) {
        setActiveSetIdx(setIdx + 1);
        setShowRest(true);
      } else {
        // Move to next exercise
        if (currentExerciseIdx < exercises.length - 1) {
          setCurrentExerciseIdx((prev) => prev + 1);
          setActiveSetIdx(0);
          setShowRest(true);
        }
      }
    },
    [currentExercise, currentExerciseIdx, exercises.length, setRecords, socket]
  );

  // ─── End Workout ───────────────────────────────────────────
  const handleEndWorkout = async () => {
    timer.pause();
    socket.endWorkout();
    if (workoutId) await completeWorkout(workoutId);
    setShowComplete(true);
  };

  // ─── Total completed sets ──────────────────────────────────
  const totalCompletedSets = Object.values(setRecords)
    .flat()
    .filter((s) => s.completed).length;

  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);

  // ─── No workout found ──────────────────────────────────────
  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-4xl mb-4">🏋️</p>
        <p className="text-gray-400 mb-6">Workout not found.</p>
        <button
          onClick={() => navigate("/workouts")}
          className="bg-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold"
        >
          Back to Workouts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">

      {/* ─── Top Bar ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/workouts")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Back</span>
        </button>

        {/* ─── Live Timer ────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1e1e2e] border border-[#313244] rounded-xl px-4 py-2">
            <Clock size={16} className="text-primary-400" />
            <span className="text-white font-mono font-bold text-lg">
              {timer.displayTime}
            </span>
          </div>

          <button
            onClick={timer.toggle}
            className="w-10 h-10 bg-[#1e1e2e] border border-[#313244]
              rounded-xl flex items-center justify-center
              text-gray-400 hover:text-white transition-all"
          >
            {timer.isRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>

        {/* ─── End Workout Button ────────────────────────────── */}
        <button
          onClick={handleEndWorkout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20
            border border-red-500/20 text-red-400
            px-4 py-2 rounded-xl transition-all text-sm font-semibold"
        >
          <Square size={14} />
          End Workout
        </button>
      </div>

      {/* ─── Workout Title & Progress ─────────────────────────── */}
      <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-white">{workout.title}</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Exercise {currentExerciseIdx + 1} of {exercises.length}
            </p>
          </div>

          {/* ─── Socket Status ──────────────────────────────── */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                socket.isConnected ? "bg-primary-400 animate-pulse" : "bg-red-400"
              }`}
            />
            <span className="text-xs text-gray-500">
              {socket.isConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>

        {/* ─── Overall Progress Bar ──────────────────────────── */}
        <div className="w-full bg-[#11111b] rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${totalSets ? (totalCompletedSets / totalSets) * 100 : 0}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs mt-1.5 text-right">
          {totalCompletedSets}/{totalSets} sets completed
        </p>
      </div>

      {/* ─── Main Content Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ─── Left: Exercise List ──────────────────────────── */}
        <div className="lg:col-span-1 bg-[#1e1e2e] border border-[#313244] rounded-2xl p-4">
          <p className="text-sm font-semibold text-gray-400 mb-3">Exercises</p>
          <div className="space-y-2">
            {exercises.map((ex, idx) => {
              const exSets      = setRecords[ex.id] || [];
              const completedEx = exSets.filter((s) => s.completed).length;
              const isActive    = idx === currentExerciseIdx;
              const isDone      = completedEx === ex.sets && ex.sets > 0;

              return (
                <button
                  key={ex.id}
                  onClick={() => setCurrentExerciseIdx(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl
                    text-left transition-all
                    ${isActive
                      ? "bg-primary-500/10 border border-primary-500/30"
                      : "bg-[#11111b] border border-[#313244] hover:border-[#44475a]"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <CheckCircle size={16} className="text-primary-400 shrink-0" />
                    ) : (
                      <div
                        className={`w-4 h-4 rounded-full border-2 shrink-0
                          ${isActive ? "border-primary-400" : "border-[#44475a]"}`}
                      />
                    )}
                    <span className={`text-sm font-medium truncate
                      ${isActive ? "text-white" : "text-gray-400"}`}>
                      {ex.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 shrink-0 ml-2">
                    {completedEx}/{ex.sets}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Right: Active Exercise ───────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {currentExercise && (
            <>
              {/* ─── Exercise Header ─────────────────────── */}
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold text-white">
                    {currentExercise.name}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      disabled={currentExerciseIdx === 0}
                      onClick={() => setCurrentExerciseIdx((p) => p - 1)}
                      className="w-8 h-8 bg-[#11111b] border border-[#313244]
                        rounded-lg flex items-center justify-center
                        text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      disabled={currentExerciseIdx === exercises.length - 1}
                      onClick={() => setCurrentExerciseIdx((p) => p + 1)}
                      className="w-8 h-8 bg-[#11111b] border border-[#313244]
                        rounded-lg flex items-center justify-center
                        text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  {currentExercise.sets} sets × {currentExercise.reps} reps
                  {currentExercise.weight ? ` @ ${currentExercise.weight}kg` : ""}
                </p>
                {currentExercise.notes && (
                  <p className="text-gray-500 text-xs mt-2 italic">
                    💡 {currentExercise.notes}
                  </p>
                )}
              </div>

              {/* ─── Sets Table ───────────────────────────── */}
              <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
                {/* ─── Column Headers ───────────────────── */}
                <div className="grid grid-cols-4 gap-3 mb-3 px-3">
                  <p className="text-xs text-gray-500 font-medium">SET</p>
                  <p className="text-xs text-gray-500 font-medium text-center">REPS</p>
                  <p className="text-xs text-gray-500 font-medium text-center">KG</p>
                  <p className="text-xs text-gray-500 font-medium text-center">ACTION</p>
                </div>

                {/* ─── Set Rows ─────────────────────────── */}
                <div className="space-y-2">
                  {(setRecords[currentExercise.id] || []).map((record, idx) => (
                    <SetRow
                      key={idx}
                      setNumber={idx + 1}
                      record={record}
                      isActive={idx === activeSetIdx && !record.completed}
                      onComplete={(reps, weight) =>
                        handleCompleteSet(idx, reps, weight)
                      }
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ─── Heart Rate ───────────────────────────────── */}
          <LiveHeartRate
            heartRate={socket.heartRate}
            onHeartRateChange={socket.sendHeartRate}
            isMocking={true}
          />
        </div>
      </div>

      {/* ─── Rest Timer Overlay ────────────────────────────────── */}
      {showRest && (
        <RestTimerOverlay onSkip={() => setShowRest(false)} />
      )}

      {/* ─── Workout Complete Screen ───────────────────────────── */}
      {showComplete && (
        <WorkoutCompleteScreen
          duration={timer.displayTime}
          totalSets={totalCompletedSets}
          onClose={() => navigate("/workouts")}
        />
      )}
    </div>
  );
};

export default LiveWorkoutPage;