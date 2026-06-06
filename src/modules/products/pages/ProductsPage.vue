<template>
  <div class="space-y-6">

    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold">Product List</h1>
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
          Create Product
        </button>
       </div>

    </div>

    <div class="bg-white border rounded">
      <div class="border-b">
        <div class="flex justify-between text-sm p-5">
          <!-- Search -->
          <input
            v-model="search"
            type="text"
            placeholder="Search products..."
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
        <template #cell-index="{ index }">
          {{ (currentPage - 1) * 10 + index + 1 }}
        </template>
          <!-- Status -->
          <template #cell-is_active="{ row }">

            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                row.is_active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              ]"
            >
              <span
                :class="[
                  'w-2 h-2 rounded-full mr-2',
                  row.is_active
                    ? 'bg-green-500'
                    : 'bg-red-500'
                ]"
              ></span>

              {{ row.is_active ? 'Active' : 'Inactive' }}
            </span>

          </template>
        <template #cell-brand="{ row }">
          <div class="flex items-center gap-3">
            <img
              v-if="row.brand?.image"
              :src="row.brand.image"
              alt="brand image"
              class="w-10  object-contain bg-white rounded-md border"
            />

            <!-- Fallback if no image -->
            <div
              v-else
              class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md border text-gray-400 text-xs"
            >
              N/A
            </div>

            <span>
              {{ row.brand?.name ?? "N/A" }}
            </span>
          </div>
        </template>
        <!-- Actions Column -->
        <template #actions="{ row }">
          <button
            v-if="auth.can('product.update')"
            @click="openEdit(row)"
            class="text-gray-600 border border-neutral-300 p-2 rounded-[3px] hover:bg-neutral-300  transition duration-300 ease-in-out mr-3"
          >
            <Edit :size="16" />
          </button>

          <button
            v-if="auth.can('product.delete')"
            class="text-gray-600 border border-neutral-300 p-2 rounded-[3px] hover:bg-neutral-300  transition duration-300 ease-in-out"
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
  <EditProductModal
    v-model="showEditModal"
    :product="selectedProduct"
    @updated="loadProducts"
  />
</template>

<script setup lang="ts">

import { ref,watch } from "vue";
import CreateProductModal from "../components/CreateProductsModal.vue";
import EditProductModal from "../components/EditProductsModal.vue";
import {
  Edit,
  Trash2
} from "lucide-vue-next";
const showCreateModal = ref(false);
const showEditModal = ref(false);
// Import reusable DataTable component
import DataTable from "@/shared/components/DataTable.vue";

// Import composable that handles API logic
import { useProducts } from "../composables/useProducts";

// Import auth store for permission checks
import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { Product } from "@/types/product.type";

const search = ref("")
const statusFilter = ref<"all" | "active" | "inactive">("all")
watch([search, statusFilter], () => {
  loadProducts(1, search.value, statusFilter.value)
})
const selectedProduct = ref<Product | null>(null);
// Access auth store (for permission-based buttons)
const auth = useAuthStore();

const openEdit = (product: Product) => {
  selectedProduct.value = product;
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
  { key: "index", label: "#" },
  { key: "name", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "brand", label: "Brand" },
  { key: "sku", label: "SKU " },
  { key: "unit", label: "Unit" },
  { key: "price_formatted", label: "Price" },
  { key: "is_active", label: "Status" },
  { key: "created_at_formatted", label: "Created Date" },
  { key: "updated_at_formatted", label: "Updated Date" },
];

</script>