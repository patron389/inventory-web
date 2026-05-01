<template>
    <FormModal
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        title="Stock Transfer"
    >
<div class="space-y-4 max-h-[50vh]">
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
      :options="warehouses.filter(w => w.id !== form.from_warehouse_id)"
      label="To Warehouse"
      optionLabel="name"
      placeholder="Select Destination Warehouse"
      :reduce="(w) => w.id"
    />


  <div
    v-for="(item, index) in form.items"
    :key="index"
    class="grid grid-cols-[1.3fr_0.3fr_0.3fr_0.1fr] gap-4 items-center"
  >

    <SearchSelect
      v-model="item.product_id"
      :options="form.from_warehouse_id ? filteredProducts(item.product_id) : []"
      :label="`Select Product ${index + 1}`"
      optionLabel="product_name"
      placeholder="Select Product"
      :reduce="(p) => p.product_id"
      :disabled="!form.from_warehouse_id"
      appendTo="body"
      @update:modelValue="updateStock(item)"
    />


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
      class="text-red-500"
    >
      <Trash2 :size="18" />
    </button>

  </div>

  <button
    v-if="canAddItem"
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
import {
  Edit,
  Trash2
} from "lucide-vue-next";
const toast = useToastStore();

const submitting = ref(false)

const warehouses = ref<Warehouse[]>([])

const errors = ref<Record<string, string[]>>({});

const canAddItem = computed(() => {
  return !!form.from_warehouse_id && form.items.length < stock.value.length
})

const loadWarehouses = async () => {
  const res = await fetchWarehouse()

  // Paginated response → warehouses are inside data.data
  warehouses.value = res.data.data
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


const filteredProducts = (currentProductId: number | "") => {
  const selectedIds = form.items
    .map(i => i.product_id)
    .filter(id => id && id !== currentProductId)

  return stock.value.filter(p => !selectedIds.includes(p.product_id))
}
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
const { stock, loadStocks } = useStocks();

watch(() => form.from_warehouse_id, async (warehouseId) => {

  // reset items
  form.items = [
    {
      product_id: "",
      current_stock: 0,
      quantity: ""
    }
  ]

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