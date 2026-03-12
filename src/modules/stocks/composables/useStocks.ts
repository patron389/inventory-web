import { ref, onMounted } from "vue";
import { fetchStocks, fetchStockLedger, fetchStockTransferMovement } from "../api/stock.api";
import type { Stock, StockLedger, StockTransfer } from "@/types/stock";
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

export function useStockLedger(){
  const stock = ref<StockLedger[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const lastPage = ref(1);
  const total = ref(0);

  const loadStockLedger = async (  
    page = 1,
    searchQuery = "",
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchStockLedger(page, searchQuery);

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
    loadStockLedger();
  });

  return {
    stock,
    loading,
    error,
    loadStockLedger,
    currentPage,
    lastPage,
    total,
  };

}
export function useStockTransfer(){
  const transfer = ref<StockTransfer[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const lastPage = ref(1);
  const total = ref(0);

  const loadStockTransfer = async (  
    page = 1,
    searchQuery = "",
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchStockTransferMovement(page, searchQuery);

      // Normalize here
      transfer.value = response.data.data.map((transfer: any) => ({
        ...transfer,
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
    loadStockTransfer();
  });

  return {
    transfer,
    loading,
    error,
    loadStockTransfer,
    currentPage,
    lastPage,
    total,
  };

}

