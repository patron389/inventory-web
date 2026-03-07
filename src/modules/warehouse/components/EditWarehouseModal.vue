<template>
    <FormModal
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        title="Create Warehouse"
    >
    
    <div class="space-y-4">
        <div class="grid grid-cols-2 gap-6">
            <FormInput
            v-model="form.name"
            label="Warehouse Name"
            :error="errors.name"
            />
            <FormInput
            v-model="form.code"
            label="Code"
            :error="errors.name"
            />
        </div>

        <FormInput
        v-model="form.location"
        label="Location"
        :error="errors.name"
        />
        <FormInput
        v-model="form.contact_person"
        label="Contact Person"
        :error="errors.contact_person"
        />
        <div class="grid grid-cols-2 gap-6">
            <FormInput
            v-model="form.contact_phone"
            label="Phone No."
            :error="errors.contact_phone"
            />
            <FormInput
            v-model="form.contact_email"
            label="Email"
            :error="errors.contact_email"
            />
        </div>
        <FormTextArea
        v-model="form.description"
        label="Description"
        :error="errors.description"
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
import { reactive,ref, watch } from "vue";
import { updateWarehouse } from "../api/warehouse.api";
import FormModal from "@/shared/components/form/FormModal.vue";
import FormInput from "@/shared/components/form/FormInput.vue";
import FormTextArea from "@/shared/components/form/FormTextArea.vue";
import { useToastStore } from "@/shared/stores/toast.store";
import type { Warehouse } from "@/types/warehouse";

const toast = useToastStore();
const loading = ref(false);

const errors = ref<Record<string, string[]>>({});

const props = defineProps<{
  modelValue: boolean;
  warehouse: Warehouse | null;
}>();

const emit = defineEmits([
  "update:modelValue",
  "updated"
]);


const form = reactive({
  name: "",
  code: "",
  location: "",
  contact_person: "",
  contact_phone: "",
  contact_email: "",
  description: "",
  is_active: true as boolean,
});

watch(
  () => props.warehouse,
  (newWarehouse) => {
    if (!newWarehouse) return;
    console.log("is_active value:", newWarehouse.is_active);
    console.log("type:", typeof newWarehouse.is_active);
    form.name = newWarehouse.name ?? "";
    form.code = newWarehouse.code ?? "";
    form.location = newWarehouse.location ?? "";
    form.contact_phone = newWarehouse.contact_phone ?? "";
    form.contact_person = newWarehouse.contact_person ?? "";
    form.contact_email = newWarehouse.contact_email ?? "";
    form.description = newWarehouse.description ?? "";
    form.is_active = Boolean(newWarehouse.is_active);
  },
  { immediate: true }
);
const submit = async () => {
  if (!props.warehouse) return;
  loading.value = true;
  errors.value = {}; // reset previous errors

  try {
    await updateWarehouse(props.warehouse.id, form);
    toast.show("Warehouse updated successfully", "success");
    emit("updated");
    emit("update:modelValue", false);

    // Optional: reset form after success
    Object.assign(form, {
        name: "",
        code: "",
        location: "",
        contact_person: "",
        contact_phone: "",
        contact_email: "",
        description: "",
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