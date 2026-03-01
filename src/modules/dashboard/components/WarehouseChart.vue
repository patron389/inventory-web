<template>
  <!-- Wrapper card -->
  <div class="bg-white shadow rounded p-6">
    <h3 class="text-lg font-semibold mb-4">
      Stock Per Warehouse
    </h3>

    <!-- Bar chart -->
    <div class="h-80">
      <!-- Skeleton -->
      <div
        v-if="loading"
        class="h-full flex items-center justify-center animate-pulse"
      >
        <div class="w-full h-60 bg-gray-200 rounded" />
      </div>
      <Bar
      v-else
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

/**
 * Import chart components
 */
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

import { Bar } from "vue-chartjs";
import { computed } from "vue";

/**
 * Register required chart.js components
 */
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

/**
 * Props
 * Expects array of warehouse stock summary
 */
const props = defineProps<{
  loading: boolean,
  stockPerWarehouse: {
    warehouse: string;
    total_quantity: number;
    total_products: number;
  }[];
}>();



/**
 * Transform backend data into Chart.js format
 */
const chartData = computed(() => ({
  labels: props.stockPerWarehouse.map(w => w.warehouse),

  datasets: [
    {
      label: "Total Stock Quantity",
      data: props.stockPerWarehouse.map(w => Number(w.total_quantity)),
      backgroundColor: "#3B82F6",
    },
    {
      label: "Total Products",
      data: props.stockPerWarehouse.map(w => Number(w.total_products)),
      backgroundColor: "#00CED1",
    }
  ]
}));

/**
 * Chart options
 */
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true
    }
  }
};

</script>