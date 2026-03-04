<template>
  <div class="fixed top-5 right-5 space-y-3 z-50">

    <div
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :class="[
        'px-4 py-3 rounded shadow text-neutral-600 transition-all',
        toast.type === 'success' && 'bg-white border-green-600 border-2',
        toast.type === 'error' && 'bg-white border-red-600 border-2',
        toast.type === 'info' && 'bg-white border-blue-600 border-2',
      ]"
    >
      <div class="flex justify-between items-center gap-4">
        <span>{{ toast.message }}</span>

        <button
          @click="toastStore.remove(toast.id)"
          class="text-neutral-600 hover:text-neutral-800"
        >
          ✕
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useToastStore } from "@/shared/stores/toast.store";

const toastStore = useToastStore();
</script>