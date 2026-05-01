import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "../../utils/constants";
import { WeeklyEntry } from "../../store/nutritionStore";
import { getCurrentWeekDays } from "../../utils/helpers";

// ─── Types ─────────────────────────────────────────────────────
interface WeeklyChartProps {
  weeklyData: WeeklyEntry[];
}

// ─── Custom Tooltip ────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e2e] border border-[#313244] rounded-xl p-3 shadow-xl">
        <p className="text-white font-semibold text-sm mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── WeeklyChart Component ─────────────────────────────────────
const WeeklyChart = ({ weeklyData }: WeeklyChartProps) => {
  const weekDays = getCurrentWeekDays();

  // ─── Map weekly data to days ────────────────────────────────
  const chartData = weekDays.map((day) => {
    const entry = weeklyData.find((d) => {
      const date = new Date(d.date);
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return dayNames[date.getDay()] === day;
    });

    return {
      day,
      Calories: entry?.totalCalories || 0,
      Protein:  Math.round(entry?.totalProteinG || 0),
      Carbs:    Math.round(entry?.totalCarbsG || 0),
      Fats:     Math.round(entry?.totalFatsG || 0),
    };
  });

  // ─── Check if empty ─────────────────────────────────────────
  const isEmpty = chartData.every((d) => d.Calories === 0);

  return (
    <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
      {/* ─── Header ───────────────────────────────────────────── */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white">
          Weekly Calories
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          This week's nutrition overview
        </p>
      </div>

      {/* ─── Bar Chart ────────────────────────────────────────── */}
      {!isEmpty ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            barSize={24}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#313244"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#313244", radius: 4 }}
            />
            <Bar
              dataKey="Calories"
              fill={CHART_COLORS.PRIMARY}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        // ─── Empty State ───────────────────────────────────────
        <div className="h-48 flex flex-col items-center justify-center">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-gray-500 text-sm text-center">
            No nutrition data this week.
            <br />
            Start logging your meals!
          </p>
        </div>
      )}

      {/* ─── Legend ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {[
          { label: "Calories", color: CHART_COLORS.PRIMARY   },
          { label: "Protein",  color: CHART_COLORS.PROTEIN   },
          { label: "Carbs",    color: CHART_COLORS.SECONDARY },
          { label: "Fats",     color: CHART_COLORS.ACCENT    },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyChart;