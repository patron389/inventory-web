import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth.store";
import type { ApiError } from "@/types/api";

export function useLogin() {
  const auth = useAuthStore();
  const router = useRouter();

  // form fields
  const username = ref("");
  const password = ref("");

  // UI states
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Submit login form
   */
  const submit = async () => {
    loading.value = true;
    error.value = null;

    try {
      // attempt login via store
      await auth.login(username.value, password.value);

      // redirect after successful login
      router.push("/");
    } catch (err) {
      /**
       * Because we normalized errors in Axios,
       * we now receive ApiError instead of raw Axios error.
       */
      const apiError = err as ApiError;

      // 422 = validation error (wrong credentials usually)
      if (apiError.status === 422) {
        error.value = apiError.message;
      }

      // other errors (500, network, etc)
      else {
        error.value = apiError.message;
      }
    } finally {
      loading.value = false; // always stop loading
    }
  };

  return {
    username,
    password,
    loading,
    error,
    submit,
  };
}