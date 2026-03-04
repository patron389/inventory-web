import { ref, onMounted,onUnmounted } from "vue";
import { fetchDashboardSummary } from "../api/dashboard.api";
import type { DashboardSummary } from "@/types/dashboard";
import type { ApiError } from "@/types/api";

export function useDashboard() {
  const summary = ref<DashboardSummary | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadSummary = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchDashboardSummary();

      // If your backend uses Laravel Resource wrapping:
      summary.value = response.data;
      // If NOT wrapped, use:
      // summary.value = response.data;

    } catch (err) {
      const apiError = err as ApiError;
      error.value = apiError.message;
    } finally {
      loading.value = false;
    }
  };
  onMounted(() => {
    loadSummary();
  });
  // Temporarilry remove the auto refresh on ther
    // let interval: number;
    // onMounted(() => {
    // loadSummary();
    // interval = window.setInterval(loadSummary, 30000); // 30 seconds
    // });

    // onUnmounted(() => {
    // clearInterval(interval);
    // });
    
  return {
    summary,
    loading,
    error,
    loadSummary,
  };
}