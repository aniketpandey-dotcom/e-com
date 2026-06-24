// stores/cart-store.ts

"use client";

import { create } from "zustand";

import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;

  name: string;

  price: number;

  thumbnail: string;

  quantity: number;
}

interface CartState {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;

  removeItem: (productId: string) => void;

  updateQuantity: (productId: string, quantity: number) => void;

  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === newItem.productId,
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === newItem.productId
                  ? {
                      ...item,
                      quantity: item.quantity + (newItem.quantity ?? 1),
                    }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { ...newItem, quantity: newItem.quantity ?? 1 },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),

    {
      name: "cart-storage",

      partialize: (state) => ({ items: state.items }), // CRITICAL: Excludes mutations from local serialization
    },
  ),
);

/* Atomic Selector Selections to Prevent Component Rerenders */

export const useCartTotal = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

export const useCartCount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

export const useCartItem = (productId: string) =>
  useCartStore((state) =>
    state.items.find((item) => item.productId === productId),
  );
