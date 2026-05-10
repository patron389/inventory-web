<template>

  <FormModal
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      title="Adjust Stock"
  >
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

    <div v-else class="space-y-4">
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
            :options="products"
            label="Product"
            optionLabel="name"
            placeholder="Select Product"
            :reduce="(p) => p.id"
            :disabled="!form.warehouse_id"
          />
          <div class="grid grid-cols-[1.2fr,.4fr,.4fr] gap-6">
          <SearchSelect
            v-model="form.adjustment_type"
            :options="adjustmentTypes"
            label="Adjustment Type"
            optionLabel="label"
            placeholder="Select Type"
            :reduce="(t) => t.value"
          />
            <FormInput
            v-model="form.quantity"
            label="Cur. Qty"

            readonly
            />

          <FormInput
            v-model="form.adjustment_quantity"
            label="Adj. Qty"

            type="number"
          />
          </div>

        </div>

    </div>
  </Transition>

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
            :disabled="submitting"
            class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {{ submitting ? "Submitting..." : "Submit" }}
          </button>
        </div>
    </template>
    
  </FormModal>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from "vue";
import { fetchWarehouse } from "@/modules/warehouse/api/warehouse.api";
import FormModal from "@/shared/components/form/FormModal.vue";
import { useStocks } from "../composables/useStocks";
import SearchSelect from "@/shared/components/form/SearchSelect.vue";
import FormInput from "@/shared/components/form/FormInput.vue";
import type { Warehouse } from "@/types/warehouse"
import {addStock, deductStock} from "../api/stock.api";
import { useToastStore } from "@/shared/stores/toast.store";
import { fetchProducts } from "@/modules/products/api/products.api";
import type { Product } from "@/types/product.type"
const submitting = ref(false)
const toast = useToastStore();
const emit = defineEmits([
  "update:modelValue",
  "created"
]);
const modalLoading = ref(false)
const adjustmentTypes = [
  { label: "Add Stock", value: "add" },
  { label: "Deduct Stock", value: "deduct" }
]
const errors = ref<Record<string, string[]>>({});
const warehouses = ref<Warehouse[]>([])
const products = ref<Product[]>([])


const props = defineProps<{
  modelValue: boolean;
  stock?: any;
}>();


const loadProducts = async () => {
  const res = await fetchProducts()

  // Products are inside paginated response
  products.value = res.data.data
}
  // Load warehouse list for filter dropdown
const loadWarehouses = async () => {
  const res = await fetchWarehouse()

  // Paginated response → warehouses are inside data.data
  warehouses.value = res.data.data
}
onMounted(() => {
  loadWarehouses()
  loadProducts()
})


const { stock, loading, currentPage, lastPage, loadStocks } = useStocks();


const form = reactive({
  warehouse_id: "" as number | "",
  product_id: "" as number | "",
  quantity: "" as number | "",
  adjustment_type: "" as "add" | "deduct" | "",
  adjustment_quantity: "" as number | ""
});



watch(
  () => props.stock,
  async (newStock) => {

    if (!newStock) return

    modalLoading.value = true

    try {

      await loadStocks(1, "", newStock.warehouse_id)

      form.warehouse_id = Number(newStock.warehouse_id)
      form.product_id = Number(newStock.product_id)
      form.quantity = Number(newStock.quantity)

    } finally {
      modalLoading.value = false
    }

  },
  { immediate: true }
)

watch(
  () => form.product_id,
  (productId) => {

    if (!productId) {
      form.quantity = ""
      return
    }

    const selectedStock = stock.value.find(
      s => s.product_id === productId
    )

    form.quantity = selectedStock
      ? selectedStock.quantity
      : 0

  }
)

const submit = async () => {

  errors.value = {};

  // Validation
  if (!form.adjustment_quantity) {
    errors.value.adjustment_quantity = [
      "Adjustment quantity is required"
    ]

    toast.show(
      "Adjustment quantity is required",
      "error"
    )

    return
  }

  if (!form.adjustment_type) {
    errors.value.adjustment_type = [
      "Please select adjustment type"
    ]

    toast.show(
      "Please select adjustment type",
      "error"
    )

    return
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

    // Reset form
    Object.assign(form, {
      warehouse_id: "",
      product_id: "",
      quantity: "",
      adjustment_type: "",
      adjustment_quantity: "",
    });

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