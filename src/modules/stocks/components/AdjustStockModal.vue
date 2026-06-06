<template>

  <FormModal
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      title="Adjust Stock"
  >
      <p class="text-sm text-gray-500 mb-4">
      Stock adjustments are recorded in movement history.
      </p>
  <Transition name="fade" mode="out-in">
    <div
      v-if="modalLoading"
      class="py-10 flex flex-col items-center justify-center gap-3"
    >
      <div
        class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
      ></div>

      <p class="text-sm text-gray-500">
        Loading stock details...
      </p>
    </div>

    <div v-else class="space-y-5">

      <!-- Current Stock Card -->
<!-- Current Stock -->
<div
  v-if="form.product_id"
  class="border rounded-2xl bg-gray-50 p-4"
>
  <div class="flex items-center justify-between">

    <div>
      <p class="text-sm text-gray-500">
        Current Stock
      </p>

      <p class="text-xs text-gray-400 mt-1">
        Available quantity
      </p>
    </div>

    <div class="text-right">
      <p class="text-2xl font-bold text-blue-600">
        {{ form.quantity }}
      </p>
    </div>

  </div>
</div>

      <!-- Warehouse -->
      <SearchSelect
        v-model="form.warehouse_id"
        :options="warehouses"
        label="Warehouse"
        optionLabel="name"
        placeholder="Select Warehouse"
        :reduce="(b) => b.id"
      />

      <!-- Product -->
      <SearchSelect
        v-model="form.product_id"
        :options="products"
        label="Product"
        optionLabel="name"
        placeholder="Select Product"
        :reduce="(p) => p.id"
        :disabled="!form.warehouse_id"
      />

      <!-- Adjustment Inputs -->
      <div class="grid grid-cols-2 gap-4">

        <SearchSelect
          v-model="form.adjustment_type"
          :options="adjustmentTypes"
          label="Adjustment Type"
          optionLabel="label"
          placeholder="Select Type"
          :reduce="(t) => t.value"
        />

        <FormInput
          v-model="form.adjustment_quantity"
          label="Quantity"
          type="number"
        />

      </div>

      <!-- Adjustment Preview -->
      <div
        v-if="form.adjustment_quantity && form.adjustment_type"
        class="border rounded-xl bg-gray-50 p-4"
      >
        <div class="flex justify-between items-center">

          <span class="text-gray-500">
            New Stock Level
          </span>

          <span
            class="text-lg font-semibold"
            :class="
              form.adjustment_type === 'deduct' &&
              Number(form.quantity) - Number(form.adjustment_quantity) < 0
                ? 'text-red-600'
                : 'text-green-600'
            "
          >
            {{
              form.adjustment_type === 'add'
                ? Number(form.quantity) + Number(form.adjustment_quantity)
                : Number(form.quantity) - Number(form.adjustment_quantity)
            }}
          </span>

        </div>
      </div>

    </div>
  </Transition>

<template #footer>
  <div class="flex justify-between items-center w-full">


    <div class="flex gap-3 justify-end">
      <button
        @click="$emit('update:modelValue', false)"
        class="px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        Cancel
      </button>

      <button
        @click="submit"
        :disabled="submitting"
        class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {{ submitting ? "Saving..." : "Save Adjustment" }}
      </button>
    </div>

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
import type { Warehouse } from "@/types/warehouse";
import { addStock, deductStock } from "../api/stock.api";
import { useToastStore } from "@/shared/stores/toast.store";
import { fetchProducts } from "@/modules/products/api/products.api";
import type { Product } from "@/types/product.type";

const initializing = ref(false);
const submitting = ref(false);
const modalLoading = ref(false);

const toast = useToastStore();

const emit = defineEmits([
  "update:modelValue",
  "created"
]);

const props = defineProps<{
  modelValue: boolean;
  stock?: any;
}>();

const adjustmentTypes = [
  { label: "Add Stock", value: "add" },
  { label: "Deduct Stock", value: "deduct" }
];

