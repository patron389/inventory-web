import { ref } from "vue";
import { fetchBrandOptions } from "@/modules/brands/api/brands.api";
import { fetchCategoryOptions } from "@/modules/category/api/category.api";

import type { Brand } from "@/types/brand";
import type { Category } from "@/types/category";

export function usePosFilters() {
  const brands = ref<Brand[]>([]);
  const categories = ref<Category[]>([]);
  const loadingFilters = ref(false);

  const selectedBrand = ref<number | null>(null);
  const selectedCategory = ref<number | null>(null);

  const loadFilters = async () => {
    loadingFilters.value = true;
    try{
      const [brandResponse, categoryResponse] =
        await Promise.all([
          fetchBrandOptions(),
          fetchCategoryOptions(),
        ]);
        brands.value = brandResponse.data.data;
        categories.value = categoryResponse.data.data;
    } finally{
        loadingFilters.value = false;
    }



  };

  return {
    brands,
    loadingFilters,
    categories,
    selectedBrand,
    selectedCategory,
    loadFilters,
  };
}