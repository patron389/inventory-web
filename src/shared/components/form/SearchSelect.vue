<template>
  <div class="space-y-1">

    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>

    <v-select
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :options="options"
      :reduce="reduce"
      :label="optionLabel"
      :placeholder="placeholder"
      class="w-full"
    />

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

defineProps<{
  modelValue: any
  options: any[]
  label?: string
  optionLabel?: string
  reduce?: (option: any) => any
  placeholder?: string
  error?: string[]
}>()

const emit = defineEmits(["update:modelValue"])
</script>
<style>
.vs__dropdown-toggle {
  border-radius: 0.375rem;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
}
.vs__open-indicator {
  transform: scale(0.8);
}

.vs--open .vs__open-indicator {
  transform: rotate(180deg) scale(0.8);
}
.vs__clear {
  transform: scale(0.8);
}
</style>