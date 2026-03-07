<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-semibold">Warehouse List</h1>
            <p class="text-base text-neutral-500 mt-2">Manage your warehouse</p>
        </div>

            <!-- Create button (permission aware) -->
            <div class="flex gap-3">
                <button
                @click="() => loadWarehouse()"
                class="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                Refresh
                </button>
                <button
                v-if="auth.can('warehouse.create')"
                @click="showCreateModal = true"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                Create Warehouse
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
            placeholder="Search warehouse..."
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
        :rows="warehouse"
        :columns="columns"
        :loading="loading"
      >
        <template #cell-index="{ index }">
          {{ (currentPage - 1) * 10 + index + 1 }}
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
            v-if="auth.can('warehouse.update')"
            @click="openEdit(row)"
            class="text-indigo-600 hover:underline mr-3"
          >
            <Edit :size="16" />
          </button>

          <button
            v-if="auth.can('warehouse.delete')"
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
                @click="loadWarehouse(currentPage - 1)"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                :disabled="currentPage === lastPage"
                @click="loadWarehouse(currentPage + 1)"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

          </div>
        </template>
      </DataTable>
      </div>
      <CreateWarehouseModal
        v-model="showCreateModal"
        @created="loadWarehouse"
      />
    <EditWarehouseModal
      v-model="showEditModal"
      :warehouse="selectedWarehouse"
      @updated="loadWarehouse"
    />
    </div>
    </div>
</template>
<script setup lang="ts">
import { ref,watch } from "vue";
import DataTable from "@/shared/components/DataTable.vue";
import CreateWarehouseModal from "../components/CreateWarehouseModal.vue";
import EditWarehouseModal from "../components/EditWarehouseModal.vue";
import { useWarehouse } from "../composables/useWarehouse";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import {
  Edit,
  Trash2
} from "lucide-vue-next";
import type { Warehouse } from "@/types/warehouse";
const selectedWarehouse = ref<Warehouse | null>(null);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const auth = useAuthStore();
const search = ref("")
const statusFilter = ref<"all" | "active" | "inactive">("all")
const { warehouse, loading, currentPage, lastPage, loadWarehouse } = useWarehouse();
const openEdit = (warehouse: Warehouse) => {
  selectedWarehouse.value = warehouse;
  showEditModal.value = true;
};
watch([search, statusFilter], () => {
  loadWarehouse(1, search.value, statusFilter.value)
})
const columns = [
  { key: "index", label: "#" },
  { key: "name", label: "Warehouse Name" },
  { key: "code", label: "Code" },
  { key: "location", label: "Location" },
  { key: "contact_person", label: "Contact Person" },
  { key: "contact_phone", label: "Phone No." },
  { key: "contact_email", label: "Email" },
//   { key: "description", label: "Description" },
{ key: "is_active", label: "Status" },
  { key: "created_at_formatted", label: "Created Date" },
  { key: "updated_at_formatted", label: "Updated Date" },
];



</script>