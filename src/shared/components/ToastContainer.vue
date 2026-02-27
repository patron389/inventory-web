<template>
  <div class="fixed top-5 right-5 space-y-3 z-50">

    <div
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :class="[
        'px-4 py-3 rounded shadow text-white transition-all',
        toast.type === 'success' && 'bg-green-600',
        toast.type === 'error' && 'bg-red-600',
        toast.type === 'info' && 'bg-blue-600',
      ]"
    >
      <div class="flex justify-between items-center gap-4">
        <span>{{ toast.message }}</span>

        <button
          @click="toastStore.remove(toast.id)"
          class="text-white/80 hover:text-white"
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