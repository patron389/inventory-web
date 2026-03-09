<template>
  <div class="space-y-1">

    <!-- 
      Optional label.
      Only renders if label prop is provided.
    -->
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>

    <!-- 
      Controlled input.
      Uses modelValue prop instead of v-model internally.
      Emits update:modelValue on change.
    -->
    <input
      v-bind="$attrs"
      :type="type"
      :value="modelValue"
      @input="updateValue"
      :class="[
        // base styling
        'w-full border rounded px-3 py-2 focus:outline-none focus:ring-2',

        // dynamic styling if error exists
        error
          ? 'border-red-500 focus:ring-red-200'
          : 'border-gray-300 focus:ring-blue-200'
      ]"
    />

    <!-- 
      Displays first validation error message if present.
      Expects Laravel-style error array.
    -->
    <p
      v-if="error"
      class="text-sm text-red-600"
    >
      {{ error[0] }}
    </p>

  </div>
</template>

<script setup lang="ts">

/**
 * Props definition.
 *
 * modelValue → current value (for v-model binding)
 * label      → optional label above input
 * type       → input type (text, email, password, etc.)
 * error      → Laravel validation error array (string[])
 */
defineProps<{
  modelValue: string | number | null;
  label?: string;
  type?: string;
  error?: string[];
}>();

/**
 * Emits update:modelValue so parent v-model works.
 */
const emit = defineEmits(["update:modelValue"]);

/**
 * Handles input event and emits updated value.
 * Keeps component fully controlled.
 */
const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

</script>