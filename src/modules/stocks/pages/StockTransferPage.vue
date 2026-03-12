<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold">Stock Transfer</h1>
        <p class="text-base text-neutral-500 mt-2">Manage stock transfers.</p>
      </div>

      <!-- Create button (permission aware) -->
       <div class="flex gap-3">
        <button
          @click="() => loadStockTransfer()"
          class="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
        <button
          v-if="auth.can('stock.transfer')"
          @click="ShowAdjustModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Stock Transfer
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
            placeholder="Search product..."
            class="border rounded px-3 py-2 w-64"
          />
          <!-- Status Filter -->
        <!-- <select
          v-model="warehouse"
          class="border rounded px-3 py-2"
        >
          <option
            v-for="wh in warehouses"
            :key="wh.id"
            :value="wh.id"
          >
            {{ wh.name }}
          </option>
        </select> -->
        </div>
      </div>
      <div class="p-5">
      <DataTable
        :rows="transfer"
        :columns="columns"
        :loading="loading"
      >
        <template #cell-index="{ index }">
          {{ (currentPage - 1) * 10 + index + 1 }}
        </template>
        <template #pagination>
          <div class="flex justify-between items-center">

            <span class="text-sm text-gray-600">
              Page {{ currentPage }} of {{ lastPage }}
            </span>

            <div class="space-x-2">
              <button
                :disabled="currentPage === 1"
                @click="loadStockTransfer(currentPage - 1)"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                :disabled="currentPage === lastPage"
                @click="loadStockTransfer(currentPage + 1)"
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
    <!-- <AdjustStockModal
    v-model="ShowAdjustModal"
    @created="loadStockTransfer"
  /> -->
</template>
<script setup lang="ts">
import { ref,watch, onMounted } from "vue";
import DataTable from "@/shared/components/DataTable.vue";
import { useStockTransfer } from "../composables/useStocks";
import { fetchWarehouse } from "@/modules/warehouse/api/warehouse.api";
import type { Warehouse } from "@/types/warehouse"
import { useAuthStore } from "@/modules/auth/store/auth.store";
import AdjustStockModal from "../components/AdjustStockModal.vue";
import SearchSelect from "@/shared/components/form/SearchSelect.vue";
import type { Stock } from "@/types/stock";
import {
  Edit,
  Trash2
} from "lucide-vue-next";
const auth = useAuthStore();
const ShowAdjustModal = ref(false);
const search = ref("")
// const warehouse = ref<number>(1)
// const warehouses = ref<Warehouse[]>([])
  // Load warehouse list for filter dropdown
// const loadWarehouses = async () => {
//   const res = await fetchWarehouse()

//   // Paginated response → warehouses are inside data.data
//   warehouses.value = res.data.data
// }

// onMounted(() => {
//   loadWarehouses()
// })

watch([search], () => {
  loadStockTransfer(1, search.value)
})
const { transfer, loading, currentPage, lastPage, loadStockTransfer } = useStockTransfer();
const columns = [
  { key: "index", label: "#" },
  { key: "from_warehouse_name", label: "From Warehouse" },
  { key: "to_warehouse_name", label: "To Warehouse" },
  { key: "product_name", label: "Products" },
  { key: "user_name", label: "Person" },
  { key: "quantity", label: "QTY" },
  { key: "status", label: "Status" },
  { key: "created_at_formatted", label: "Date Transfer" },
  // { key: "created_time", label: "Time" },
];
</script>