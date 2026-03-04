import { ref, onMounted } from "vue";
import { fetchBrands } from "../api/brands.api";
import type { Brand } from "@/types/brand";
import type { ApiError } from "@/types/api";

export function useBrands() {

  const brands = ref<Brand[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const currentPage = ref(1);
  const lastPage = ref(1);
  const total = ref(0);

  const loadBrands = async (  
    page = 1,
    searchQuery = "",
    statusFilter = "all") => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchBrands(page, searchQuery, statusFilter);

      // Normalize here
      brands.value = response.data.data.map((product: any) => ({
        ...product,
        price: Number(product.price),
        is_active: product.is_active === 1,
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
    loadBrands();
  });

  return {
    brands,
    loading,
    error,
    loadBrands,
    currentPage,
    lastPage,
    total,
  };
}