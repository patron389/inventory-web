<template>
  <!-- 
    Only render modal if modelValue is true.
    Parent controls visibility using v-model.
  -->
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <!-- 
      Modal container.
      maxWidth can be customized later if needed.
    -->
    <div class="bg-white w-full max-w-lg rounded shadow p-6 space-y-4">

      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">
          {{ title }}
        </h2>

        <!-- Close button -->
        <button
          @click="close"
          class="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <!-- Body slot -->
      <div>
        <slot />
      </div>

      <!-- Footer slot (optional) -->
      <div v-if="$slots.footer" class="pt-4 border-t">
        <slot name="footer" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

/**
 * Props
 * modelValue → controls modal visibility
 * title      → modal header text
 */
defineProps<{
  modelValue: boolean;
  title: string;
}>();

/**
 * Emits
 * update:modelValue → allows parent to close modal
 */
const emit = defineEmits(["update:modelValue"]);

/**
 * Close modal helper.
 * Keeps closing logic centralized.
 */
const close = () => {
  emit("update:modelValue", false);
};

</script>