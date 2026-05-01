import { Menu, Bell, Search } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { getGreeting } from "../utils/helpers";

// ─── Types ─────────────────────────────────────────────────────
interface TopbarProps {
  onMenuClick: () => void;
}

// ─── Topbar Component ──────────────────────────────────────────
const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAuth();
  const greeting = getGreeting();

  return (
    <header className="h-16 bg-[#1e1e2e] border-b border-[#313244] flex items-center justify-between px-4 md:px-6">
      {/* ─── Left Section ─────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* ─── Mobile Menu Button ───────────────────────────── */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={22} />
        </button>

        {/* ─── Greeting ─────────────────────────────────────── */}
        <div className="hidden md:block">
          <h2 className="text-sm font-medium text-gray-400">
            {greeting} 👋
          </h2>
          <p className="text-base font-semibold text-white">
            {user?.email?.split("@")[0]}
          </p>
        </div>
      </div>

      {/* ─── Center Section: Search Bar ───────────────────────── */}
      <div className="hidden md:flex items-center gap-2 bg-[#11111b] border border-[#313244] rounded-xl px-4 py-2 w-72">
        <Search size={16} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search workouts, foods..."
          className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
        />
      </div>

      {/* ─── Right Section ────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* ─── XP Badge ─────────────────────────────────────── */}
        <div className="hidden sm:flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-xl px-3 py-1.5">
          <span className="text-primary-400 text-xs font-bold">⚡</span>
          <span className="text-primary-400 text-xs font-semibold">
            {user?.xpPoints || 0} XP
          </span>
        </div>

        {/* ─── Notification Bell ────────────────────────────── */}
        <button className="relative w-9 h-9 bg-[#11111b] border border-[#313244] rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:border-primary-500/50 transition-all">
          <Bell size={18} />
          {/* ─── Notification Dot ───────────────────────────── */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* ─── Avatar ───────────────────────────────────────── */}
        <div className="w-9 h-9 bg-primary-500/20 rounded-xl flex items-center justify-center border border-primary-500/30 cursor-pointer hover:border-primary-500 transition-all">
          <span className="text-primary-400 font-bold text-sm">
            {user?.email?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;