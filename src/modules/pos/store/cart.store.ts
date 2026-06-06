import { defineStore } from "pinia";
import type { Product } from "@/types/product.type";

export interface CartItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    subtotal: (state) =>
      state.items.reduce((sum, item) => sum + item.subtotal, 0),
    grandTotal: (state) =>
      state.items.reduce((sum, item) => sum + item.subtotal, 0),
    itemCount: (state) => state.items.length,
  },

  actions: {
    addToCart(product: Product) {
      const existing = this.items.find(
        item => item.product_id === product.id
      );

      if (existing) {
        existing.quantity++;
        existing.subtotal =
          existing.quantity * existing.price;

        return;
      }

      this.items.push({
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price,
      });
    },

    increaseQty(productId: number) {
      const item = this.items.find(
        item => item.product_id === productId
      );

      if (!item) return;

      item.quantity++;
      item.subtotal = item.quantity * item.price;
    },

    decreaseQty(productId: number) {
      const item = this.items.find(
        item => item.product_id === productId
      );

      if (!item) return;

      if (item.quantity <= 1) {
        this.removeItem(productId);
        return;
      }

      item.quantity--;
      item.subtotal = item.quantity * item.price;
    },

    removeItem(productId: number) {
      this.items = this.items.filter(
        item => item.product_id !== productId
      );
    },

    clearCart() {
      this.items = [];
    },
  },
});