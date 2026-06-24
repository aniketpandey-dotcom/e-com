"use client";

import { useCartStore, useCartItem } from "@/stores/cart-store";

export default function AddToCartButton({ product }: any) {
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const cartItem = useCartItem(product.id.toString());

  if (cartItem) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-gray-300 overflow-hidden">
        <button
          className="px-4 py-2 hover:bg-gray-100"
          onClick={() =>
            updateQuantity(cartItem.productId, cartItem.quantity - 1)
          }
        >
          −
        </button>

        <span className="px-4 font-semibold">{cartItem.quantity}</span>

        <button
          className="px-4 py-2 hover:bg-gray-100"
          onClick={() =>
            updateQuantity(cartItem.productId, cartItem.quantity + 1)
          }
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() =>
        addItem({
          productId: product.id.toString(),
          name: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
        })
      }
      className="rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700"
    >
      Add to Cart
    </button>
  );
}
