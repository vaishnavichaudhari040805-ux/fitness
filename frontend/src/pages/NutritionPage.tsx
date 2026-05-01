import { useEffect, useState, useCallback } from "react";
import {
  Apple,
  Plus,
  Trash2,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Search,
  X,
  Loader,
} from "lucide-react";
import useNutritionStore, { NutritionLog } from "../store/nutritionStore";
import { NutritionLogSkeleton } from "../components/ui/LoadingSkeleton";
import MacroChart from "../components/charts/MacroChart";
import ProgressBar from "../components/ui/ProgressBar";
import { DAILY_TARGETS } from "../utils/constants";
import {
  searchAllFoods,
  FoodItem,
  INDIAN_FOODS,
} from "../services/foodSearchService";

// ─── Add Nutrition Modal with Food Search ──────────────────────
const AddNutritionModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: any) => void;
}) => {
  const [searchQuery, setSearchQuery]     = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching]     = useState(false);
  const [selectedFood, setSelectedFood]   = useState<FoodItem | null>(null);
  const [form, setForm] = useState({
    foodName: "",
    calories: 0,
    proteinG: 0,
    carbsG:   0,
    fatsG:    0,
  });

  // ─── Debounced Search ───────────────────────────────────────
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchAllFoods(query);
      setSearchResults(results.slice(0, 10));
    } finally {
      setIsSearching(false);
    }
  }, []);

  // ─── Select Food from Search ────────────────────────────────
  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setForm({
      foodName: food.foodName,
      calories: food.calories,
      proteinG: food.proteinG,
      carbsG:   food.carbsG,
      fatsG:    food.fatsG,
    });
    setSearchQuery(food.foodName);
    setSearchResults([]);
  };

  // ─── Clear Selection ────────────────────────────────────────
  const handleClear = () => {
    setSelectedFood(null);
    setSearchQuery("");
    setSearchResults([]);
    setForm({ foodName: "", calories: 0, proteinG: 0, carbsG: 0, fatsG: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* ─── Modal Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between p-6 border-b border-[#313244]">
          <h2 className="text-lg font-bold text-white">Log Food 🥗</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* ─── Search Bar ────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Search Food 🔍
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search dal, chicken, roti, rice..."
                className="w-full bg-[#11111b] border border-[#313244] rounded-xl
                  pl-10 pr-10 py-3 text-white placeholder-gray-600 text-sm
                  focus:outline-none focus:border-primary-500 transition-colors"
              />
              {/* ─── Loading / Clear ─────────────────────── */}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {isSearching ? (
                  <Loader size={16} className="text-gray-500 animate-spin" />
                ) : searchQuery ? (
                  <button onClick={handleClear}>
                    <X size={16} className="text-gray-500 hover:text-white" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* ─── Search Results Dropdown ─────────────────── */}
            {searchResults.length > 0 && (
              <div className="mt-1 bg-[#11111b] border border-[#313244] rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                {searchResults.map((food, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectFood(food)}
                    className="w-full flex items-center justify-between px-4 py-3
                      hover:bg-[#313244] transition-all text-left border-b
                      border-[#313244] last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      {/* ─── Source Badge ──────────────────── */}
                      <span className="text-xs">
                        {food.source === "indian" ? "🇮🇳" : "🌍"}
                      </span>
                      <span className="text-white text-sm truncate max-w-[180px]">
                        {food.foodName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-primary-400 text-xs font-bold">
                        {food.calories} kcal
                      </span>
                      <span className="text-gray-600 text-xs">
                        P:{food.proteinG}g
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Indian Food Quick Presets ───────────────────── */}
          {!selectedFood && searchQuery.length === 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">
                🇮🇳 Popular Indian Foods
              </p>
              <div className="grid grid-cols-2 gap-2">
                {INDIAN_FOODS.slice(0, 6).map((food) => (
                  <button
                    key={food.foodName}
                    type="button"
                    onClick={() => handleSelectFood({ ...food, source: "indian" })}
                    className="bg-[#11111b] border border-[#313244]
                      hover:border-primary-500/30 rounded-xl p-2.5 text-left
                      transition-all"
                  >
                    <p className="text-white text-xs font-medium truncate">
                      {food.foodName}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {food.calories} kcal • P:{food.proteinG}g
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Form ──────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* ─── Food Name ─────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Food Name
              </label>
              <input
                type="text"
                value={form.foodName}
                onChange={(e) =>
                  setForm({ ...form, foodName: e.target.value })
                }
                placeholder="e.g. Dal Tadka"
                required
                className="w-full bg-[#11111b] border border-[#313244] rounded-xl
                  px-4 py-3 text-white placeholder-gray-600 text-sm
                  focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {/* ─── Nutrition Fields ──────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { field: "calories", label: "Calories (kcal)", icon: "🔥" },
                { field: "proteinG", label: "Protein (g)",     icon: "🥩" },
                { field: "carbsG",   label: "Carbs (g)",       icon: "🌾" },
                { field: "fatsG",    label: "Fats (g)",        icon: "🫙" },
              ].map(({ field, label, icon }) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    {icon} {label}
                  </label>
                  <input
                    type="number"
                    value={(form as any)[field]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [field]: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.1"
                    required
                    className="w-full bg-[#11111b] border border-[#313244] rounded-xl
                      px-3 py-2.5 text-white text-sm
                      focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* ─── Selected Food Info ────────────────────── */}
            {selectedFood && (
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="text-primary-400 text-xs font-semibold">
                    ✓ Selected:
                  </span>
                  <span className="text-white text-xs">
                    {selectedFood.foodName}
                  </span>
                  <span className="text-xs ml-auto">
                    {selectedFood.source === "indian" ? "🇮🇳" : "🌍"}
                  </span>
                </div>
              </div>
            )}

            {/* ─── Submit Button ─────────────────────────── */}
            <button
              type="submit"
              disabled={!form.foodName}
              className="w-full bg-primary-500 hover:bg-primary-600
                disabled:opacity-50 disabled:cursor-not-allowed
                text-white font-semibold py-3 rounded-xl transition-all mt-2"
            >
              Log Food 🥗
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Nutrition Log Item ────────────────────────────────────────
const NutritionLogItem = ({ log }: { log: NutritionLog }) => {
  const { deleteLog } = useNutritionStore();

  return (
    <div className="flex items-center justify-between bg-[#1e1e2e] border border-[#313244] rounded-2xl p-4 hover:border-primary-500/20 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
          <Apple size={18} className="text-orange-400" />
        </div>
        <div>
          <p className="text-white font-medium text-sm">{log.foodName}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-gray-500 text-xs">P: {log.proteinG}g</span>
            <span className="text-gray-500 text-xs">C: {log.carbsG}g</span>
            <span className="text-gray-500 text-xs">F: {log.fatsG}g</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-white font-bold text-sm">{log.calories}</p>
          <p className="text-gray-500 text-xs">kcal</p>
        </div>
        <button
          onClick={() => deleteLog(log.id)}
          className="w-8 h-8 flex items-center justify-center
            text-gray-500 hover:text-red-400 hover:bg-red-500/10
            rounded-lg transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── Nutrition Page Component ──────────────────────────────────
const NutritionPage = () => {
  const {
    logs,
    dailySummary,
    isLoading,
    fetchAllLogs,
    fetchDailySummary,
    fetchWeeklyData,
    createLog,
  } = useNutritionStore();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAllLogs();
    fetchDailySummary();
    fetchWeeklyData();
  }, []);

  const handleAddLog = async (data: any) => {
    const success = await createLog(data);
    if (success) {
      setShowModal(false);
      fetchDailySummary();
      fetchAllLogs();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Page Header ────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Nutrition</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your daily macros and calories
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600
            text-white font-semibold px-4 py-2.5 rounded-xl
            transition-all duration-200 text-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:block">Log Food</span>
        </button>
      </div>

      {/* ─── Daily Summary Cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label:  "Calories",
            value:  dailySummary?.totalCalories || 0,
            target: DAILY_TARGETS.CALORIES,
            icon:   Flame,
            color:  "text-orange-400",
            bg:     "bg-orange-500/10",
            unit:   "kcal",
          },
          {
            label:  "Protein",
            value:  Math.round(dailySummary?.totalProteinG || 0),
            target: DAILY_TARGETS.PROTEIN_G,
            icon:   Beef,
            color:  "text-primary-400",
            bg:     "bg-primary-500/10",
            unit:   "g",
          },
          {
            label:  "Carbs",
            value:  Math.round(dailySummary?.totalCarbsG || 0),
            target: DAILY_TARGETS.CARBS_G,
            icon:   Wheat,
            color:  "text-blue-400",
            bg:     "bg-blue-500/10",
            unit:   "g",
          },
          {
            label:  "Fats",
            value:  Math.round(dailySummary?.totalFatsG || 0),
            target: DAILY_TARGETS.FATS_G,
            icon:   Droplets,
            color:  "text-yellow-400",
            bg:     "bg-yellow-500/10",
            unit:   "g",
          },
        ].map((macro) => (
          <div
            key={macro.label}
            className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-9 h-9 ${macro.bg} rounded-xl flex items-center justify-center`}
              >
                <macro.icon size={18} className={macro.color} />
              </div>
              <span className="text-xs text-gray-500">
                / {macro.target}{macro.unit}
              </span>
            </div>
            <p className="text-xl font-bold text-white">
              {macro.value}
              <span className="text-sm text-gray-500 font-normal ml-1">
                {macro.unit}
              </span>
            </p>
            <p className="text-xs text-gray-500 mb-2">{macro.label}</p>
            <ProgressBar
              value={macro.value}
              max={macro.target}
              showValue={false}
              size="sm"
            />
          </div>
        ))}
      </div>

      {/* ─── Chart & Today's Logs ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MacroChart dailySummary={dailySummary} />

        <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
          <h3 className="text-base font-semibold text-white mb-4">
            Today's Food Log
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <NutritionLogSkeleton key={i} />
              ))}
            </div>
          ) : dailySummary?.logs && dailySummary.logs.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {dailySummary.logs.map((log) => (
                <NutritionLogItem key={log.id} log={log} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-4xl mb-3">🥗</p>
              <p className="text-gray-500 text-sm text-center">
                No food logged today.
                <br />
                Search for Indian foods or add manually!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── All Logs History ─────────────────────────────────── */}
      <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
        <h3 className="text-base font-semibold text-white mb-4">
          Nutrition History
        </h3>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <NutritionLogSkeleton key={i} />
            ))}
          </div>
        ) : logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <NutritionLogItem key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-gray-500 text-sm">No nutrition history yet.</p>
          </div>
        )}
      </div>

      {/* ─── Modal ───────────────────────────────────────────── */}
      {showModal && (
        <AddNutritionModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddLog}
        />
      )}
    </div>
  );
};

export default NutritionPage;