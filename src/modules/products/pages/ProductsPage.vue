<template>
  <div class="space-y-6">

    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold">Products List</h1>
        <p class="text-base text-neutral-500 mt-2">Manage your products</p>
      </div>

      <!-- Create button (permission aware) -->
       <div class="flex gap-3">
        <button
          @click="() => loadProducts()"
          class="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
        <button
          v-if="auth.can('user.create')"
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create User
        </button>
       </div>

    </div>

    <!-- Placeholder for future table -->
    <div class="bg-white border rounded">
      <div class="border-b">
        <div class="flex justify-between text-sm p-5">
          <!-- Search -->
          <input
            v-model="search"
            type="text"
            placeholder="Search users..."
            class="border rounded px-3 py-2 w-64"
          />
          <!-- Status Filter -->
          <select
            v-model="statusFilter"
            class="border rounded px-3 py-2"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div class="p-5">
      <DataTable
        :rows="products"
        :columns="columns"
        :loading="loading"
      >
        <!-- Custom Status Column -->
        <template #cell-price="{ row }">
          <span>
            {{ formatPrice(row.price) }}
          </span>
        </template>
        <template #cell-is_active="{ row }">
          <span   :class="[
                  'px-3 py-2 text-xs font-medium rounded-md',
                  row.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                ]">
            {{ row.is_active ? 'Active' : 'Inactive' }}
          </span>
        </template>

        <!-- Actions Column -->
        <template #actions="{ row }">
          <button
            v-if="auth.can('user.update')"
            @click="openEdit(row)"
            class="text-indigo-600 hover:underline mr-3"
          >
            <Edit :size="16" />
          </button>

          <button
            v-if="auth.can('user.delete')"
            class="text-red-600 hover:underline"
          >
            <Trash2 :size="16" />
          </button>
        </template>
        <template #pagination>
          <div class="flex justify-between items-center">

            <span class="text-sm text-gray-600">
              Page {{ currentPage }} of {{ lastPage }}
            </span>

            <div class="space-x-2">
              <button
                :disabled="currentPage === 1"
                @click="loadProducts(currentPage - 1)"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                :disabled="currentPage === lastPage"
                @click="loadProducts(currentPage + 1)"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

          </div>
        </template>
      </DataTable>
      </div>

    </div>

  </div>
  <CreateProductModal
    v-model="showCreateModal"
    @created="loadProducts"
  />
  <!-- <EditUserModal
    v-model="showEditModal"
    :user="selectedUser"
    @updated="loadProducts"
  /> -->
</template>

<script setup lang="ts">

import { ref,watch } from "vue";
import CreateProductModal from "../components/CreateProductsModal.vue";
// import EditUserModal from "../components/EditUserModal.vue";
import type { User } from "@/types/user";
import {
  Edit,
  Trash2
} from "lucide-vue-next";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);
};
const showCreateModal = ref(false);
// Import reusable DataTable component
import DataTable from "@/shared/components/DataTable.vue";

// Import composable that handles API logic
import { useProducts } from "../composables/useProducts";

// Import auth store for permission checks
import { useAuthStore } from "@/modules/auth/store/auth.store";
const search = ref("")
const statusFilter = ref<"all" | "active" | "inactive">("all")
watch([search, statusFilter], () => {
  loadProducts(1, search.value, statusFilter.value)
})
const showEditModal = ref(false);
const selectedUser = ref<User | null>(null);
// Access auth store (for permission-based buttons)
const auth = useAuthStore();

const openEdit = (user: User) => {
  selectedUser.value = user;
  showEditModal.value = true;
};
// Destructure state from composable
// users  → actual user data
// loading → loading state for API call
const { products, loading, currentPage, lastPage, loadProducts } = useProducts();

/**
 * Define which columns DataTable should render.
 *
 * key   → object property name from each row
 * label → table header text
 */
const columns = [
  { key: "name", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "sku", label: "SKU " },
  { key: "unit", label: "Unit" },
  { key: "price", label: "Price" },
  { key: "is_active", label: "Status" },
];

</script>