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
          {{ loading ? "Creating..." : "Create" }}
        </button>
      </div>
    </template>
    </FormModal>
</template>
<script setup lang="ts">
import { reactive,ref } from "vue";
import { createWarehouse } from "../api/warehouse.api";
import FormModal from "@/shared/components/form/FormModal.vue";
import FormInput from "@/shared/components/form/FormInput.vue";
import FormTextArea from "@/shared/components/form/FormTextArea.vue";
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
  code: "",
  location: "",
  contact_person: "",
  contact_phone: "",
  contact_email: "",
  description: "",
});

const submit = async () => {
  loading.value = true;
  errors.value = {}; // reset previous errors

  try {
    await createWarehouse(form);
    toast.show("Warehouse created successfully", "success");
    emit("created");
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