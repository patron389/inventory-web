<template>
  <aside
    :class="[
      'bg-white shadow-md flex flex-col transition-all duration-300',
      collapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Logo -->
    <div class="p-6 font-bold border-b">
      <span v-if="!collapsed">Inventory</span>
      <span v-else>INV</span>
    </div>

    <nav class="flex-1 p-4 space-y-2">

      <!-- Dashboard -->
      <RouterLink
        to="/dashboard"
        class="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-100"
      >
        <LayoutDashboard class="w-5 h-5" />
        <span v-if="!collapsed">Dashboard</span>
      </RouterLink>

      <!-- Users -->
      <RouterLink
        v-if="auth.can('user.view')"
        to="/users"
        class="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-100"
      >
        <Users class="w-5 h-5" />
        <span v-if="!collapsed">Users</span>
      </RouterLink>

    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { LayoutDashboard, Users } from "lucide-vue-next";

defineProps<{
  collapsed: boolean;
}>();

const auth = useAuthStore();

</script>