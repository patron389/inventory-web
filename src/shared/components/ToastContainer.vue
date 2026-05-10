<template>
  <div class="fixed top-5 right-5 space-y-3 z-[9999]">

    <TransitionGroup
      name="toast"
      tag="div"
      class="space-y-3"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="[
          'px-4 py-3 rounded shadow text-neutral-600',
          toast.type === 'success' && 'bg-green-50 border-green-600 border-2',
          toast.type === 'error' && 'bg-red-50 border-red-600 border-2',
          toast.type === 'info' && 'bg-blue-50 border-blue-600 border-2',
        ]"
      >
        <div class="flex justify-between items-center gap-4">

          <div class="flex items-center gap-2">

            <CircleCheck
              v-if="toast.type === 'success'"
              class="text-green-600"
              :size="18"
            />

            <AlertCircle
              v-if="toast.type === 'error'"
              class="text-red-600"
              :size="18"
            />

            <Info
              v-if="toast.type === 'info'"
              class="text-blue-600"
              :size="18"
            />

            <span>{{ toast.message }}</span>

          </div>

          <button
            @click="toastStore.remove(toast.id)"
            class="text-neutral-600 hover:text-neutral-800"
          >
            ✕
          </button>

        </div>
      </div>
    </TransitionGroup>

  </div>
</template>

<script setup lang="ts">
import { useToastStore } from "@/shared/stores/toast.store";
import { CheckCircle, AlertCircle, Info, CircleCheck } from "lucide-vue-next";
const toastStore = useToastStore();

</script>
<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateY(-20px);
}


</style>