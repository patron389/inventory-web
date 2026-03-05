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
      Controlled textarea.
      Uses modelValue prop instead of v-model internally.
      Emits update:modelValue on change.
    -->
    <textarea
      :value="modelValue"
      @input="updateValue"
      rows="4"
      :class="[

        // base styling
        'w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 resize-none',

        // dynamic styling if error exists
        error
          ? 'border-red-500 focus:ring-red-200'
          : 'border-gray-300 focus:ring-blue-200'
      ]"
    ></textarea>

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
 * modelValue → current textarea value
 * label      → optional label above textarea
 * error      → Laravel validation error array (string[])
 */
defineProps<{
  modelValue: string;
  label?: string;
  error?: string[];
}>();

/**
 * Emits update:modelValue so parent v-model works.
 */
const emit = defineEmits(["update:modelValue"]);

/**
 * Handles textarea input and emits updated value.
 */
const updateValue = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit("update:modelValue", target.value);
};

</script>