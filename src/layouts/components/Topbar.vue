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
    <div class="relative user-menu">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 px-4 py-2 text-sm hover:text-blue-600"
      >
        {{ auth.user?.first_name }} {{ auth.user?.last_name }}
        <ChevronDown :size="16" />
      </button>

      <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-48 px-6 py-4 bg-white shadow-lg rounded border grid grid-cols-1 gap-3"
      >
        <button
          @click="router.push('/account')"
          class="block w-full text-left text-sm hover:text-blue-600"
        >
          Account Settings
        </button>

        <button
          @click="logout"
          class="block w-full text-left text-sm text-red-600 "
        >
          Logout
        </button>
      </div>
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { Menu, ChevronDown } from "lucide-vue-next";

defineEmits(["toggle-sidebar"]);


const router = useRouter();
const auth = useAuthStore();

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// optional: close when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest(".user-menu")) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})



const logout = async () => {
  await auth.logout();
  router.push("/login");
};
</script>