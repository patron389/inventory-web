import { ref, onMounted } from "vue";
import { fetchUsers } from "../api/users.api";
import type { User } from "@/types/user";
import type { ApiError } from "@/types/api";

export function useUsers() {

  // actual users list
  const users = ref<User[]>([]);

  // loading state
  const loading = ref(false);

  // error message
  const error = ref<string | null>(null);

  // pagination meta
  const currentPage = ref(1);
  const lastPage = ref(1);
  const total = ref(0);

  /**
   * Load users from API
   */
  const loadUsers = async (page = 1) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetchUsers(page);

      // Users array
      users.value = response.data.data;

      // Pagination metadata
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

  // load first page automatically
  onMounted(() => {
    loadUsers();
  });

  return {
    users,
    loading,
    error,
    loadUsers,
    currentPage,
    lastPage,
    total,
  };
}