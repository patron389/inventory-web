<template>
  <div class="space-y-1">

    <!-- Optional label -->
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>

    <!-- 
      Controlled select.
      Uses slot for flexible option rendering.
    -->
    <select
      :value="modelValue"
      @change="updateValue"
      :class="[
        'w-full border rounded px-3 py-2 focus:outline-none focus:ring-2',
        error
          ? 'border-red-500 focus:ring-red-200'
          : 'border-gray-300 focus:ring-blue-200'
      ]"
    >
      <!-- Options are injected by parent -->
      <slot />
    </select>

    <!-- Validation error -->
    <p
      v-if="error"
      class="text-sm text-red-600"
    >
      {{ error[0] }}
    </p>

  </div>
</template>

<script setup lang="ts">
import vSelect from "vue-select"
import "vue-select/dist/vue-select.css"
/**
 * Props definition.
 *
 * modelValue → selected value
 * label      → optional label text
 * error      → Laravel validation error array
 */
defineProps<{
  modelValue: string | number | boolean
  label?: string;
  error?: string[];
}>();

/**
 * Emits update:modelValue for v-model binding.
 */
const emit = defineEmits(["update:modelValue"]);

/**
 * Handles select change event.
 */
const updateValue = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
};

</script>