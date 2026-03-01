<template>
    <FormModal
  :modelValue="modelValue"
  @update:modelValue="$emit('update:modelValue', $event)"
  title="Edit User"
>
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

<label class="flex items-center gap-3">
  <input
    type="checkbox"
    v-model="form.is_active"
    class="w-5 h-5"
  />
  <span>{{ form.is_active ? 'Active' : 'Inactive' }}</span>
</label>

  </div>

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
import { updateUser, fetchRoles } from "../api/users.api"; // this is the api caller in shorcut
import { useToastStore } from "@/shared/stores/toast.store";
import type { User, Role } from "@/types/user";
import FormModal from "@/shared/components/form/FormModal.vue";
import FormInput from "@/shared/components/form/FormInput.vue";
import FormSelect from "@/shared/components/form/FormSelect.vue";

const props = defineProps<{
  modelValue: boolean;
  user: User | null;
}>();

const emit = defineEmits([
  "update:modelValue",
  "updated"
]);

const toast = useToastStore();

/**
 * Validation errors
 */
const errors = ref<Record<string, string[]>>({});

/**
 * Form state
 */
const form = reactive({
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  phone_no: "",
  role: "",
  is_active: true as boolean,
});

const loading = ref(false);

/**
 * Role list
 */
const roles = ref<Role[]>([]);

onMounted(async () => {
  const response = await fetchRoles();
  roles.value = response.data.data;
});

/**
 * Watch selected user and populate form
 */
watch(
  () => props.user,
  (newUser) => {
    if (!newUser) return;
    console.log("is_active value:", newUser.is_active);
    console.log("type:", typeof newUser.is_active);
    form.first_name = newUser.first_name ?? "";
    form.last_name = newUser.last_name ?? "";
    form.username = newUser.username ?? "";
    form.email = newUser.email ?? "";
    form.phone_no = newUser.phone_no ?? "";

    form.is_active = Boolean(newUser.is_active);

    form.role = newUser.roles?.[0] ?? "";
  },
  { immediate: true }
);

/**
 * Submit update
 */
const submit = async () => {
  if (!props.user) return;

  loading.value = true;
  errors.value = {};

  try {
    await updateUser(props.user.id, form);

    toast.show("User updated successfully", "success");

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