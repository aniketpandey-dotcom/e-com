"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore, useCartTotal } from "@/stores/cart-store";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = useCartTotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl p-8">
        <h1 className="mb-4 text-3xl font-bold">Shopping Cart</h1>

        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="text-lg text-gray-500">Your cart is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>

        <button
          onClick={clearCart}
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-xl border p-4 shadow-sm"
          >
            <Image
              width={100}
              height={100}
              src={item.thumbnail}
              alt={item.name}
              className="h-24 w-24 rounded-lg object-cover"
            />

            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>

              <p className="text-gray-600">₹{item.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                className="h-8 w-8 rounded border hover:bg-gray-100"
              >
                −
              </button>

              <span className="w-8 text-center font-semibold">
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
                className="h-8 w-8 rounded border hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <div className="w-24 text-right font-semibold">
              ₹{item.price * item.quantity}
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              className="rounded-md bg-red-500 px-3 py-2 text-white hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-gray-50 p-6">
        <div className="flex items-center justify-between text-2xl font-bold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <button
          className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          onClick={() => router.push("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
