<template>
  <div class="fixed top-6 right-6 z-[9999] space-y-3">

    <TransitionGroup
      name="toast"
      tag="div"
      class="space-y-3"
    >
<div
  v-for="toast in toastStore.toasts"
  :key="toast.id"
  class="w-96 bg-white rounded-xl shadow-lg border overflow-hidden"
>
  <div class="p-4">

    <div class="flex items-start gap-3">

      <!-- Icon -->
      <div
        class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
        :class="[
          toast.type === 'success' && 'bg-green-100',
          toast.type === 'error' && 'bg-red-100',
          toast.type === 'info' && 'bg-blue-100',
        ]"
      >
        <CircleCheck
          v-if="toast.type === 'success'"
          class="text-green-600"
          :size="20"
        />

        <AlertCircle
          v-if="toast.type === 'error'"
          class="text-red-600"
          :size="20"
        />

        <Info
          v-if="toast.type === 'info'"
          class="text-blue-600"
          :size="20"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">

        <p
          class="font-semibold"
          :class="[
            toast.type === 'success' && 'text-green-700',
            toast.type === 'error' && 'text-red-700',
            toast.type === 'info' && 'text-blue-700',
          ]"
        >
          {{
            toast.type === 'success'
              ? 'Success'
              : toast.type === 'error'
              ? 'Error'
              : 'Information'
          }}
        </p>

        <p class="text-sm text-gray-600 mt-1 break-words">
          {{ toast.message }}
        </p>

      </div>

      <!-- Close -->
      <button
        @click="toastStore.remove(toast.id)"
        class="text-gray-400 hover:text-gray-600 transition"
      >
        ✕
      </button>

    </div>

  </div>

  <!-- Progress Bar -->
  <div
    class="h-1 animate-toast-progress"
    :class="[
      toast.type === 'success' && 'bg-green-500',
      toast.type === 'error' && 'bg-red-500',
      toast.type === 'info' && 'bg-blue-500',
    ]"
  />
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
  transition: all 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.toast-move {
  transition: transform 0.25s ease;
}
@keyframes toast-progress {
  from {
    width: 100%;
  }

  to {
    width: 0%;
  }
}

.animate-toast-progress {
  animation: toast-progress 3s linear forwards;
}
</style>