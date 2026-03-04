import { ref, onMounted } from "vue";
import { fetchCategory } from "../api/category.api";
import type { Category } from "@/types/category";
import type { ApiError } from "@/types/api";

export function useCategory() {

  const category = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const currentPage = ref(1);
  const lastPage = ref(1);
  const total = ref(0);

  const loadCategories = async (  
    page = 1,
    searchQuery = "",
    statusFilter = "all") => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchCategory(page, searchQuery, statusFilter);

      // Normalize here
      category.value = response.data.data.map((category: any) => ({
        ...category,
        is_active: category.is_active === 1,
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
    loadCategories();
  });

  return {
    category,
    loading,
    error,
    loadCategories,
    currentPage,
    lastPage,
    total,
  };
}