<template>
  <div class="bg-white  rounded overflow-hidden">

    <!-- Loading -->
    <div v-if="loading">
    <table class="min-w-full divide-y divide-gray-200 ">
        <thead class="bg-gray-50">
        <tr>
            <th
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-3"
            >
            <div class="h-3 bg-gray-200 rounded animate-pulse"></div>
            </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="i in 5" :key="i">
            <td
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-4"
            >
            <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
        </tr>
        </tbody>
    </table>
    </div>

    <!-- Empty -->
    <div
    v-else-if="!rows.length"
    class="p-10 text-center text-gray-500 "
    >
    <p class="text-lg font-medium">No data found</p>
    <p class="text-sm mt-2">
        Try adjusting your filters or adding new records.
    </p>
    </div>

    <!-- Table -->
    <table v-else class="min-w-full divide-y divide-gray-200 border">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ col.label }}
          </th>

          <!-- Optional actions column -->
          <th
            v-if="$slots.actions"
            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="row in rows" :key="row[idKey]">

          <!-- Normal cells -->
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
          >
            <!-- Custom slot per column -->
            <slot
              :name="`cell-${col.key}`"
              :row="row"
            >
              {{ row[col.key] }}
            </slot>
          </td>

          <!-- Actions -->
          <td
            v-if="$slots.actions"
            class="px-6 py-4 whitespace-nowrap text-right text-sm"
          >
            <slot name="actions" :row="row" />
          </td>

        </tr>
      </tbody>
    </table>

    <!-- Optional Pagination Slot -->
    <div v-if="$slots.pagination" class="px-4 pt-4">
      <slot name="pagination" />
    </div>

  </div>
</template>

<script setup lang="ts">
/**
 * Define component props.
 *
 * rows      → Array of data objects (table rows)
 * columns   → Defines table headers and which keys to display
 * loading   → Controls loading state UI
 * idKey     → Defines which field is used as unique row key
 */

// default id key
const props = withDefaults(defineProps<{
  rows: any[];
  columns: { key: string; label: string }[];
  loading?: boolean;
  idKey?: string;
}>(), {
  loading: false,
  idKey: "id",
});
</script>