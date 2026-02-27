import { defineStore } from "pinia";

/**
 * Toast type definition
 */
export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export const useToastStore = defineStore("toast", {
  state: () => ({
    toasts: [] as Toast[],
  }),

  actions: {

    /**
     * Add new toast
     */
    show(message: string, type: Toast["type"] = "info") {
      const id = Date.now();

      this.toasts.push({
        id,
        message,
        type,
      });

      // auto remove after 3 seconds
      setTimeout(() => {
        this.remove(id);
      }, 3000);
    },

    /**
     * Remove toast manually
     */
    remove(id: number) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }

  }
});