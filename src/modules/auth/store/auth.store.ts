import { defineStore } from "pinia";
import { loginRequest, meRequest, logoutRequest } from "../api/auth.api";
import type { User } from "@/types/user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // persisted auth token (survives refresh)
    token: localStorage.getItem("token") as string | null,

    // logged in user data from /me
    user: null as User | null,

    // spatie roles
    roles: [] as string[],

    // spatie permissions
    permissions: [] as string[],

    // tells app we already attempted session restore
    isBootstrapped: false,
  }),

  getters: {
    // equivalent of auth()->check()
    isAuthenticated: (state) => !!state.token && !!state.user,
  /**
   * Check if user has a specific role
   */
    hasRole: (state) => {
      return (role: string) => state.roles.includes(role);
    },

    /**
     * Check if user has a specific permission
     */
    can: (state) => {
      return (permission: string) => state.permissions.includes(permission);
    },
  },

  actions: {
    // save/remove token in both store and browser storage
    setToken(token: string | null) {
      this.token = token;

      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    },

    // fully reset auth state (logout or expired token)
    clearAuth() {
      this.setToken(null);
      this.user = null;
      this.roles = [];
      this.permissions = [];
    },
    
    /**
     * Login user and store token
     */
    async login(username: string, password: string) {
      const response = await loginRequest(username, password);

      // backend returns token
      this.setToken(response.data.token);

      // fetch authenticated user info
      await this.fetchUser();
    },

    /**
     * Load authenticated user from /me
     */
  async fetchUser() {
    // no token = guest, skip request
    if (!this.token) {
      this.isBootstrapped = true;
      return;
    }

    try {
      const response = await meRequest();

      const user = response.data.data as User;

      this.user = user;
      this.roles = user.roles ?? [];
      this.permissions = user.permissions ?? [];
    } catch (e) {
      this.clearAuth();
    } finally {
      this.isBootstrapped = true;
    }
  },

    /**
     * Logout from server and clear session
     */
    async logout() {
      try {
        await logoutRequest();
      } catch (e) {
        // ignore API errors (token may already be invalid)
      }

      this.clearAuth();
    },
  },
});