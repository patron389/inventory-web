<template>
    <FormModal
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        title="Create Category"
    >
    <div class="space-y-4">
        <FormInput
        v-model="form.name"
        label="Category Name"
        :error="errors.name"
        />
    </div>
    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          @click="$emit('update:modelValue', false)"
          class="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>

        <button
          @click="submit"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {{ loading ? "Creating..." : "Create" }}
        </button>
      </div>
    </template>
    </FormModal>
</template>
<script setup lang="ts">
import { reactive,ref } from "vue";
import { createCategory } from "../api/category.api";
import FormModal from "@/shared/components/form/FormModal.vue";
import FormInput from "@/shared/components/form/FormInput.vue";
import { useToastStore } from "@/shared/stores/toast.store";

const toast = useToastStore();

const loading = ref(false);

const errors = ref<Record<string, string[]>>({});

const emit = defineEmits([
  "update:modelValue",
  "created"
]);

defineProps<{
  modelValue: boolean;
}>();
const form = reactive({
  name: "",
});

const submit = async () => {
  loading.value = true;
  errors.value = {}; // reset previous errors

  try {
    await createCategory(form);
    toast.show("Category created successfully", "success");
    emit("created");
    emit("update:modelValue", false);

    // Optional: reset form after success
    Object.assign(form, {
      name: "",
    });

  } catch (error: any) {

    // Check if validation error
    if (error.status === 422 && error.errors) {
      errors.value = error.errors;
    } else {
      toast.show("Unexpected server error", "error");
    }

  } finally {
    loading.value = false;
  }
};
</script>