const errors = ref<Record<string, string[]>>({});
const warehouses = ref<Warehouse[]>([]);
const products = ref<Product[]>([]);

const form = reactive({
  warehouse_id: "" as number | "",
  product_id: "" as number | "",
  quantity: "" as number | "",
  adjustment_type: "" as "add" | "deduct" | "",
  adjustment_quantity: "" as number | ""
});

const resetForm = () => {
  Object.assign(form, {
    warehouse_id: "",
    product_id: "",
    quantity: "",
    adjustment_type: "",
    adjustment_quantity: "",
  });

  errors.value = {};
};

const loadProducts = async () => {
  const res = await fetchProducts();
  products.value = res.data.data;
};

const loadWarehouses = async () => {
  const res = await fetchWarehouse();
  warehouses.value = res.data.data;
};

onMounted(() => {
  loadWarehouses();
  loadProducts();
});

const {
  stock,
  loading,
  currentPage,
  lastPage,
  loadStocks
} = useStocks();

/**
 * Load stock when editing
 */
watch(
  () => props.stock,
  async (newStock) => {

    if (!newStock) return;

    initializing.value = true;
    modalLoading.value = true;

    try {

      await loadStocks(
        1,
        "",
        newStock.warehouse_id
      );

      form.warehouse_id = Number(newStock.warehouse_id);
      form.product_id = Number(newStock.product_id);
      form.quantity = Number(newStock.quantity);

    } finally {

      modalLoading.value = false;

      setTimeout(() => {
        initializing.value = false;
      }, 0);

    }

  },
  { immediate: true }
);

/**
 * Reset dependent fields when warehouse changes
 */
watch(
  () => form.warehouse_id,
  (newWarehouseId, oldWarehouseId) => {

    if (initializing.value) return;
    if (!oldWarehouseId) return;

    form.product_id = "";
    form.quantity = "";
    form.adjustment_type = "";
    form.adjustment_quantity = "";

  }
);

/**
 * Load stock quantity when product changes
 */
watch(
  () => form.product_id,
  async (productId) => {

    if (!productId || !form.warehouse_id) {
      form.quantity = "";
      return;
    }

    await loadStocks(
      1,
      "",
      Number(form.warehouse_id)
    );

    const selectedStock = stock.value.find(
      s => s.product_id === Number(productId)
    );

    form.quantity = selectedStock
      ? selectedStock.quantity
      : 0;

  }
);

/**
 * Reset form when modal closes
 */
watch(
  () => props.modelValue,
  (isOpen) => {

    if (!isOpen) {
      resetForm();
    }

  }
);

const submit = async () => {

  errors.value = {};

  if (!form.adjustment_quantity) {

    errors.value.adjustment_quantity = [
      "Adjustment quantity is required"
    ];

    toast.show(
      "Adjustment quantity is required",
      "error"
    );

    return;
  }

  if (!form.adjustment_type) {

    errors.value.adjustment_type = [
      "Please select adjustment type"
    ];

    toast.show(
      "Please select adjustment type",
      "error"
    );

    return;
  }

  submitting.value = true;

  try {

    const payload = {
      warehouse_id: Number(form.warehouse_id),
      product_id: Number(form.product_id),
      quantity: Number(form.adjustment_quantity),
    };

    if (form.adjustment_type === "add") {

      await addStock(payload);

      toast.show(
        "Stock added successfully",
        "success"
      );

    }

    if (form.adjustment_type === "deduct") {

      await deductStock(payload);

      toast.show(
        "Stock deducted successfully",
        "success"
      );

    }

    emit("created");
    emit("update:modelValue", false);

    resetForm();

  } catch (error: any) {

    if (error.status === 422) {

      if (error.errors) {
        errors.value = error.errors;
      }

      toast.show(error.message, "error");

    } else {

      toast.show(
        error.message || "Unexpected server error",
        "error"
      );

    }

  } finally {

    submitting.value = false;

  }

};
</script>