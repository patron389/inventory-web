<template>
    <FormModal
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        title="Stock Transfer"
    >
<div class="space-y-4">
  <!-- Warehouses -->

    <SearchSelect
      v-model="form.from_warehouse_id"
      :options="warehouses"
      label="From Warehouse"
      optionLabel="name"
      placeholder="Select Source Warehouse"
      :reduce="(w) => w.id"
    />

    <SearchSelect
      v-model="form.to_warehouse_id"
      :options="warehouses"
      label="To Warehouse"
      optionLabel="name"
      placeholder="Select Destination Warehouse"
      :reduce="(w) => w.id"
    />


  <div
    v-for="(item, index) in form.items"
    :key="index"
    class="grid grid-cols-2 gap-4 items-end"
  >

    <SearchSelect
    class="col-span-2"
      v-model="item.product_id"
      :options="form.from_warehouse_id ? availableProducts : []"
      label="Select Product"
      optionLabel="product_name"
      placeholder="Select Product"
      :reduce="(p) => p.product_id"
      :disabled="!form.from_warehouse_id"
      @update:modelValue="updateStock(item)"
    >
    <template #option="{ option }">
      <div class="px-3 py-2 hover:bg-gray-100">
        {{ option.product_name }} ({{ option.quantity }})
      </div>
    </template>
    </SearchSelect>

    <FormInput
      v-model="item.current_stock"
      label="Stock"
      readonly
    />

    <FormInput
      v-model="item.quantity"
      label="Transfer"
      type="number"
      :max="item.current_stock"
      :min="1"
    />

    <button
      v-if="form.items.length > 1"
      @click="removeItem(index)"
      class="text-red-500 text-sm"
    >
      Remove
    </button>

  </div>

  <button
    @click="addItem"
    class="text-blue-600 text-sm"
  >
    + Add Product
  </button>

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
      :disabled="submitting"
      class="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {{ submitting ? "Submitting..." : "Submit" }}
    </button>

  </div>
</template>
    </FormModal>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from "vue";
import { createTransfer } from "../api/stock.api";
import SearchSelect from "@/shared/components/form/SearchSelect.vue";
import { useStocks } from "../composables/useStocks";
import FormInput from "@/shared/components/form/FormInput.vue";
import FormModal from "@/shared/components/form/FormModal.vue";
import { fetchWarehouse } from "@/modules/warehouse/api/warehouse.api";
import type { Warehouse } from "@/types/warehouse"
import { useToastStore } from "@/shared/stores/toast.store";
import type { Product } from "@/types/product.type"
import { fetchProducts } from "@/modules/products/api/products.api";
const toast = useToastStore();
const submitting = ref(false)
const warehouses = ref<Warehouse[]>([])
const errors = ref<Record<string, string[]>>({});
const loadWarehouses = async () => {
  const res = await fetchWarehouse()

  // Paginated response → warehouses are inside data.data
  warehouses.value = res.data.data
}
const products = ref<Product[]>([])
const loadProducts = async () => {
  const res = await fetchProducts()
  products.value = res.data.data
}
const emit = defineEmits([
  "update:modelValue",
  "created"
]);
defineProps<{
  modelValue: boolean;
}>()



const form = reactive({
  from_warehouse_id: "" as number | "",
  to_warehouse_id: "" as number | "",
  items: [
    {
      product_id: "" as number | "",
      current_stock: 0,
      quantity: "" as number | ""
    }
  ]
});


const availableProducts = computed(() => {
  return stock.value
})

const addItem = () => {
  form.items.push({
    product_id: "",
    current_stock: 0,
    quantity: ""
  });
};

const removeItem = (index: number) => {
  form.items.splice(index, 1);
};
const { stock, loading, currentPage, lastPage, loadStocks } = useStocks();

watch(() => form.from_warehouse_id, async (warehouseId) => {

  form.items.forEach(item => {
    item.product_id = ""
    item.current_stock = 0
    item.quantity = ""
  })

  if (warehouseId) {
    await loadStocks(1, "", warehouseId)
  }

})

const updateStock = (item:any) => {

  const selectedStock = stock.value.find(
    s => s.product_id === item.product_id
  )

  item.current_stock = selectedStock ? selectedStock.quantity : 0

}
onMounted(() => {
  loadWarehouses()
  loadProducts()
})


const submit = async () => {
  submitting.value = true;
  errors.value = {}; // reset previous errors

  try {

    if (!form.from_warehouse_id) {
      errors.value.from_warehouse_id = ["Please select source warehouse"];
      return;
    }

    if (!form.to_warehouse_id) {
      errors.value.to_warehouse_id = ["Please select destination warehouse"];
      return;
    }

    if (form.from_warehouse_id === form.to_warehouse_id) {
      errors.value.to_warehouse_id = ["Cannot transfer to the same warehouse"];
      return;
    }

    if (!form.items.length) {
      errors.value.items = ["Please add at least one product"];
      return;
    }

    const payload = {
      from_warehouse_id: Number(form.from_warehouse_id),
      to_warehouse_id: Number(form.to_warehouse_id),
      items: form.items.map(i => ({
        product_id: Number(i.product_id),
        quantity: Number(i.quantity)
      }))
    };

    await createTransfer(payload);

    toast.show("Stock transfer completed successfully", "success");

    emit("created");
    emit("update:modelValue", false);

    // Reset form
    Object.assign(form, {
      from_warehouse_id: "",
      to_warehouse_id: "",
      items: [
        {
          product_id: "",
          current_stock: 0,
          quantity: ""
        }
      ]
    });

  } catch (error: any) {

    // Laravel validation error
    if (error.status === 422 && error.errors) {
      errors.value = error.errors;
    } else {
      toast.show(error.message || "Unexpected server error", "error");
    }

  } finally {
    submitting.value = false;
  }
};
</script>