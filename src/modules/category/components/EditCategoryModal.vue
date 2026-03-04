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
          {{ loading ? "Updating..." : "Update" }}
        </button>
      </div>
    </template>
    </FormModal>
</template>
<script setup lang="ts">
import { reactive, ref, watch, onMounted } from "vue";
import { updateCategory } from "../api/category.api";
import type { Category } from "@/types/category";
import FormModal from "@/shared/components/form/FormModal.vue";
import FormInput from "@/shared/components/form/FormInput.vue";
import { useToastStore } from "@/shared/stores/toast.store";

const toast = useToastStore();

const loading = ref(false);

const errors = ref<Record<string, string[]>>({});

const props = defineProps<{
  modelValue: boolean;
  category: Category | null;
}>();

const emit = defineEmits([
  "update:modelValue",
  "updated"
]);


const form = reactive({
  name: "",
  is_active: true as boolean,
});
watch(
  () => props.category,
  (newCategory) => {
    if (!newCategory) return;
    console.log("is_active value:", newCategory.is_active);
    console.log("type:", typeof newCategory.is_active);
    form.name = newCategory.name ?? "";
    form.is_active = Boolean(newCategory.is_active);
  },
  { immediate: true }
);
const submit = async () => {
  if (!props.category) return;
  loading.value = true;
  errors.value = {}; // reset previous errors

  try {
    await updateCategory(props.category.id, form);
    toast.show("Category updated successfully", "success");
    emit("updated");
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