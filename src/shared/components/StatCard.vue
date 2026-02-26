<template>
  <div class="bg-white shadow rounded p-6 flex items-center justify-between">

    <div>
      <p class="text-sm text-gray-500">
        {{ label }}
      </p>

      <p class="text-2xl font-bold mt-1">
        <slot />
      </p>
    </div>

    <div class="text-gray-400">
      <component :is="icon" class="w-8 h-8" />
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  icon: any;
}>();
</script>