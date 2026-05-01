import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import toast from "react-hot-toast";

// ─── Create Axios Instance ─────────────────────────────────────
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ───────────────────────────────────────
// Automatically attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ─── Get token from localStorage ───────────────────────
    const token = localStorage.getItem("fitpro_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ──────────────────────────────────────
// Handle global errors like 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<{ message: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong.";

    switch (status) {
      case 401:
        // ─── Clear token and redirect to login ─────────────
        localStorage.removeItem("fitpro_token");
        localStorage.removeItem("fitpro_user");
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
        break;

      case 403:
        toast.error("You do not have permission to do this.");
        break;

      case 404:
        toast.error("Resource not found.");
        break;

      case 500:
        toast.error("Server error. Please try again later.");
        break;

      default:
        // ─── Show error message from backend ───────────────
        if (message) toast.error(message);
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;