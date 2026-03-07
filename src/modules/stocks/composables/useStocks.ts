import { ref, onMounted } from "vue";
import { fetchStocks } from "../api/stock.api";
import type { Stock } from "@/types/stock";
import type { ApiError } from "@/types/api";

export function useStocks() {
  const stock = ref<Stock[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const lastPage = ref(1);
  const total = ref(0);

  const loadStocks = async (  
    page = 1,
    searchQuery = "",
    warehouse: number = 1
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchStocks(page, searchQuery, warehouse);

      // Normalize here
      stock.value = response.data.data.map((stock: any) => ({
        ...stock,
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
    loadStocks();
  });

  return {
    stock,
    loading,
    error,
    loadStocks,
    currentPage,
    lastPage,
    total,
  };

}