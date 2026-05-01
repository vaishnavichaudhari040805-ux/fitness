import { useEffect, useState } from "react";
import {
  Dumbbell,
  Plus,
  Sparkles,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useWorkoutStore, { Workout } from "../store/workoutStore";
import { WorkoutCardSkeleton } from "../components/ui/LoadingSkeleton";
import { formatDate, isToday } from "../utils/helpers";

// ─── Add Workout Modal ─────────────────────────────────────────
const AddWorkoutModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: any) => void;
}) => {
  const [title, setTitle]           = useState("");
  const [scheduledFor, setScheduledFor] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [exercises, setExercises]   = useState([
    { name: "", sets: 3, reps: 12, weightKg: 0 },
  ]);

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: 12, weightKg: 0 }]);
  };

  const updateExercise = (index: number, field: string, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, scheduledFor, exercises });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* ─── Modal Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between p-6 border-b border-[#313244]">
          <h2 className="text-lg font-bold text-white">Create Workout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* ─── Modal Form ────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* ─── Title ─────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Workout Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Upper Body Strength"
              required
              className="w-full bg-[#11111b] border border-[#313244] rounded-xl
                px-4 py-3 text-white placeholder-gray-600 text-sm
                focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          {/* ─── Scheduled Date ────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Scheduled Date
            </label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="[color-scheme:dark] w-full bg-[#11111b] border border-[#313244]
                rounded-xl px-4 py-3 text-white text-sm
                focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          {/* ─── Exercises ─────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                Exercises
              </label>
              <button
                type="button"
                onClick={addExercise}
                className="text-primary-400 text-xs hover:text-primary-300 flex items-center gap-1"
              >
                <Plus size={12} /> Add Exercise
              </button>
            </div>

            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="bg-[#11111b] border border-[#313244] rounded-xl p-3"
                >
                  {/* ─── Exercise Name ────────────────────── */}
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) =>
                      updateExercise(index, "name", e.target.value)
                    }
                    placeholder="Exercise name"
                    required
                    className="w-full bg-transparent text-white text-sm
                      placeholder-gray-600 outline-none mb-2"
                  />
                  {/* ─── Sets / Reps / Weight ─────────────── */}
                  <div className="grid grid-cols-3 gap-2">
                    {(["sets", "reps", "weightKg"] as const).map((field) => (
                      <div key={field}>
                        <label className="text-xs text-gray-500 capitalize">
                          {field === "weightKg" ? "Weight (kg)" : field}
                        </label>
                        <input
                          type="number"
                          value={exercise[field]}
                          onChange={(e) =>
                            updateExercise(
                              index,
                              field,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          min="0"
                          className="w-full bg-[#313244] text-white text-sm
                            rounded-lg px-2 py-1 outline-none mt-1"
                        />
                      </div>
                    ))}
                  </div>
                  {/* ─── Remove Exercise ──────────────────── */}
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="text-red-400 text-xs mt-2 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── Submit Button ──────────────────────────────── */}
          <button
            type="submit"
            className="w-full bg-primary-500 hover:bg-primary-600
              text-white font-semibold py-3 rounded-xl transition-all"
          >
            Create Workout 💪
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Workout Card Component ────────────────────────────────────
const WorkoutCard = ({ workout }: { workout: Workout }) => {
  const { completeWorkout, deleteWorkout } = useWorkoutStore();
  const [expanded, setExpanded]            = useState(false);

  const isCompleted = 
    workout.completed === true ||
    (workout as any).status?.toLowerCase() === "completed";

  return (
    <div
      className={`bg-[#1e1e2e] border rounded-2xl p-5 transition-all duration-300
        ${isCompleted
          ? "border-primary-500/30"
          : "border-[#313244] hover:border-primary-500/20"
        }`}
    >
      {/* ─── Card Header ───────────────────────────────────── */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center
              ${isCompleted ? "bg-primary-500/20" : "bg-[#313244]"}`}
          >
            {isCompleted ? (
              <CheckCircle2 size={20} className="text-primary-400" />
            ) : (
              <Dumbbell size={20} className="text-gray-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-sm">
                {workout.title}
              </h3>
              {(workout as any).isAiGenerated && (
                <span className="text-xs bg-primary-500/10 text-primary-400
                  border border-primary-500/20 px-2 py-0.5 rounded-lg">
                  🤖 AI
                </span>
              )}
              {isToday((workout as any).scheduledFor) && (
                <span className="text-xs bg-blue-500/10 text-blue-400
                  border border-blue-500/20 px-2 py-0.5 rounded-lg">
                  Today
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Calendar size={12} className="text-gray-500" />
              <p className="text-gray-500 text-xs">
                {formatDate((workout as any).scheduledFor)}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Actions ─────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {!isCompleted && (
            <button
              onClick={() => completeWorkout(workout.id)}
              className="text-xs bg-primary-500/10 text-primary-400
                border border-primary-500/20 px-3 py-1.5 rounded-lg
                hover:bg-primary-500/20 transition-all"
            >
              Complete
            </button>
          )}
          <button
            onClick={() => deleteWorkout(workout.id)}
            className="w-8 h-8 flex items-center justify-center
              text-gray-500 hover:text-red-400 hover:bg-red-500/10
              rounded-lg transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* ─── Exercise Count ────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs">
          {workout.exercises?.length || 0} exercises •{" "}
          {workout.exercises?.filter((e: any) => e.completed).length || 0} completed
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-white transition-colors"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* ─── Exercises List (Expandable) ───────────────────── */}
      {expanded && (
        <div className="mt-4 space-y-2 animate-fade-in">
          {workout.exercises?.map((exercise: any) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between
                bg-[#11111b] rounded-xl px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                {exercise.completed ? (
                  <CheckCircle2 size={14} className="text-primary-400" />
                ) : (
                  <Circle size={14} className="text-gray-600" />
                )}
                <span className="text-white text-sm">{exercise.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{exercise.sets} sets</span>
                <span>{exercise.reps} reps</span>
                {exercise.weightKg > 0 && (
                  <span>{exercise.weightKg}kg</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Workouts Page ─────────────────────────────────────────────
const WorkoutsPage = () => {
  const {
    workouts,
    isLoading,
    fetchWorkouts,
    createWorkout,
    generateAiWorkout,
    isGeneratingAi,
  } = useWorkoutStore();

  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter]       = useState<"all" | "completed" | "pending">("all");

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const isCompleted = (w: Workout) =>
    w.completed === true ||
    (w as any).status?.toLowerCase() === "completed";

  const filteredWorkouts = workouts.filter((w) => {
    if (filter === "completed") return isCompleted(w);
    if (filter === "pending")   return !isCompleted(w);
    return true;
  });

  const handleCreateWorkout = async (data: any) => {
    const success = await createWorkout(data);
    if (success) setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Page Header ────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Workouts</h1>
          <p className="text-gray-400 text-sm mt-1">
            {workouts.length} total •{" "}
            {workouts.filter(isCompleted).length} completed
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generateAiWorkout}
            disabled={isGeneratingAi}
            className="flex items-center gap-2 bg-[#1e1e2e] border border-[#313244]
              hover:border-primary-500/50 text-white font-medium px-4 py-2.5
              rounded-xl transition-all duration-200 text-sm disabled:opacity-50"
          >
            {isGeneratingAi ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white
                rounded-full animate-spin" />
            ) : (
              <Sparkles size={16} className="text-primary-400" />
            )}
            <span className="hidden sm:block">AI Plan</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600
              text-white font-semibold px-4 py-2.5 rounded-xl
              transition-all duration-200 text-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:block">Add Workout</span>
          </button>
        </div>
      </div>

      {/* ─── Filter Tabs ────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {(["all", "pending", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all
              ${filter === f
                ? "bg-primary-500 text-white"
                : "bg-[#1e1e2e] border border-[#313244] text-gray-400 hover:text-white"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ─── Workouts List ──────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <WorkoutCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredWorkouts.length > 0 ? (
        <div className="space-y-4">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-6xl mb-4">🏋️</p>
          <h3 className="text-white font-semibold text-lg mb-2">
            No workouts found
          </h3>
          <p className="text-gray-500 text-sm text-center mb-6">
            Create a workout manually or let AI generate a plan for you!
          </p>
          <button
            onClick={generateAiWorkout}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600
              text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <Sparkles size={16} />
            Generate AI Workout Plan
          </button>
        </div>
      )}

      {showModal && (
        <AddWorkoutModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateWorkout}
        />
      )}
    </div>
  );
};

export default WorkoutsPage;