import { useEffect, useState } from "react";
import {
  User,
  Save,
  Trophy,
  Dumbbell,
  Flame,
  Star,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import useWorkoutStore from "../store/workoutStore";
import useNutritionStore from "../store/nutritionStore";
import axiosInstance from "../services/axiosInstance";
import ProgressBar from "../components/ui/ProgressBar";
import { ProfileSkeleton } from "../components/ui/LoadingSkeleton";
import {
  calculateBMI,
  getBMICategory,
  getUserLevel,
  formatDate,
} from "../utils/helpers";
import {
  FITNESS_GOALS,
  ACTIVITY_LEVELS,
} from "../utils/constants";
import toast from "react-hot-toast";

// ─── Profile Page Component ────────────────────────────────────
const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { workouts, fetchWorkouts } = useWorkoutStore();
  const { logs, fetchAllLogs } = useNutritionStore();

  // ─── Profile Form State ─────────────────────────────────────
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ─── Form Data ──────────────────────────────────────────────
  const [form, setForm] = useState({
    firstName:     "",
    lastName:      "",
    age:           0,
    weightKg:      0,
    heightCm:      0,
    goal:          "General_Fitness",
    activityLevel: "Moderately_Active",
  });

  // ─── Fetch profile on mount ─────────────────────────────────
  useEffect(() => {
    fetchProfile();
    fetchWorkouts();
    fetchAllLogs();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/profile");
      const data = response.data.data;
      setProfile(data);
      setForm({
        firstName:     data.firstName,
        lastName:      data.lastName,
        age:           data.age,
        weightKg:      data.weightKg,
        heightCm:      data.heightCm,
        goal:          data.goal,
        activityLevel: data.activityLevel,
      });
    } catch (error) {
      // ─── Profile doesn't exist yet ───────────────────────
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Handle Save Profile ────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (profile) {
        // ─── Update existing profile ──────────────────────
        await axiosInstance.patch("/profile", form);
        toast.success("Profile updated successfully! 💪");
      } else {
        // ─── Create new profile ───────────────────────────
        await axiosInstance.post("/profile", form);
        toast.success("Profile created successfully! 🎉");
      }
      await fetchProfile();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Derived Stats ──────────────────────────────────────────
  const bmi         = profile ? calculateBMI(profile.weightKg, profile.heightCm) : 0;
  const bmiCategory = getBMICategory(bmi);
  const level       = getUserLevel(user?.xpPoints || 0);
  const completedWorkouts = workouts.filter((w) => w.completed).length;

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Page Header ────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your fitness profile and stats
          </p>
        </div>
        {profile && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-[#1e1e2e] border border-[#313244]
              hover:border-primary-500/50 text-white font-medium px-4 py-2.5
              rounded-xl transition-all duration-200 text-sm"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Left Column ──────────────────────────────────── */}
        <div className="space-y-4">
          {/* ─── User Card ──────────────────────────────────── */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-6 text-center">
            {/* ─── Avatar ───────────────────────────────────── */}
            <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center border-2 border-primary-500/30 mx-auto mb-4">
              <span className="text-primary-400 font-bold text-3xl">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>

            <h2 className="text-white font-bold text-lg">
              {profile
                ? `${profile.firstName} ${profile.lastName}`
                : user?.email?.split("@")[0]}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>

            {/* ─── Role Badge ───────────────────────────────── */}
            <span className="inline-block mt-2 px-3 py-1 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-lg text-xs font-semibold capitalize">
              {user?.role?.toLowerCase()}
            </span>

            {/* ─── Member Since ─────────────────────────────── */}
            <p className="text-gray-600 text-xs mt-3">
              Member since {formatDate(user?.createdAt || "")}
            </p>
          </div>

          {/* ─── Level Card ─────────────────────────────────── */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-yellow-400" />
              <h3 className="text-white font-semibold text-sm">
                Level & XP
              </h3>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-3xl font-bold text-white">
                  {level.level}
                </p>
                <p className="text-primary-400 text-sm font-medium">
                  {level.title}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">
                  {user?.xpPoints || 0}
                </p>
                <p className="text-gray-500 text-xs">Total XP</p>
              </div>
            </div>

            <ProgressBar
              value={user?.xpPoints || 0}
              max={level.nextLevel?.minXp || (user?.xpPoints || 1)}
              showValue={false}
              size="md"
            />

            {level.nextLevel && (
              <p className="text-gray-500 text-xs mt-2 text-right">
                {level.xpToNext} XP to {level.nextLevel.title}
              </p>
            )}
          </div>

          {/* ─── Quick Stats ─────────────────────────────────── */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Workouts Done",
                  value: completedWorkouts,
                  icon:  Dumbbell,
                  color: "text-primary-400",
                },
                {
                  label: "Foods Logged",
                  value: logs.length,
                  icon:  Flame,
                  color: "text-orange-400",
                },
                {
                  label: "Total XP",
                  value: user?.xpPoints || 0,
                  icon:  Trophy,
                  color: "text-yellow-400",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between bg-[#11111b] rounded-xl px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <stat.icon size={16} className={stat.color} />
                    <span className="text-gray-400 text-sm">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right Column ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* ─── BMI Card (only if profile exists) ───────────── */}
          {profile && (
            <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-4">
                Body Stats
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Weight",   value: `${profile.weightKg} kg` },
                  { label: "Height",   value: `${profile.heightCm} cm` },
                  { label: "Age",      value: `${profile.age} yrs`     },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#11111b] rounded-xl p-3 text-center"
                  >
                    <p className="text-white font-bold text-lg">
                      {stat.value}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* ─── BMI Display ──────────────────────────────── */}
              <div className="mt-4 bg-[#11111b] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">BMI</span>
                  <span
                    className="text-sm font-bold px-2 py-0.5 rounded-lg"
                    style={{
                      color:           bmiCategory.color,
                      backgroundColor: `${bmiCategory.color}20`,
                    }}
                  >
                    {bmiCategory.category}
                  </span>
                </div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: bmiCategory.color }}
                >
                  {bmi}
                </p>
                <ProgressBar
                  value={Math.min(bmi, 40)}
                  max={40}
                  showValue={false}
                  size="sm"
                  color={`bg-[${bmiCategory.color}]`}
                />
              </div>
            </div>
          )}

          {/* ─── Profile Form ─────────────────────────────────── */}
          <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <User size={18} className="text-primary-400" />
              <h3 className="text-white font-semibold">
                {profile ? "Edit Profile" : "Create Profile"}
              </h3>
            </div>

            {!profile && !isEditing && (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">👤</p>
                <p className="text-gray-400 text-sm mb-4">
                  Complete your profile to unlock AI workout generation!
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary-500 hover:bg-primary-600 text-white
                    font-semibold px-6 py-2.5 rounded-xl transition-all"
                >
                  Create Profile
                </button>
              </div>
            )}

            {(isEditing || !profile) && (
              <form onSubmit={handleSave} className="space-y-4">
                {/* ─── Name Fields ──────────────────────────── */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { field: "firstName", label: "First Name", placeholder: "John" },
                    { field: "lastName",  label: "Last Name",  placeholder: "Doe"  },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={(form as any)[field]}
                        onChange={(e) =>
                          setForm({ ...form, [field]: e.target.value })
                        }
                        placeholder={placeholder}
                        required
                        className="w-full bg-[#11111b] border border-[#313244] rounded-xl
                          px-4 py-3 text-white placeholder-gray-600 text-sm
                          focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>

                {/* ─── Physical Stats ───────────────────────── */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { field: "age",      label: "Age",        placeholder: "25",  unit: "yrs" },
                    { field: "weightKg", label: "Weight",     placeholder: "70",  unit: "kg"  },
                    { field: "heightCm", label: "Height",     placeholder: "175", unit: "cm"  },
                  ].map(({ field, label, placeholder, unit }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">
                        {label} ({unit})
                      </label>
                      <input
                        type="number"
                        value={(form as any)[field] || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [field]: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder={placeholder}
                        required
                        min="0"
                        className="w-full bg-[#11111b] border border-[#313244] rounded-xl
                          px-4 py-3 text-white placeholder-gray-600 text-sm
                          focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>
                  ))}
                </div>

                {/* ─── Fitness Goal ─────────────────────────── */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Fitness Goal
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FITNESS_GOALS.map((goal) => (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, goal: goal.value })
                        }
                        className={`px-3 py-2.5 rounded-xl text-sm font-medium
                          transition-all border flex items-center gap-2
                          ${form.goal === goal.value
                            ? "bg-primary-500/20 border-primary-500/50 text-primary-400"
                            : "bg-[#11111b] border-[#313244] text-gray-400 hover:text-white"
                          }`}
                      >
                        <span>{goal.icon}</span>
                        <span>{goal.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ─── Activity Level ───────────────────────── */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">
                    Activity Level
                  </label>
                  <div className="space-y-2">
                    {ACTIVITY_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, activityLevel: level.value })
                        }
                        className={`w-full px-4 py-3 rounded-xl text-sm
                          transition-all border flex items-center justify-between
                          ${form.activityLevel === level.value
                            ? "bg-primary-500/20 border-primary-500/50"
                            : "bg-[#11111b] border-[#313244] hover:border-primary-500/20"
                          }`}
                      >
                        <span
                          className={
                            form.activityLevel === level.value
                              ? "text-primary-400 font-medium"
                              : "text-gray-400"
                          }
                        >
                          {level.label}
                        </span>
                        <span className="text-gray-600 text-xs">
                          {level.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ─── Action Buttons ───────────────────────── */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2
                      bg-primary-500 hover:bg-primary-600 disabled:opacity-50
                      text-white font-semibold py-3 rounded-xl transition-all"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save Profile</span>
                      </>
                    )}
                  </button>

                  {profile && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-[#11111b] border border-[#313244]
                        text-gray-400 hover:text-white rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* ─── View Mode (not editing) ──────────────────── */}
            {profile && !isEditing && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "First Name",      value: profile.firstName     },
                  { label: "Last Name",       value: profile.lastName      },
                  { label: "Age",             value: `${profile.age} yrs`  },
                  { label: "Weight",          value: `${profile.weightKg} kg` },
                  { label: "Height",          value: `${profile.heightCm} cm` },
                  { label: "Goal",            value: profile.goal.replace(/_/g, " ")          },
                  { label: "Activity Level",  value: profile.activityLevel.replace(/_/g, " ") },
                ].map((item) => (
                  <div key={item.label} className="bg-[#11111b] rounded-xl p-3">
                    <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                    <p className="text-white font-medium text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;