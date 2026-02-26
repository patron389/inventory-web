import api from "@/core/http/client";

/**
 * Fetch dashboard summary statistics
 */
export function fetchDashboardSummary() {
  return api.get("/dashboard/summary");
}