<template>
  <div class="flex h-screen bg-gray-100">

    <!-- Sidebar -->
    <Sidebar :collapsed="collapsed" />

    <!-- Main content area -->
    <div class="flex flex-col flex-1">

      <!-- Topbar -->
      <Topbar @toggle-sidebar="toggleSidebar" />

      <!-- Page content -->
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "@/layouts/components/Sidebar.vue";
import Topbar from "@/layouts/components/Topbar.vue";
const collapsed = ref(false);

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};
</script>