<template>
  <!-- Full Screen Loader -->
  <div
    v-if="pageLoading"
    class="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
  >
    <div
      class="w-14 h-14 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
    ></div>

    <p class="mt-4 text-sm text-gray-500">
      Loading POS...
    </p>
  </div>
    <!-- POS CONTENT -->

  <div v-else class="grid grid-cols-12 h-full gap-6">

    <!-- Products -->
    <div class="col-span-8 p-6 flex flex-col">

      <div class="mt-4">
        <h3 class="text-lg font-semibold mb-2">
          Categories
        </h3>
        <!-- Loading -->
        <div
          v-if="loadingFilters"
          class="flex flex-wrap gap-3"
        >
          <div
            v-for="n in 8"
            :key="n"
            class="w-20 h-12 bg-white border rounded-xl animate-pulse"
          >
          </div>
        </div>
        <!-- CATEGORIES   -->
        <div v-else class="flex flex-wrap gap-2">
          <button
            class="bg-white px-6 py-3 text-sm border rounded-lg hover:border-blue-500"
          >
            All
          </button>

          <button
            v-for="category in categories"
            :key="category.id"
            class=" bg-white px-6 py-3 text-sm border rounded-lg hover:border-blue-500"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- BRANDS -->
      <div class="mt-4">
          <h3 class="text-lg font-medium mb-2">
            Brands
          </h3>

          <!-- Loading -->
          <div
            v-if="loadingFilters"
            class="flex flex-wrap gap-3"
          >
            <div
              v-for="n in 12"
              :key="n"
              class="w-24 h-24 bg-white border rounded-xl animate-pulse"
            >
            </div>
          </div>

          <!-- Brands -->
          <div
            v-else
            class="flex flex-wrap gap-3"
          >
            <!-- All -->
            <button
              class="flex flex-col items-center justify-center bg-white w-24 h-24 border rounded-xl hover:border-blue-500"
            >
              <div
                class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"
              >
                All
              </div>

              <span class="mt-2 text-xs">
                All
              </span>
            </button>

            <!-- Brand List -->
            <button
              v-for="brand in brands"
              :key="brand.id"
              class="flex flex-col items-center justify-center bg-white w-24 h-24 border rounded-xl hover:border-blue-500"
            >
              <img
                v-if="brand.image"
                :src="brand.image"
                :alt="brand.name"
                class="w-12 h-12 object-contain"
              />

              <div
                v-else
                class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs"
              >
                N/A
              </div>

              <span class="mt-2 text-xs text-center line-clamp-2">
                {{ brand.name }}
              </span>
            </button>
          </div>
      </div>

      <!-- PRODUCT LISTS -->
      <div class="mt-4">
        <h1 class="text-lg font-semibold">Products</h1>
      </div>

      <div
        v-if="loading"
        class="grid grid-cols-4 gap-4 mt-4"
      >
        <div
          v-for="n in 8"
          :key="n"
          class="bg-white border rounded-xl p-3 animate-pulse"
        >
          <div class="h-64 bg-gray-200 rounded-lg mb-3"></div>

          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <div
        v-else-if="products.length === 0"
        class="flex-1 flex flex-col items-center justify-center py-20"
      >
        <div class="text-6xl mb-4">📦</div>

        <h3 class="text-lg font-semibold">
          No products found
        </h3>

        <p class="text-sm text-gray-500 mt-1">
          Try changing category, brand, or search filters.
        </p>
      </div>

      <div
        v-else
        class="mt-4 flex-1 overflow-auto"
      >
        <div class="grid grid-cols-4 gap-4">

          <div
            v-for="product in products"
            :key="product.id"
            class="group bg-white border rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-lg hover:ring-2 hover:ring-blue-100 transition-all duration-200 cursor-pointer"
          >
            <!-- Image -->
            <div class="relative h-44 bg-gray-50 border-b">

              <div class="w-full h-full flex items-center justify-center">
                Product Image
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">

              <h4 class="font-semibold line-clamp-2 ">
                {{ product.product_name }}
              </h4>

              <p class="text-xs text-gray-400 mt-1">
                SKU: {{ product.sku }}
              </p>

              <div class="mt-4 flex items-center justify-between">

                <div>
                  <p class="text-xl font-bold text-blue-600">
                    ₱{{ Number(product.price).toLocaleString() }}
                  </p>

                  <span
                    class="text-xs font-medium"
                    :class="
                      product.quantity <= 0
                        ? 'text-red-600'
                        : product.quantity < 10
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    "
                  >
                  
                    {{
                      product.quantity <= 0
                        ? 'Out of Stock'
                        : product.quantity < 10
                        ? 'Low Stock'
                        : 'In Stock'
                    }}
                  </span>
                </div>

                <button
                  class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition"
                >
                  +
                </button>

              </div>

            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Cart -->
    <div class="col-span-4 bg-white border p-4 flex flex-col">

      <div class="mb-4">
        <h2 class="text-xl font-semibold">Cart</h2>
      </div>

      <div class="flex-1 overflow-auto">
        Cart Items Here
      </div>

      <div class="border-t pt-4 mt-4">
        <div class="flex justify-between mb-2">
          <span>Items</span>
          <span>0</span>
        </div>

        <div class="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₱0.00</span>
        </div>

        <button
          class="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Checkout
        </button>
      </div>

    </div>

  </div>


</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useCartStore } from "../store/cart.store";
import { usePosFilters } from "../composables/usePosFilters";
import { usePosStocks } from "../composables/usePosStocks";

const cart = useCartStore();

const {
  products,
  loadProducts,
  loading
} = usePosStocks();

const {
  brands,
  categories,
  loadingFilters,
  selectedBrand,
  selectedCategory,
  loadFilters,
} = usePosFilters();

const pageLoading = computed(() => {
  return loading.value || loadingFilters.value;
});

onMounted(() => {
  loadProducts();
  loadFilters();
});
</script>