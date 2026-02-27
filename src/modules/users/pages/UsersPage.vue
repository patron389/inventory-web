<template>
  <div class="space-y-6">

    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Users</h1>

      <!-- Create button (permission aware) -->
      <button
        v-if="auth.can('user.create')"
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create User
      </button>
    </div>

    <!-- Placeholder for future table -->
    <div class="bg-white shadow rounded p-6">
      <DataTable
        :rows="users"
        :columns="columns"
        :loading="loading"
      >
        <!-- Custom Email Column -->
        <template #cell-email="{ row }">
          <span class="text-blue-600">
            {{ row.email }}
          </span>
        </template>

        <!-- Actions Column -->
        <template #actions="{ row }">
          <button
            v-if="auth.can('user.update')"
            class="text-indigo-600 hover:underline mr-3"
          >
            Edit
          </button>

          <button
            v-if="auth.can('user.delete')"
            class="text-red-600 hover:underline"
          >
            Delete
          </button>
        </template>
        <template #pagination>
          <div class="flex justify-between items-center">

            <span class="text-sm text-gray-600">
              Page {{ currentPage }} of {{ lastPage }}
            </span>

            <div class="space-x-2">
              <button
                :disabled="currentPage === 1"
                @click="loadUsers(currentPage - 1)"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                :disabled="currentPage === lastPage"
                @click="loadUsers(currentPage + 1)"
                class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

          </div>
        </template>
      </DataTable>
    </div>

  </div>
  <CreateUserModal
    v-model="showCreateModal"
    @created="loadUsers"
  />
</template>

<script setup lang="ts">

import { ref } from "vue";
import CreateUserModal from "../components/CreateUserModal.vue";
/**
 * Controls visibility of Create User modal
 */
const showCreateModal = ref(false);
// Import reusable DataTable component
import DataTable from "@/shared/components/DataTable.vue";

// Import composable that handles API logic
import { useUsers } from "../composables/useUsers";

// Import auth store for permission checks
import { useAuthStore } from "@/modules/auth/store/auth.store";

// Access auth store (for permission-based buttons)
const auth = useAuthStore();

// Destructure state from composable
// users  → actual user data
// loading → loading state for API call
const { users, loading, currentPage, lastPage, loadUsers } = useUsers();

/**
 * Define which columns DataTable should render.
 *
 * key   → object property name from each row
 * label → table header text
 */
const columns = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email" },
];

</script>