import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Dumbbell, Apple,
  User, Zap, LogOut, Radio,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useWorkoutStore from "../store/workoutStore";
import { getUserLevel } from "../utils/helpers";
import { LEVELS } from "../utils/constants";

// ─── Nav Items ──────────────────────────────────────────────────
const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/workouts",  label: "Workouts",  icon: Dumbbell        },
  { path: "/nutrition", label: "Nutrition", icon: Apple           },
  { path: "/profile",   label: "Profile",   icon: User            },
];

// ─── Sidebar ────────────────────────────────────────────────────
const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  // ─── ALL hooks must be inside here ────────────────────────────
  const { user, logout }            = useAuthStore();
  const { workouts, fetchWorkouts } = useWorkoutStore();
  const navigate                    = useNavigate();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // ─── XP & Level ───────────────────────────────────────────────
  const xp           = (user as any)?.xp || 0;
  const currentLevel = getUserLevel(xp);
  const nextLevel    = LEVELS.find((l) => l.minXp > xp);
  const xpProgress   = nextLevel
    ? Math.round(((xp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100)
    : 100;

  // ─── Find first pending workout for Live mode ──────────────────
  const pendingWorkout = workouts.find(
    (w) => (w.status as string)?.toLowerCase() === "pending"
  );

  const handleLiveWorkout = () => {
    if (!pendingWorkout) return;
    navigate(`/workout/live/${pendingWorkout.id}`);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-full flex flex-col bg-[#181825] border-r border-[#313244]">

      {/* ─── Logo ──────────────────────────────────────────────── */}
      <div className="p-6 border-b border-[#313244]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">FitPro</p>
            <p className="text-gray-500 text-xs mt-0.5">AI Fitness Tracker</p>
          </div>
        </div>
      </div>

      {/* ─── Nav Links ─────────────────────────────────────────── */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
               transition-all duration-200
               ${isActive
                 ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                 : "text-gray-400 hover:text-white hover:bg-[#1e1e2e]"
               }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? "text-primary-400" : ""} />
                {label}
              </>
            )}
          </NavLink>
        ))}

        {/* ─── Live Workout Button ─────────────────────────────── */}
        <div className="pt-2">
          <button
            onClick={handleLiveWorkout}
            disabled={!pendingWorkout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-sm font-medium transition-all duration-200
              ${pendingWorkout
                ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                : "bg-[#1e1e2e] border border-[#313244] text-gray-600 cursor-not-allowed"
              }`}
          >
            <Radio
              size={18}
              className={pendingWorkout ? "text-red-400 animate-pulse" : "text-gray-600"}
            />
            <span>Live Workout</span>
            {pendingWorkout && (
              <span className="ml-auto w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            )}
          </button>
          {!pendingWorkout && (
            <p className="text-gray-600 text-xs text-center mt-1.5 px-2">
              Add a workout to go live
            </p>
          )}
        </div>
      </nav>

      {/* ─── XP Progress ───────────────────────────────────────── */}
      <div className="p-4 border-t border-[#313244]">
        <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-medium">
              {currentLevel.title}
            </span>
            <span className="text-xs text-primary-400 font-bold">
              {xp} XP
            </span>
          </div>
          <div className="w-full bg-[#11111b] rounded-full h-1.5">
            <div
              className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          {nextLevel && (
            <p className="text-gray-600 text-xs mt-1.5 text-right">
              {nextLevel.minXp - xp} XP to {nextLevel.title}
            </p>
          )}
        </div>

        {/* ─── User Info + Logout ──────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-500/20 border border-primary-500/30
              rounded-full flex items-center justify-center">
              <span className="text-primary-400 text-xs font-bold">
                {(user as any)?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="text-white text-xs font-semibold leading-none">
                {(user as any)?.name || "User"}
              </p>
              <p className="text-gray-500 text-xs mt-0.5 capitalize">
                {(user as any)?.role?.toLowerCase() || "member"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-8 h-8 flex items-center justify-center
              text-gray-500 hover:text-red-400 hover:bg-red-500/10
              rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;