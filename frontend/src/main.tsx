import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./assets/index.css";

// ─── React Query Client Configuration ─────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ─── Retry failed requests once ───────────────────────
      retry: 1,
      // ─── Cache data for 5 minutes ─────────────────────────
      staleTime: 5 * 60 * 1000,
      // ─── Refetch on window focus ──────────────────────────
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* ─── Global Toast Notifications ───────────────────── */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e1e2e",
            color: "#fff",
            border: "1px solid #313244",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);