<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold">Welcome, {{ auth.user?.first_name }} </h1>
        <p class="text-base text-neutral-600 mt-2">Lorem ipsum dolor sit</p>
      </div>
      

      <button
        @click="loadSummary"
        class="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
      >
        Refresh
      </button>
    </div>

    <!-- Skeleton Loader -->
  <div
    v-if="loading"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
  >
    <SkeletonCard
      v-for="i in 4"
      :key="i"
      labelSize="h-4 w-1/2"
      valueSize="h-6 w-1/3"
    />
  </div>
    <!-- Cards -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <StatCard
        label="Total Products"
        :icon="Package"
      >
        {{ summary?.total_products }}
      </StatCard>

      <StatCard
        label="Total Warehouses"
        :icon="Warehouse"
      >
        {{ summary?.total_warehouses }}
      </StatCard>

      <StatCard
        label="Total Stock Quantity"
        :icon="Boxes"
      >
        {{ summary?.total_stock_quantity }}
      </StatCard>

      <StatCard
        label="Low Stock Items"
        :icon="AlertTriangle"
      >
        <span class="text-red-600">
          {{ summary?.low_stock_items }}
        </span>
      </StatCard>

    </div>
    <WarehouseChart
    :loading="loading"
      v-if="summary?.stock_per_warehouse"
      :stockPerWarehouse="summary.stock_per_warehouse"
    />
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useDashboard } from "../composables/useDashboard";
import StatCard from "@/shared/components/StatCard.vue";
import SkeletonCard from "@/shared/components/SkeletonCard.vue";
import WarehouseChart from "../components/WarehouseChart.vue";

import {
  Package,
  Warehouse,
  Boxes,
  AlertTriangle
} from "lucide-vue-next";

const router = useRouter();
const auth = useAuthStore();

const { summary, loading, error, loadSummary } = useDashboard();
</script>