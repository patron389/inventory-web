<template>
  <FormModal
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      title="Create Products"
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
        Loading product details...
      </p>
    </div>

    <div v-else class="space-y-4">
        <FormInput
          v-model="form.name"
          label="Product Name"
          :error="errors.name"
        />
      <div class="grid grid-cols-2 gap-6">
          <SearchSelect
          v-model="form.category_id"
          :options="categories"
          label="Category"
          optionLabel="name"
          placeholder="Select a Category"
          :reduce="(c) => c.id"
          :error="errors.category_id"
          />
          <SearchSelect
          v-model="form.brand_id"
          :options="brands"
          label="Brand"
          optionLabel="name"
          placeholder="Select a Brand"
          :reduce="(b) => b.id"
          :error="errors.brand_id"
          />
      </div>
        <!-- <FormInput
          v-model="form.sku"
          label="SKU"
          :error="errors.sku"
        /> -->

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">
          SKU
        </label>

        <div class="flex">
          <input
            v-model="form.sku"
            type="text"
            class="w-full border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div></div>
          <button
            type="button"
            :disabled="!form.category_id || !form.brand_id"
            @click="generateSku"
            class="px-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r hover:bg-gray-300"
          >
            Generate
          </button>
        </div>

        <p
          v-if="errors.sku"
          class="text-sm text-red-600"
        >
          {{ errors.sku[0] }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-6">
          <FormInput
            v-model="form.price"
            label="Price"
            type="number"
            :error="errors.price"
          />
          <FormInput
            v-model="form.unit"
            label="Unit"
            :error="errors.unit"
          />
      </div>
      <FormTextArea
        v-model="form.description"
        label="Description"
        :error="errors.description"
      />
    </div>
  </Transition>

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
        {{ loading ? "Updating..." : "Update" }}
      </button>
    </div>
  </template>
  </FormModal>
</template>
<script setup lang="ts">
import type { Product } from "@/types/product.type";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";
import { fetchBrands } from "@/modules/brands/api/brands.api";
import { fetchCategory } from "@/modules/category/api/category.api";
import { reactive, ref, onMounted, watch } from "vue";
import {updateProduct} from "../api/products.api";
import FormModal from "@/shared/components/form/FormModal.vue";
import FormInput from "@/shared/components/form/FormInput.vue";
import FormTextArea from "@/shared/components/form/FormTextArea.vue";
import SearchSelect from "@/shared/components/form/SearchSelect.vue";
import { useToastStore } from "@/shared/stores/toast.store";
const generateSku = () => {

  // find selected category
  const category = categories.value.find(
    c => c.id === form.category_id
  );

  // find selected brand
  const brand = brands.value.find(
    b => b.id === form.brand_id
  );

  // fallback if not selected
  const categoryCode = category
    ? category.name.substring(0,3).toUpperCase()
    : "GEN";

  const brandCode = brand
    ? brand.name.substring(0,3).toUpperCase()
    : "GEN";

  // random code
  const random = Math.random()
    .toString(36)
    .substring(2,6)
    .toUpperCase();

  form.sku = `${categoryCode}-${brandCode}-${random}`;
};
const props = defineProps<{
  modelValue: boolean;
  product: Product | null;
}>();
const modalLoading = ref(false)
const toast = useToastStore();

const loading = ref(false);
const errors = ref<Record<string, string[]>>({});

const emit = defineEmits([
  "update:modelValue",
  "updated"
]);

const categories = ref<Category[]>([]);
const brands = ref<Brand[]>([]);

onMounted(async () => {
  try {
    const [categoryRes, brandRes] = await Promise.all([
      fetchCategory(),
      fetchBrands()
    ]);

    categories.value = categoryRes.data.data;
    brands.value = brandRes.data.data;

  } catch (error) {
    console.error(error);
  }
});
const form = reactive({
  name: "",
  category_id: null as number | null,
  brand_id: null as number | null,
  sku: "",
  unit: "",
  description: "",
  price: null as number | null,
  is_active: true as boolean,
});

watch(
  () => props.product,
  async (p) => {

    if (!p) return

    modalLoading.value = true

    try {

      // optional fake delay for smoother UX
      await new Promise(resolve => setTimeout(resolve, 300))

      form.name = p.name ?? ""
      form.category_id = p.category_id ?? null
      form.brand_id = p.brand_id ?? null
      form.sku = p.sku ?? ""
      form.unit = p.unit ?? ""
      form.description = p.description ?? ""
      form.price = p.price ?? null
      form.is_active = Boolean(p.is_active)

    } finally {

      modalLoading.value = false

    }

  },
  { immediate: true }
)

const submit = async () => {
  loading.value = true;
  errors.value = {}; // reset previous errors

  try {
    await updateProduct(props.product!.id, {
      ...form,
      category_id: Number(form.category_id),
      brand_id: Number(form.brand_id),
      price: Number(form.price),
    });
    toast.show("Product updated successfully", "success");
    emit("updated");
    emit("update:modelValue", false);

    // Optional: reset form after success
    Object.assign(form, {
      name: "",
      category_id: "",
      brand_id: "",
      sku: "",
      unit: "",
      description: "",
      price: "",
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