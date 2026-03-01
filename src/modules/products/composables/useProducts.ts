import { ref, onMounted } from "vue";
import { fetchProducts } from "../api/products.api";
import type { Product } from "@/types/product.type";
import type { ApiError } from "@/types/api";

export function useProducts() {

  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const currentPage = ref(1);
  const lastPage = ref(1);
  const total = ref(0);

  const loadProducts = async (  
    page = 1,
    searchQuery = "",
    statusFilter = "all") => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchProducts(page, searchQuery, statusFilter);

      // Normalize here
      products.value = response.data.data.map((product: any) => ({
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
    loadProducts();
  });

  return {
    products,
    loading,
    error,
    loadProducts,
    currentPage,
    lastPage,
    total,
  };
}