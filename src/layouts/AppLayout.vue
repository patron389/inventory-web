<template>
  
  <div class="flex h-screen bg-gray-100">
    <ToastContainer />
    <!-- Sidebar -->
    <Sidebar
      v-if="showSidebar"
      :collapsed="collapsed"
    />

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
import ToastContainer from "@/shared/components/ToastContainer.vue";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "@/layouts/components/Sidebar.vue";
import Topbar from "@/layouts/components/Topbar.vue";
const collapsed = ref(false);

const route = useRoute();

const showSidebar = computed(() => {
  return !route.meta.hideSidebar;
});

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};
</script>