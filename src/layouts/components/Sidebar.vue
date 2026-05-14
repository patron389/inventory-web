<template>
  <aside
    :class="[
      'bg-white shadow-md flex flex-col transition-all duration-300',
      collapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Logo -->
    <div class="py-6 px-4 font-bold border-b">
      <span v-if="!collapsed">Inventory</span>
      <span v-else>INV</span>
    </div>

    <nav class="text-sm flex-1 p-4 space-y-2">

      <!-- Dashboard -->
       <div class="main py-3 border-b">
        <p v-if="!collapsed" class="text-xs mb-2 font-bold text-neutral-500">Main</p>
        <RouterLink
          to="/dashboard"
          class="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
        >
          <LayoutGrid class="w-4 h-4 text-gray-600" />
          <span v-if="!collapsed">Dashboard</span>
        </RouterLink>
       </div>

      <div class="products py-4 border-b"
        v-if="auth.can('product.view')">
        <p v-if="!collapsed" class="text-xs mb-2 font-bold text-neutral-500">Product Management</p>
        <!-- PRODUCT  -->
        <RouterLink
          v-if="auth.can('product.view')"
          to="/products"
          class="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
        >
          <Box class="w-4 h-4 text-gray-600" />
          <span v-if="!collapsed">Products</span>
        </RouterLink>
        <!-- BRAND  -->
        <RouterLink
          v-if="auth.can('brand.view')"
          to="/brands"
          class="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
        >
          <Sparkle class="w-4 h-4 text-gray-600" />
          <span v-if="!collapsed">Brands</span>
        </RouterLink>
        <!-- CATEGORY  -->
        <RouterLink
          v-if="auth.can('category.view')"
          to="/categories"
          class="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
        >
          <ListOrdered class="w-4 h-4 text-gray-600" />
          <span v-if="!collapsed">Category</span>
        </RouterLink>
      </div>

      <div class="pos-sales py-4 border-b"
        v-if="auth.can('product.view')">
        <p v-if="!collapsed" class="text-xs mb-2 font-bold text-neutral-500">Sales & POS</p>
        <!-- POS Terminal  -->
        <RouterLink
          v-if="auth.can('product.view')"
          to="/pos-terminal"
          class="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
        >
          <Laptop class="w-4 h-4 text-gray-600" />
          <span v-if="!collapsed">POS Terminal</span>
        </RouterLink>
      </div>

      <div class="stock py-4 border-b">
        <p v-if="!collapsed" class="text-xs mb-2 font-bold text-neutral-500">Stock Management</p>
        <RouterLink
          v-if="auth.can('stock.view')"
          to="/stocks"
          class="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
        >
          <LayersPlus class="w-4 h-4 text-gray-600" />
          <span v-if="!collapsed">Stocks</span>
        </RouterLink>
        <RouterLink
          v-if="auth.can('stock.view')"
          to="/stock-transfer"
          class="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
        >
          <FolderSymlink class="w-4 h-4 text-gray-600" />
          <span v-if="!collapsed">Stock Transfer</span>
        </RouterLink>
        <RouterLink
          v-if="auth.can('stock.view')"
          to="/stock-ledger"
          class="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
        >
          <NotebookText class="w-4 h-4 text-gray-600" />
          <span v-if="!collapsed">Stock Ledger</span>
        </RouterLink>
      </div>
      <div class="stock py-4 border-b">
        <p v-if="!collapsed" class="text-xs mb-2 font-bold text-neutral-500">Warehouse Management</p>
        <RouterLink
          v-if="auth.can('warehouse.view')"
          to="/warehouses"
          class="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
        >
          <Store class="w-4 h-4 text-gray-600" />
          <span v-if="!collapsed">Warehouses</span>
        </RouterLink>
      </div>
      <div v-if="auth.can('user.view')" class="users py-4">
        <p v-if="!collapsed" class="text-xs mb-2 font-bold text-neutral-500">User Management</p>
        <RouterLink
          v-if="auth.can('user.view')"
          to="/users"
          class="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100"
        >
          <Users class="w-4 h-4 text-gray-600" />
          <span v-if="!collapsed">Users</span>
        </RouterLink>
      </div>

      <!-- Users -->
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { Sparkle, Users, Box, LayoutGrid, ListOrdered, LayersPlus, Store, FolderSymlink, NotebookText, Laptop } from "lucide-vue-next";

defineProps<{
  collapsed: boolean;
}>();

const auth = useAuthStore();

</script>