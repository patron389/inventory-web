<template>
  <header class="bg-white shadow px-6 py-4 flex justify-between items-center">

    <!-- Left: Burger menu -->
    <button
      @click="$emit('toggle-sidebar')"
      class="p-2 rounded hover:bg-gray-100"
    >
      <Menu class="w-5 h-5" />
    </button>

    <!-- Right: Logout -->
    <button
      @click="logout"
      class="text-sm text-red-600 hover:underline"
    >
      Logout
    </button>

  </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { Menu } from "lucide-vue-next";

defineEmits(["toggle-sidebar"]);


const router = useRouter();
const auth = useAuthStore();

const logout = async () => {
  await auth.logout();
  router.push("/login");
};
</script>