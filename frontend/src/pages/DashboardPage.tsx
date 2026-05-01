import { useEffect } from "react";
import {
  Dumbbell,
  Flame,
  Trophy,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import useWorkoutStore from "../store/workoutStore";
import useNutritionStore from "../store/nutritionStore";
import StatCard from "../components/ui/StatCard";
import MacroChart from "../components/charts/MacroChart";
import WeeklyChart from "../components/charts/WeeklyChart";
import ProgressBar from "../components/ui/ProgressBar";
import { PageSkeleton } from "../components/ui/LoadingSkeleton";
import { getUserLevel, getGreeting, formatDate, isToday } from "../utils/helpers";
import { DAILY_TARGETS } from "../utils/constants";

// ─── Dashboard Page Component ──────────────────────────────────
const DashboardPage = () => {
  const { user } = useAuth();
  const {
    workouts,
    isLoading: workoutsLoading,
    fetchWorkouts,
    generateAiWorkout,
    isGeneratingAi,
  } = useWorkoutStore();

  const {
    dailySummary,
    weeklyData,
    isLoading: nutritionLoading,
    fetchDailySummary,
    fetchWeeklyData,
  } = useNutritionStore();

  // ─── Fetch data on mount ────────────────────────────────────
  useEffect(() => {
    fetchWorkouts();
    fetchDailySummary();
    fetchWeeklyData();
  }, []);

  // ─── Derived Stats ──────────────────────────────────────────
  const completedWorkouts = workouts.filter((w) => w.completed).length;
  const todayWorkouts     = workouts.filter((w) => isToday(w.scheduledFor));
  const pendingWorkouts   = workouts.filter((w) => !w.completed).length;
  const level             = getUserLevel(user?.xpPoints || 0);
  const isLoading         = workoutsLoading || nutritionLoading;

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Page Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {getGreeting()}, {user?.email?.split("@")[0]} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {formatDate(new Date())} • Level {level.level} {level.title}
          </p>
        </div>

        {/* ─── Generate AI Workout Button ──────────────────────── */}
        <button
          onClick={generateAiWorkout}
          disabled={isGeneratingAi}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-semibold px-4 py-2.5 rounded-xl
            transition-all duration-200 text-sm shadow-glow"
        >
          {isGeneratingAi ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span className="hidden sm:block">AI Workout</span>
            </>
          )}
        </button>
      </div>

      {/* ─── Stat Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workouts"
          value={workouts.length}
          subtitle="All time"
          icon={Dumbbell}
          iconColor="text-primary-400"
          iconBg="bg-primary-500/10"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Completed"
          value={completedWorkouts}
          subtitle={`${pendingWorkouts} pending`}
          icon={CheckCircle2}
          iconColor="text-green-400"
          iconBg="bg-green-500/10"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Calories Today"
          value={dailySummary?.totalCalories || 0}
          subtitle={`Target: ${DAILY_TARGETS.CALORIES} kcal`}
          icon={Flame}
          iconColor="text-orange-400"
          iconBg="bg-orange-500/10"
        />
        <StatCard
          title="XP Points"
          value={`${user?.xpPoints || 0} XP`}
          subtitle={`Level ${level.level} • ${level.title}`}
          icon={Trophy}
          iconColor="text-yellow-400"
          iconBg="bg-yellow-500/10"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* ─── Charts Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MacroChart dailySummary={dailySummary} />
        <WeeklyChart weeklyData={weeklyData} />
      </div>

      {/* ─── XP Progress & Today's Workouts ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── XP Level Progress ──────────────────────────────── */}
        <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary-400" />
            <h3 className="text-base font-semibold text-white">
              Level Progress
            </h3>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-3xl font-bold text-white">
                Level {level.level}
              </p>
              <p className="text-primary-400 font-medium text-sm">
                {level.title}
              </p>
            </div>
            {level.nextLevel && (
              <div className="text-right">
                <p className="text-gray-400 text-sm">Next Level</p>
                <p className="text-white font-semibold">
                  {level.nextLevel.title}
                </p>
                <p className="text-gray-500 text-xs">
                  {level.xpToNext} XP needed
                </p>
              </div>
            )}
          </div>

          <ProgressBar
            value={user?.xpPoints || 0}
            max={level.nextLevel?.minXp || (user?.xpPoints || 1)}
            label="XP Progress"
            size="lg"
            color="bg-primary-500"
          />

          {/* ─── XP Tips ──────────────────────────────────────── */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { action: "Complete Workout", xp: "+50 XP" },
              { action: "Log Nutrition",    xp: "+10 XP" },
            ].map((tip) => (
              <div
                key={tip.action}
                className="bg-[#11111b] rounded-xl p-3 flex items-center justify-between"
              >
                <span className="text-gray-400 text-xs">{tip.action}</span>
                <span className="text-primary-400 text-xs font-bold">
                  {tip.xp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Today's Workouts ─────────────────────────────────── */}
        <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-primary-400" />
            <h3 className="text-base font-semibold text-white">
              Today's Workouts
            </h3>
          </div>

          {todayWorkouts.length > 0 ? (
            <div className="space-y-3">
              {todayWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between bg-[#11111b] rounded-xl p-3"
                >
                  <div className="flex items-center gap-3">
                    {/* ─── Status Icon ────────────────────────── */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        workout.completed
                          ? "bg-primary-500/20"
                          : "bg-[#313244]"
                      }`}
                    >
                      {workout.completed ? (
                        <CheckCircle2
                          size={16}
                          className="text-primary-400"
                        />
                      ) : (
                        <Dumbbell size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {workout.title}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {workout.exercises.length} exercises
                      </p>
                    </div>
                  </div>
                  {/* ─── AI Badge ─────────────────────────────── */}
                  {workout.isAiGenerated && (
                    <span className="text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-0.5 rounded-lg">
                      AI
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // ─── Empty State ───────────────────────────────────
            <div className="flex flex-col items-center justify-center h-36">
              <p className="text-4xl mb-3">🏋️</p>
              <p className="text-gray-500 text-sm text-center">
                No workouts scheduled today.
                <br />
                Generate an AI plan to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;