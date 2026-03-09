<template>
    <FormModal
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        title="Adjust Stock"
    >
    
    <div class="space-y-4">
        <SearchSelect
        v-model="form.warehouse_id"
        :options="warehouses"
        label="Warehouse"
        optionLabel="name"
        placeholder="Select Warehouse"
        :reduce="(b) => b.id"
        />
        <SearchSelect
          v-model="form.product_id"
          :options="stock"
          label="Product"
          optionLabel="product_name"
          placeholder="Select Product"
          :reduce="(c) => c.product_id"
          :disabled="!form.warehouse_id"
        />
      <div class="grid grid-cols-2 gap-6">

        <FormInput
        v-model="form.quantity"
        label="Current quantity"
        :error="errors.quantity"
        readonly
        />
      <SearchSelect
        v-model="form.adjustment_type"
        :options="adjustmentTypes"
        label="Adjustment Type"
        optionLabel="label"
        placeholder="Select Type"
        :reduce="(t) => t.value"
      />
      </div>
      <FormInput
        v-model="form.adjustment_quantity"
        label="Adjustment Quantity"
        :error="errors.adjustment_quantity"
        type="number"
      />
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
          {{ loading ? "Submitting..." : "Submit" }}
        </button>
      </div>
    </template>
    </FormModal>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, watch } from "vue";
import { fetchWarehouse } from "@/modules/warehouse/api/warehouse.api";
import FormModal from "@/shared/components/form/FormModal.vue";
import { useStocks } from "../composables/useStocks";
import SearchSelect from "@/shared/components/form/SearchSelect.vue";
import FormInput from "@/shared/components/form/FormInput.vue";
import type { Warehouse } from "@/types/warehouse"
import {addStock, deductStock} from "../api/stock.api";
import { useToastStore } from "@/shared/stores/toast.store";
const toast = useToastStore();
const emit = defineEmits([
  "update:modelValue",
  "created"
]);
const adjustmentTypes = [
  { label: "Add Stock", value: "add" },
  { label: "Deduct Stock", value: "deduct" }
]
const errors = ref<Record<string, string[]>>({});
const warehouses = ref<Warehouse[]>([])

  // Load warehouse list for filter dropdown
const loadWarehouses = async () => {
  const res = await fetchWarehouse()

  // Paginated response → warehouses are inside data.data
  warehouses.value = res.data.data
}
onMounted(() => {
  loadWarehouses()
})



const { stock, loading, currentPage, lastPage, loadStocks } = useStocks();

defineProps<{
  modelValue: boolean;
}>();
const form = reactive({
  warehouse_id: "" as number | "",
  product_id: "" as number | "",
  quantity: "" as number | "",
  adjustment_type: "" as "add" | "deduct" | "",
  adjustment_quantity: "" as number | ""
});
watch(() => form.warehouse_id, (warehouseId) => {
  form.product_id = ""
  form.quantity = ""
  if (warehouseId) {
    loadStocks(1, "", warehouseId)
    
  }
})

watch(() => form.product_id, (productId) => {
  const selectedStock = stock.value.find(
    s => s.product_id === productId
  )

  if (selectedStock) {
    form.quantity = selectedStock.quantity
  }
})

const submit = async () => {
  loading.value = true;
  errors.value = {}; // reset previous errors

  try {

    if (!form.adjustment_type) {
      errors.value.adjustment_type = ["Please select adjustment type"];
      return;
    }

    const payload = {
      warehouse_id: Number(form.warehouse_id),
      product_id: Number(form.product_id),
      quantity: Number(form.adjustment_quantity),
    };

    if (form.adjustment_type === "add") {
      await addStock(payload);
      toast.show("Stock added successfully", "success");
    }

    if (form.adjustment_type === "deduct") {
      await deductStock(payload);
      toast.show("Stock deducted successfully", "success");
    }

    emit("created");
    emit("update:modelValue", false);

    // Reset form after success
    Object.assign(form, {
      warehouse_id: "",
      product_id: "",
      quantity: "",
      adjustment_type: "",
      adjustment_quantity: "",
    });

  } catch (error: any) {

    // Laravel validation error
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