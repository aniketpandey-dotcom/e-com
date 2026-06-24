"use client";

import { useHydration } from "@/hooks/use-hydration";
import { useCartCount } from "@/stores/cart-store";

export default function CartIndicator() {
  const hydrated = useHydration();

  const count = useCartCount();

  if (!hydrated) {
    return <sup>0</sup>;
  }

  return <sup>{count}</sup>;
}
