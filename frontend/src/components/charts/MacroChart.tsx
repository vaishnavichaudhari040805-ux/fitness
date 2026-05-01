import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CHART_COLORS, DAILY_TARGETS } from "../../utils/constants";
import { DailySummary } from "../../store/nutritionStore";

// ─── Types ─────────────────────────────────────────────────────
interface MacroChartProps {
  dailySummary: DailySummary | null;
}

// ─── Custom Tooltip ────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-3 shadow-xl">
        <p className="text-white font-semibold text-sm">
          {payload[0].name}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          {payload[0].value}g consumed
        </p>
      </div>
    );
  }
  return null;
};

// ─── MacroChart Component ──────────────────────────────────────
const MacroChart = ({ dailySummary }: MacroChartProps) => {
  // ─── Build chart data ───────────────────────────────────────
  const data = [
    {
      name:   "Protein",
      value:  Math.round(dailySummary?.totalProteinG || 0),
      target: DAILY_TARGETS.PROTEIN_G,
      color:  CHART_COLORS.protein,
    },
    {
      name:   "Carbs",
      value:  Math.round(dailySummary?.totalCarbsG || 0),
      target: DAILY_TARGETS.CARBS_G,
      color:  CHART_COLORS.carbs,
    },
    {
      name:   "Fats",
      value:  Math.round(dailySummary?.totalFatsG || 0),
      target: DAILY_TARGETS.FATS_G,
      color:  CHART_COLORS.fats,
    },
  ];

  // ─── Empty state ────────────────────────────────────────────
  const isEmpty   = data.every((d) => d.value === 0);
  const chartData = isEmpty
    ? [{ name: "No data", value: 1, color: "#313244" }]
    : data;

  return (
    <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
      {/* ─── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Today's Macros
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Daily nutrition breakdown
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            {dailySummary?.totalCalories || 0}
          </p>
          <p className="text-xs text-gray-500">
            / {DAILY_TARGETS.CALORIES} kcal
          </p>
        </div>
      </div>

      {/* ─── Pie Chart ────────────────────────────────────────── */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={isEmpty ? 0 : 4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {!isEmpty && <Tooltip content={<CustomTooltip />} />}
          <Legend
            formatter={(value) => (
              <span className="text-gray-400 text-xs">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* ─── Macro Details ────────────────────────────────────── */}
      {!isEmpty && (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {data.map((macro) => (
            <div
              key={macro.name}
              className="bg-[#11111b] rounded-xl p-3 text-center"
            >
              <div
                className="w-2 h-2 rounded-full mx-auto mb-1.5"
                style={{ backgroundColor: macro.color }}
              />
              <p className="text-white font-bold text-sm">{macro.value}g</p>
              <p className="text-gray-500 text-xs">{macro.name}</p>
              <p className="text-gray-600 text-xs">/ {macro.target}g</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Empty State ──────────────────────────────────────── */}
      {isEmpty && (
        <p className="text-center text-gray-600 text-sm mt-2">
          No nutrition logged today. Start tracking! 🥗
        </p>
      )}
    </div>
  );
};

export default MacroChart;