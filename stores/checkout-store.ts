"use client";

import { create } from "zustand";

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface CheckoutState {
  step: number;

  shipping: ShippingAddress;

  paymentMethod: string;

  setStep: (step: number) => void;

  nextStep: () => void;

  previousStep: () => void;

  updateShipping: (data: ShippingAddress) => void;

  setPaymentMethod: (method: string) => void;

  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 1,

  shipping: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  },

  paymentMethod: "cod",

  setStep: (step) => set({ step }),

  nextStep: () =>
    set((state) => ({
      step: state.step + 1,
    })),

  previousStep: () =>
    set((state) => ({
      step: state.step - 1,
    })),

  updateShipping: (shipping) => set({ shipping }),

  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  resetCheckout: () =>
    set({
      step: 1,
      paymentMethod: "cod",
    }),
}));
