<template>
    <FormModal
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        title="Create User"
    >

    </FormModal>
</template>
<script setup lang="ts">
import FormModal from "@/shared/components/form/FormModal.vue";
import FormInput from "@/shared/components/form/FormInput.vue";
import FormSelect from "@/shared/components/form/FormSelect.vue";
import { useToastStore } from "@/shared/stores/toast.store";
defineProps<{
  modelValue: boolean;
}>();
</script>