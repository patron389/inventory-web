<template>
  <div class="space-y-6">

    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Users</h1>

      <!-- Create button (permission aware) -->
      <button
        v-if="auth.can('user.create')"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create User
      </button>
    </div>

    <!-- Placeholder for future table -->
    <div class="bg-white shadow rounded p-6">
      Users table will go here.
    </div>

  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/modules/auth/store/auth.store";

const auth = useAuthStore();
</script>