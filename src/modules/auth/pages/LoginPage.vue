<script setup lang="ts">
import { useLogin } from "../composables/useLogin";

const { username, password, loading, error, submit } = useLogin();
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <form
      class="bg-white p-8 rounded-xl shadow-md w-80 space-y-4"
      @submit.prevent="submit"
    >
      <h1 class="text-2xl font-bold text-center">Sign In</h1>
      <p class="text-base text-neutral-500 text-center">Please enter your details to access your account</p>

      <div>
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full border rounded-lg p-2"
        />
      </div>

      <div>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border rounded-lg p-2"
        />
      </div>

      <p v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </p>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white p-2 rounded-lg font-bold"
        :disabled="loading"
      >
        {{ loading ? "Logging in..." : "Login" }}
      </button>
    </form>
  </div>
</template>