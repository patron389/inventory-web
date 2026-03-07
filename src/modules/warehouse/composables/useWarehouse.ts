import { ref, onMounted } from "vue";
import { fetchWarehouse } from "../api/warehouse.api";
import type { ApiError } from "@/types/api";
import type { Warehouse } from "@/types/warehouse";

export function useWarehouse() {

  const warehouse = ref<Warehouse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const currentPage = ref(1);
  const lastPage = ref(1);
  const total = ref(0);

  const loadWarehouse = async (  
    page = 1,
    searchQuery = "",
    statusFilter = "all") => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchWarehouse(page, searchQuery, statusFilter);

      // Normalize here
      warehouse.value = response.data.data.map((warehouse: any) => ({
        ...warehouse,
        is_active: warehouse.is_active === 1,
      }));

      currentPage.value = response.data.meta.current_page;
      lastPage.value = response.data.meta.last_page;
      total.value = response.data.meta.total;

    } catch (err) {
      const apiError = err as ApiError;
      error.value = apiError.message;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    loadWarehouse();
  });

  return {
    warehouse,
    loading,
    error,
    loadWarehouse,
    currentPage,
    lastPage,
    total,
  };
}