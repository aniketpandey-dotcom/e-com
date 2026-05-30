"use client";

import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
}

// This is a CLIENT component — it ships JavaScript to the browser
// because it needs interactivity (onClick, useCart context)
export default function AddToCartButton({
  productId,
  productName,
  price,
}: AddToCartButtonProps) {
  const { addItem, items } = useCart();

  const itemInCart = items.find((item) => item.productId === productId);
  const quantity = itemInCart?.quantity ?? 0;

  function handleAddToCart() {
    // This console.log appears in the BROWSER console, NOT the server terminal
    console.log(`[CLIENT] Adding "${productName}" to cart`);
    addItem({ productId, name: productName, price, quantity: 1 });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleAddToCart}
        className="flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-background font-medium transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300"
      >
        Add to Cart
      </button>
      {quantity > 0 && (
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          ({quantity} in cart)
        </span>
      )}
    </div>
  );
}
