// ─── Base Skeleton Block ───────────────────────────────────────
const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={`bg-[#313244] rounded-xl animate-pulse ${className}`}
  />
);

// ─── Stat Card Skeleton ────────────────────────────────────────
export const StatCardSkeleton = () => (
  <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
    <div className="flex items-start justify-between mb-4">
      <SkeletonBlock className="w-11 h-11" />
      <SkeletonBlock className="w-16 h-6" />
    </div>
    <SkeletonBlock className="w-24 h-8 mb-2" />
    <SkeletonBlock className="w-32 h-4" />
  </div>
);

// ─── Workout Card Skeleton ─────────────────────────────────────
export const WorkoutCardSkeleton = () => (
  <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-10 h-10" />
        <div>
          <SkeletonBlock className="w-36 h-5 mb-2" />
          <SkeletonBlock className="w-24 h-4" />
        </div>
      </div>
      <SkeletonBlock className="w-20 h-8" />
    </div>
    <div className="space-y-2">
      <SkeletonBlock className="w-full h-4" />
      <SkeletonBlock className="w-3/4 h-4" />
      <SkeletonBlock className="w-1/2 h-4" />
    </div>
  </div>
);

// ─── Nutrition Log Skeleton ────────────────────────────────────
export const NutritionLogSkeleton = () => (
  <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-10 h-10" />
        <div>
          <SkeletonBlock className="w-28 h-5 mb-2" />
          <SkeletonBlock className="w-20 h-4" />
        </div>
      </div>
      <SkeletonBlock className="w-16 h-6" />
    </div>
  </div>
);

// ─── Chart Skeleton ────────────────────────────────────────────
export const ChartSkeleton = () => (
  <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-5">
    <SkeletonBlock className="w-40 h-6 mb-6" />
    <div className="flex items-end gap-3 h-40">
      {[60, 80, 45, 90, 70, 55, 85].map((height, i) => (
        <div
          key={i}
          className="flex-1 bg-[#313244] rounded-xl animate-pulse"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  </div>
);

// ─── Profile Skeleton ──────────────────────────────────────────
export const ProfileSkeleton = () => (
  <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-6">
    <div className="flex items-center gap-4 mb-6">
      <SkeletonBlock className="w-16 h-16 rounded-full" />
      <div>
        <SkeletonBlock className="w-40 h-6 mb-2" />
        <SkeletonBlock className="w-24 h-4" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i}>
          <SkeletonBlock className="w-20 h-4 mb-2" />
          <SkeletonBlock className="w-full h-10" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Full Page Skeleton ────────────────────────────────────────
export const PageSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  </div>
);