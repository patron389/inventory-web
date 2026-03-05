<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold">Category List</h1>
        <p class="text-base text-neutral-500 mt-2">Manage your categories</p>
      </div>

      <!-- Create button (permission aware) -->
       <div class="flex gap-3">
        <button
          @click="() => loadCategories()"
          class="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
        <button
          v-if="auth.can('category.create')"
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Category
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
            placeholder="Search category..."
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
        :rows="category"
        :columns="columns"
        :loading="loading"
      >
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
        <template #cell-brand="{ row }">
          <div class="flex items-center gap-3">
            <img
              v-if="row.brand?.image"
              :src="row.brand.image"
              alt="brand image"
              class="w-10  object-contain rounded-md border"
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
            v-if="auth.can('category.update')"
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
                @click="loadCategories(currentPage - 1)"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                :disabled="currentPage === lastPage"
                @click="loadCategories(currentPage + 1)"
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
  <CreateCategoryModal
    v-model="showCreateModal"
    @created="loadCategories"
  />
  <EditCategoryModal
    v-model="showEditModal"
    :category="selectedCategory"
    @updated="loadCategories"
  />
</template>
<script setup lang="ts">
import { ref,watch } from "vue";
import DataTable from "@/shared/components/DataTable.vue";
import { useCategory } from "../composables/useCategory";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import CreateCategoryModal from "../components/CreateCategoryModal.vue";
import EditCategoryModal from "../components/EditCategoryModal.vue";
import type { Category } from "@/types/category";
import {
  Edit,
  Trash2
} from "lucide-vue-next";
const selectedCategory = ref<Category | null>(null);
const showEditModal = ref(false);
const auth = useAuthStore();
const showCreateModal = ref(false);
const search = ref("")
const statusFilter = ref<"all" | "active" | "inactive">("all")
watch([search, statusFilter], () => {
  loadCategories(1, search.value, statusFilter.value)
})
const openEdit = (category: Category) => {
  selectedCategory.value = category;
  showEditModal.value = true;
};

const { category, loading, currentPage, lastPage, loadCategories } = useCategory();
const columns = [
  { key: "name", label: "Category Name" },
  { key: "created_at_formatted", label: "Created Date" },
  { key: "updated_at_formatted", label: "Updated Date" },
  { key: "is_active", label: "Status" },
];
</script>