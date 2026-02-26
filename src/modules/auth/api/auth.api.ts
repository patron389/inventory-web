import api from "@/core/http/client";

/**
 * Send login request to backend
 */
export const loginRequest = (username: string, password: string) => {
  return api.post("/login", {
    username,
    password,
  });
};

/**
 * Get current authenticated user
 */
export const meRequest = () => {
  return api.get("/me");
};

/**
 * Logout current session
 */
export const logoutRequest = () => {
  return api.post("/logout");
};