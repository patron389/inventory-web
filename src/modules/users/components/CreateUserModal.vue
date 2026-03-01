<template>
  <FormModal
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    title="Create User"
  >
    <!-- Body -->

    <div class="space-y-4">

      <div class="grid grid-cols-2 gap-6">
        <FormInput
          v-model="form.first_name"
          label="First Name"
          :error="errors.first_name"
        />
        <FormInput
          v-model="form.last_name"
          label="Last Name"
          :error="errors.last_name"
        />
      </div>

      <FormInput
        v-model="form.email"
        label="Email"
        type="email"
        :error="errors.email"
      />

      <div class="grid grid-cols-2 gap-6">
        <FormInput
          v-model="form.username"
          label="Username"
          :error="errors.username"
        />

        <FormInput
          v-model="form.phone_no"
          label="Phone no"
          :error="errors.phone_no"
        />
      </div>

      <FormInput
        v-model="form.password"
        label="Password"
        type="password"
        :error="errors.password"
      />

      <FormSelect
        v-model="form.role"
        label="Role"
        :error="errors.role"
      >
        <option value="" disabled>Select Role</option>

        <option
          v-for="role in roles"
          :key="role.id"
          :value="role.name"
        >
          {{ role.name }}
        </option>
      </FormSelect>

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
import type { User, Role } from "@/types/user";
import { reactive, ref, onMounted } from "vue";
import { createUser, fetchRoles } from "../api/users.api";
import { useToastStore } from "@/shared/stores/toast.store";
import FormInput from "@/shared/components/form/FormInput.vue";
import FormSelect from "@/shared/components/form/FormSelect.vue";
import FormModal from "@/shared/components/form/FormModal.vue";
const toast = useToastStore();

const errors = ref<Record<string, string[]>>({});
/**
 * Props
 * modelValue → controls modal visibility (v-model from parent)
 */
defineProps<{
  modelValue: boolean;
}>();


/**
 * Emits
 * update:modelValue → used for closing modal
 * created → notifies parent that user was created successfully
 */
const emit = defineEmits([
  "update:modelValue",
  "created"
]);

/**
 * Reactive form state
 * Mirrors backend create user payload structure
 */
const form = reactive({
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  phone_no: "",
  password: "",
  role: "", // single string
});

/**
 * Loading state
 * Prevents double submission
 * Used to disable button and show feedback
 */
const loading = ref(false);

/**
 * Available roles
 * Populated from backend (Spatie roles)
 */
/**
 * Fetch roles when modal mounts
 * Keeps role list dynamic and backend-driven
 */
const roles = ref<Role[]>([]);

onMounted(async () => {
  const response = await fetchRoles();
  roles.value = response.data.data;
});

/**
 * Submit form handler
 *
 * 1. Sets loading state
 * 2. Calls createUser API
 * 3. Emits "created" event to refresh table
 * 4. Closes modal
 * 5. Resets loading state
 */
const submit = async () => {
  loading.value = true;
  errors.value = {}; // reset previous errors

  try {
    await createUser(form);
    toast.show("User created successfully", "success");
    emit("created");
    emit("update:modelValue", false);

    // Optional: reset form after success
    Object.assign(form, {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      role: "",
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