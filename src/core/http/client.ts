import axios from "axios";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { ApiError } from "@/types/api";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json", // forces Laravel API JSON response
  },
});

/**
 * REQUEST INTERCEPTOR
 * Runs before every request
 * Automatically attaches Bearer token
 */
api.interceptors.request.use((config) => {
  const auth = useAuthStore();

  // If token exists → attach Authorization header
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

/**
 * RESPONSE INTERCEPTOR
 * Standardizes all errors
 * Handles expired tokens automatically
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const auth = useAuthStore();

    const status = error.response?.status ?? 500;

    // 🔐 If unauthorized → clear session
    if (status === 401) {
      auth.clearAuth();
    }

    /**
     * We now normalize the error.
     * Every error in the app will follow ApiError shape.
     */
    const normalizedError: ApiError = {
      message:
        error.response?.data?.message || "Something went wrong",
      status,
      errors: error.response?.data?.errors || undefined,
    };

    return Promise.reject(normalizedError);
  }
);

export default api;