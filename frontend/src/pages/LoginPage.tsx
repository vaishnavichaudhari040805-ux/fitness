import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap, Mail, Lock } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { APP_NAME } from "../utils/constants";

// ─── Login Page Component ──────────────────────────────────────
const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // ─── Form State ─────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ─── Handle Submit ───────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#11111b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ─── Logo ───────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-glow">
            <Zap size={24} className="text-white" />
          </div>
          <span className="text-3xl font-bold text-white">{APP_NAME}</span>
        </div>

        {/* ─── Card ───────────────────────────────────────────── */}
        <div className="bg-[#1e1e2e] border border-[#313244] rounded-2xl p-8">
          {/* ─── Header ─────────────────────────────────────── */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to continue your fitness journey
            </p>
          </div>

          {/* ─── Form ───────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ─── Email Field ──────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#11111b] border border-[#313244] rounded-xl
                    pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm
                    focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* ─── Password Field ───────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#11111b] border border-[#313244] rounded-xl
                    pl-10 pr-12 py-3 text-white placeholder-gray-600 text-sm
                    focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* ─── Submit Button ────────────────────────────── */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50
                disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl
                transition-all duration-200 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* ─── Register Link ───────────────────────────────── */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* ─── Footer ─────────────────────────────────────────── */}
        <p className="text-center text-gray-600 text-xs mt-6">
          AI-Powered Fitness Tracking 🤖💪
        </p>
      </div>
    </div>
  );
};

export default LoginPage;