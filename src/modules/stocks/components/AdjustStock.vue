<template>
    <FormModal
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        title="Adjust Stock"
    >
    
    <div class="space-y-4">

    </div>
    
    </FormModal>
</template>
<script setup lang="ts">
import FormModal from "@/shared/components/form/FormModal.vue";
import FormInput from "@/shared/components/form/FormInput.vue";
defineProps<{
  modelValue: boolean;
}>();

</script>