<template>
  <div class="bg-white shadow rounded p-6 animate-pulse">

    <!-- Fake label -->
    <div
      :class="[
        'bg-gray-200 rounded mb-4',
        labelSize
      ]"
    ></div>

    <!-- Fake value -->
    <div
      :class="[
        'bg-gray-300 rounded',
        valueSize
      ]"
    ></div>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  labelSize?: string;
  valueSize?: string;
}>();
</script>