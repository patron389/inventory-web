<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold">Stock Adjustments</h1>
        <p class="text-base text-neutral-500 mt-2">Manage your stocks</p>
      </div>

      <!-- Create button (permission aware) -->
       <div class="flex gap-3">
        <button
          @click="refreshStocks"
          class="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Refresh
        </button>
        <button
          v-if="auth.can('stock.add')"
          @click="ShowAdjustModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Adjust Stock
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
           <div class="flex items-center gap-3">
            <select
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
            </select>
            <select
              v-model="status"
              class="border rounded px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="low">Low</option>
              <option value="mid">Mid</option>
              <option value="high">High</option>
            </select>
           </div>

        </div>
      </div>
      <div class="p-5">
      <DataTable
        :rows="stock"
        :columns="columns"
        :loading="loading"
      >
        <template #cell-index="{ index }">
          {{ (currentPage - 1) * 10 + index + 1 }}
        </template>
        
        <template #cell-brand="{ row }">
          <div class="flex items-center gap-3">
            <img
              v-if="row.brand_image"
              :src="row.brand_image"
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
              {{ row.brand_name ?? "N/A" }}
            </span>
          </div>
        </template>

      <template #cell-stock_status="{ row }">
        <span
          class="px-3 py-1 text-xs font-semibold rounded-full"
          :class="getStatusClass(row.stock_status)"
        >
          {{ row.stock_status }}
        </span>
      </template>
      <!-- ACTIONS  -->
        <template #actions="{ row }">
          <button
            v-if="auth.can('product.update')"
            @click="openAdjustModal(row)"
            class="text-gray-600 border border-neutral-300 p-2 rounded-[3px] hover:bg-neutral-300  transition duration-300 ease-in-out"
          >
            <Edit :size="16" />
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
                @click="loadStocks(currentPage - 1)"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                :disabled="currentPage === lastPage"
                @click="loadStocks(currentPage + 1)"
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
    <AdjustStockModal
      v-model="ShowAdjustModal"
      :stock="selectedStock"
      @created="loadStocks"
    />
</template>
<script setup lang="ts">
import { ref,watch, onMounted } from "vue";
import DataTable from "@/shared/components/DataTable.vue";
import { useStocks } from "../composables/useStocks";
import { fetchWarehouse } from "@/modules/warehouse/api/warehouse.api";
import type { Warehouse } from "@/types/warehouse"
import { useAuthStore } from "@/modules/auth/store/auth.store";
import AdjustStockModal from "../components/AdjustStockModal.vue";
import type { Stock } from "@/types/stock";
import {
  Edit,
  Trash2
} from "lucide-vue-next";

const selectedStock = ref<Stock | null>(null)

const auth = useAuthStore();
const ShowAdjustModal = ref(false);
const search = ref("")
const warehouse = ref<number>(1)
const warehouses = ref<Warehouse[]>([])
const status = ref("")
const refreshStocks = () => {
  loadStocks(1, search.value, warehouse.value, status.value)
};

const openAdjustModal = (row: Stock) => {
  selectedStock.value = row
  ShowAdjustModal.value = true
}

// Status style 
const getStatusClass = (status: string) => {
  switch (status) {
    case "Low":
      return "bg-red-100 text-red-700";
    case "Mid":
      return "bg-yellow-100 text-yellow-700";
    case "High":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

  // Load warehouse list for filter dropdown
const loadWarehouses = async () => {
  const res = await fetchWarehouse()

  // Paginated response → warehouses are inside data.data
  warehouses.value = res.data.data
}

onMounted(() => {
  loadWarehouses()
  loadStocks(1, search.value, warehouse.value, status.value)
})

let timeout: any;

watch([search, warehouse, status], () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    loadStocks(1, search.value, warehouse.value, status.value);
  }, 400); // 400ms debounce
});


const { stock, loading, currentPage, lastPage, loadStocks } = useStocks();
const columns = [
  { key: "index", label: "#" },
  { key: "product_name", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "brand", label: "Brand" },
  { key: "quantity", label: "Stocks" },
  { key: "stock_status", label: "Status" },
];
</script>