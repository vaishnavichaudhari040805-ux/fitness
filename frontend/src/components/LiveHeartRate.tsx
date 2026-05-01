import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────
interface LiveHeartRateProps {
  heartRate: number;
  onHeartRateChange?: (rate: number) => void;
  isMocking?: boolean;
}

// ─── Get Heart Rate Zone ────────────────────────────────────────
const getHeartRateZone = (bpm: number) => {
  if (bpm === 0)   return { zone: "Rest",       color: "text-gray-400",   bg: "bg-gray-500/10",   border: "border-gray-500/20"   };
  if (bpm < 90)    return { zone: "Warm Up",    color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20"   };
  if (bpm < 120)   return { zone: "Fat Burn",   color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20"  };
  if (bpm < 150)   return { zone: "Cardio",     color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
  if (bpm < 170)   return { zone: "Hard",       color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
  return             { zone: "Max Effort",  color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20"    };
};

// ─── LiveHeartRate Component ───────────────────────────────────
const LiveHeartRate = ({
  heartRate,
  onHeartRateChange,
  isMocking = false,
}: LiveHeartRateProps) => {
  const [isBeating, setIsBeating] = useState(false);
  const [mockRate, setMockRate]   = useState(72);
  const displayRate = isMocking ? mockRate : heartRate;
  const zone        = getHeartRateZone(displayRate);

  // ─── Heartbeat animation ────────────────────────────────────
  useEffect(() => {
    if (displayRate === 0) return;
    const interval = setInterval(() => {
      setIsBeating(true);
      setTimeout(() => setIsBeating(false), 150);
    }, (60 / displayRate) * 1000);

    return () => clearInterval(interval);
  }, [displayRate]);

  // ─── Mock heart rate simulation ─────────────────────────────
  useEffect(() => {
    if (!isMocking) return;

    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 10) - 5;
      const newRate   = Math.max(60, Math.min(180, mockRate + variation));
      setMockRate(newRate);
      onHeartRateChange?.(newRate);
    }, 2000);

    return () => clearInterval(interval);
  }, [isMocking, mockRate, onHeartRateChange]);

  return (
    <div
      className={`${zone.bg} border ${zone.border} rounded-2xl p-5 transition-all duration-300`}
    >
      {/* ─── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart
            size={18}
            className={`${zone.color} ${isBeating ? "scale-125" : "scale-100"} transition-transform duration-150`}
            fill="currentColor"
          />
          <span className="text-white font-semibold text-sm">
            Heart Rate
          </span>
        </div>

        {/* ─── Live Badge ─────────────────────────────────────── */}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-xs font-semibold">LIVE</span>
        </div>
      </div>

      {/* ─── BPM Display ──────────────────────────────────────── */}
      <div className="text-center mb-4">
        <p className={`text-6xl font-bold ${zone.color} transition-all duration-300`}>
          {displayRate}
        </p>
        <p className="text-gray-400 text-sm mt-1">BPM</p>
      </div>

      {/* ─── Zone Badge ───────────────────────────────────────── */}
      <div className="flex items-center justify-center mb-4">
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-semibold
            ${zone.bg} ${zone.color} border ${zone.border}`}
        >
          {zone.zone} Zone
        </span>
      </div>

      {/* ─── Heart Rate Zones Legend ───────────────────────────── */}
      <div className="space-y-1.5">
        {[
          { label: "Warm Up",    range: "< 90",    color: "bg-blue-500"   },
          { label: "Fat Burn",   range: "90-120",  color: "bg-green-500"  },
          { label: "Cardio",     range: "120-150", color: "bg-yellow-500" },
          { label: "Hard",       range: "150-170", color: "bg-orange-500" },
          { label: "Max Effort", range: "> 170",   color: "bg-red-500"    },
        ].map((z) => (
          <div key={z.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${z.color}`} />
              <span className="text-gray-400 text-xs">{z.label}</span>
            </div>
            <span className="text-gray-600 text-xs">{z.range} bpm</span>
          </div>
        ))}
      </div>

      {/* ─── Mock Mode Badge ──────────────────────────────────── */}
      {isMocking && (
        <div className="mt-3 bg-[#11111b] rounded-xl p-2 text-center">
          <p className="text-gray-500 text-xs">
            🤖 Simulated heart rate data
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveHeartRate;