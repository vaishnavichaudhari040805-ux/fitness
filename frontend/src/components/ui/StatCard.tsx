import { LucideIcon } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// ─── StatCard Component ────────────────────────────────────────
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary-400",
  iconBg = "bg-primary-500/10",
  trend,
}: StatCardProps) => {
  return (
    <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5">
      {/* ─── Top Row ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-4">
        {/* ─── Icon ─────────────────────────────────────────── */}
        <div
          className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center`}
        >
          <Icon size={22} className={iconColor} />
        </div>

        {/* ─── Trend Badge ──────────────────────────────────── */}
        {trend && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
              trend.isPositive
                ? "bg-primary-500/10 text-primary-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            <span>{trend.isPositive ? "↑" : "↓"}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* ─── Value ────────────────────────────────────────────── */}
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;