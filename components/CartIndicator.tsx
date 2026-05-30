"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

// Client Component — needs useCart context to display live cart count
export default function CartIndicator() {
  const { totalItems, totalPrice } = useCart();

  return (
    <Link
      href="/products"
      className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
    >
      <span>🛒</span>
      {totalItems > 0 && (
        <span className="inline-flex items-center rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white dark:bg-white dark:text-black">
          {totalItems} — ${totalPrice.toFixed(2)}
        </span>
      )}
    </Link>
  );
}
