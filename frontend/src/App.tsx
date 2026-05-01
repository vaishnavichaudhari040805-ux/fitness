import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/authStore";
import AppLayout from "./layouts/AppLayout";

// ─── Pages ─────────────────────────────────────────────────────
import LoginPage        from "./pages/LoginPage";
import RegisterPage     from "./pages/RegisterPage";
import DashboardPage    from "./pages/DashboardPage";
import WorkoutsPage     from "./pages/WorkoutsPage";
import NutritionPage    from "./pages/NutritionPage";
import ProfilePage      from "./pages/ProfilePage";
import LiveWorkoutPage  from "./pages/LiveWorkoutPage";

// ─── Route Guards ───────────────────────────────────────────────
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Outlet />;
};

// ─── App ────────────────────────────────────────────────────────
const App = () => {
  return (
    <>
      <BrowserRouter
        future={{
          v7_startTransition:      true,
          v7_relativeSplatPath:    true,
        }}
      >
        <Routes>

          {/* ─── Public Routes ─────────────────────────────── */}
          <Route element={<PublicRoute />}>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* ─── Protected Routes ──────────────────────────── */}
          <Route element={<ProtectedRoute />}>

            {/* ─── Routes WITH sidebar layout ────────────── */}
            <Route element={<AppLayout />}>
              <Route index                  element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"      element={<DashboardPage />} />
              <Route path="/workouts"       element={<WorkoutsPage />} />
              <Route path="/nutrition"      element={<NutritionPage />} />
              <Route path="/profile"        element={<ProfilePage />} />
            </Route>

            {/* ─── Live Workout (fullscreen, no sidebar) ─── */}
            <Route
              path="/workout/live/:workoutId"
              element={<LiveWorkoutPage />}
            />

          </Route>

          {/* ─── Fallback ───────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </BrowserRouter>

      {/* ─── Global Toast ──────────────────────────────────────── */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1e1e2e",
            color:      "#cdd6f4",
            border:     "1px solid #313244",
            borderRadius: "12px",
            fontSize:   "14px",
          },
          success: {
            iconTheme: {
              primary:    "#a6e3a1",
              secondary:  "#1e1e2e",
            },
          },
          error: {
            iconTheme: {
              primary:    "#f38ba8",
              secondary:  "#1e1e2e",
            },
          },
        }}
      />
    </>
  );
};

export default App;