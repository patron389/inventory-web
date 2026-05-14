<template>
  <header class="bg-white shadow px-4 py-4 flex justify-between items-center">

    <!-- Left -->
    <button
      @click="$emit('toggle-sidebar')"
      class="p-2 rounded hover:bg-gray-100"
    >
      <Menu class="w-5 h-5" />
    </button>

    <!-- Right -->
    <div class="relative user-menu">
      <!-- Dashboard / POS Button -->
       <div class="flex items-center gap-5">
        <button
          @click="goToPage"
          class="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100 flex items-center gap-3"
        >
          <Globe v-if="isPosPage" :size="16" />
          <Laptop v-else :size="16" />
          <span>{{ isPosPage ? "Dashboard" : "POS Terminal" }}</span>
        </button>
        <div class="w-px h-6 bg-gray-300"></div>
        <button
          @click="toggleDropdown"
          class="flex items-center gap-2 px-2 py-2 text-sm hover:text-blue-600"
        >
          {{ auth.user?.first_name }} {{ auth.user?.last_name }}
          <ChevronDown :size="16" />
        </button>
       </div>


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
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { Menu, ChevronDown, Globe, Laptop } from "lucide-vue-next";

defineEmits(["toggle-sidebar"]);

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const showDropdown = ref(false)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}
// check if current page is POS
const isPosPage = computed(() => {
  return route.path.includes("/pos")
})
// button navigation
const goToPage = () => {
  if (isPosPage.value) {
    router.push("/dashboard")
  } else {
    router.push("/pos-terminal")
  }
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