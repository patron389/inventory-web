<template>
  <div class="space-y-6">

    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold">Brand List</h1>
        <p class="text-base text-neutral-500 mt-2">Manage your brands</p>
      </div>

      <!-- Create button (permission aware) -->
       <div class="flex gap-3">
        <button
          @click="() => loadBrands()"
          class="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
        <button
          v-if="auth.can('brand.create')"
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Brand
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
            placeholder="Search brands..."
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
        :rows="brands"
        :columns="columns"
        :loading="loading"
      >
        <!-- Custom Status Column -->
        <template #cell-index="{ index }">
          {{ (currentPage - 1) * 10 + index + 1 }}
        </template>
        <template #cell-name="{ row }">
          <div class="flex items-center gap-3">
            <img
              v-if="row.image"
              :src="row.image"
              alt="brand image"
              class="w-10 h-10 object-cover rounded-md border"
            />

            <!-- Fallback if no image -->
            <div
              v-else
              class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md border text-gray-400 text-xs"
            >
              N/A
            </div>

            <span class="font-medium text-gray-800">
              {{ row.name }}
            </span>
          </div>
        </template>
          <template #cell-is_active="{ row }">

            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                row.is_active
                  ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
              ]"
            >
              <span
                :class="[
                  'w-2 h-2 rounded-full mr-2',
                  row.is_active
                    ? 'bg-green-500'
                    : 'bg-gray-100 text-gray-600'
                ]"
              ></span>

              {{ row.is_active ? 'Active' : 'Inactive' }}
            </span>

          </template>
        <!-- Actions Column -->
        <template #actions="{ row }">
          <button
            v-if="auth.can('brand.update')"
            @click="openEdit(row)"
            class="text-indigo-600 hover:underline mr-3"
          >
            <Edit :size="16" />
          </button>

          <button
            v-if="auth.can('brand.delete')"
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
                @click="loadBrands(currentPage - 1)"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                :disabled="currentPage === lastPage"
                @click="loadBrands(currentPage + 1)"
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
  <CreateBrandModal
    v-model="showCreateModal"
    @created="loadBrands"
  />
  <EditBrandModal
    v-model="showEditModal"
    :brand="selectedBrand"
    @updated="loadBrands"
  />
</template>

<script setup lang="ts">

import { ref,watch } from "vue";
import CreateBrandModal from "../components/CreateBrandModal.vue";
// import EditUserModal from "../components/EditUserModal.vue";
import EditBrandModal from "../components/EditBrandModal.vue";
import {
  Edit,
  Trash2
} from "lucide-vue-next";

const showCreateModal = ref(false);
import DataTable from "@/shared/components/DataTable.vue";
import { useBrands } from "../composables/useBrands";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { Brand } from "@/types/brand";
const search = ref("")
const statusFilter = ref<"all" | "active" | "inactive">("all")
const auth = useAuthStore();
watch([search, statusFilter], () => {
  loadBrands(1, search.value, statusFilter.value)
})
const showEditModal = ref(false);
const selectedBrand = ref<Brand | null>(null);


const openEdit = (brand: Brand) => {
  selectedBrand.value = brand;
  showEditModal.value = true;
};

const { brands, loading, currentPage, lastPage, loadBrands } = useBrands();

const columns = [
  { key: "index", label: "#" },
  { key: "name", label: "Brand Name" },
  { key: "created_at_formatted", label: "Created Date" },
  { key: "updated_at_formatted", label: "Updated Date" },
  { key: "is_active", label: "Status" },
];

</script>