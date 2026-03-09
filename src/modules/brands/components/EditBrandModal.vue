<template>
<FormModal
:modelValue="modelValue"
@update:modelValue="$emit('update:modelValue', $event)"
title="Edit Brand"
>
    <div class="space-y-4">

        <FormInput
        v-model="form.name"
        label="Brand Name"
        :error="errors.name"
        />

        <div>
        <label class="block text-sm font-medium mb-1">
            Brand Image
        </label>

        <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="border rounded px-3 py-2 w-full"
        />

        <p v-if="errors.image" class="text-sm text-red-500 mt-1">
            {{ errors.image[0] }}
        </p>
        </div>
        <div v-if="imagePreview" class="mt-4">
        <p class="text-sm text-gray-500 mb-2">Preview:</p>

        <img
            :src="imagePreview"
            class="w-32 h-32 object-cover rounded-md border"
        />
        </div>

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
import { reactive, ref, onMounted, watch } from "vue";
import { createBrand, updateBrand } from "../api/brands.api";
import { useToastStore } from "@/shared/stores/toast.store";
import type { Brand } from "@/types/brand";
import FormInput from "@/shared/components/form/FormInput.vue";
import FormModal from "@/shared/components/form/FormModal.vue";
const loading = ref(false);
const toast = useToastStore();
const errors = ref<Record<string, string[]>>({});
const props = defineProps<{
  modelValue: boolean;
  brand: Brand | null;
}>();

const form = reactive({
  name: "",
  image: null as File | null,
});


const emit = defineEmits(["update:modelValue", "updated"]);

const imagePreview = ref<string | null>(null);

// Handle file change
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (target.files && target.files[0]) {
    form.image = target.files[0];

    // Generate preview URL
    imagePreview.value = URL.createObjectURL(form.image);
  }
};

watch(
  () => props.brand,
  (brand) => {
    if (brand) {
      form.name = brand.name;
      imagePreview.value = brand.image ?? null;
      form.image = null;
    }
  },
  { immediate: true }
);


const submit = async () => {
  if (!props.brand) return;
  loading.value = true;
  errors.value = {};

  try {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("is_active", "1");
    if (form.image) {
      formData.append("image", form.image);
    }

    await updateBrand(props.brand.id, formData);

    toast.show("Brand updated successfully", "success");

    emit("updated");
    emit("update:modelValue", false);

  } catch (error: any) {
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