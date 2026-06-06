import { ref } from "vue";
import { fetchStocks } from "@/modules/stocks/api/stock.api";
import type { Stock } from "@/types/stock";

import { useAuthStore } from "@/modules/auth/store/auth.store";


export function usePosStocks() {
  const auth = useAuthStore();
    const products = ref<Stock[]>([]);
  const loading = ref(false);

  const loadProducts = async (
    search = "",
    categoryId?: number,
    brandId?: number
  ) => {
    loading.value = true;

    try {
      const response = await fetchStocks(
        1,
        search,
        auth.user?.warehouse_id,
        "",
        categoryId,
        brandId
      );

      products.value = response.data.data;
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    loadProducts,
  };
}