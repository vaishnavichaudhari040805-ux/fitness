// ─── Types ─────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number;        // Current value
  max: number;          // Maximum value
  label?: string;       // Label on the left
  showValue?: boolean;  // Show value on the right
  color?: string;       // Tailwind color class
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

// ─── Size Map ──────────────────────────────────────────────────
const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

// ─── ProgressBar Component ─────────────────────────────────────
const ProgressBar = ({
  value,
  max,
  label,
  showValue = true,
  color = "bg-primary-500",
  size = "md",
  animated = true,
}: ProgressBarProps) => {
  // ─── Calculate percentage ───────────────────────────────────
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  // ─── Dynamic color based on percentage ─────────────────────
  const getDynamicColor = () => {
    if (color !== "bg-primary-500") return color;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-primary-500";
  };

  return (
    <div className="w-full">
      {/* ─── Label Row ──────────────────────────────────────── */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-gray-400">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-white">
              {value}
              <span className="text-gray-500 font-normal"> / {max}</span>
            </span>
          )}
        </div>
      )}

      {/* ─── Track ──────────────────────────────────────────── */}
      <div
        className={`w-full bg-[#313244] rounded-full overflow-hidden ${sizeMap[size]}`}
      >
        {/* ─── Fill ─────────────────────────────────────────── */}
        <div
          className={`
            ${sizeMap[size]} ${getDynamicColor()} rounded-full
            ${animated ? "transition-all duration-700 ease-out" : ""}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* ─── Percentage Label (for lg size) ─────────────────── */}
      {size === "lg" && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500">{percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;