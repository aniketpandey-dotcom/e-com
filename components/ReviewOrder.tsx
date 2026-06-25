"use client";

import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useRouter } from "next/navigation";

export default function ReviewOrder() {
  const items = useCartStore((state) => state.items);
  const router = useRouter();

  const clearCart = useCartStore((state) => state.clearCart);

  const { shipping, paymentMethod, previousStep } = useCheckoutStore();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function placeOrder() {
    clearCart();

    // alert("Order placed successfully!");
    router.push("/checkout/success");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold">Shipping Address</h2>

        <p>{shipping.fullName}</p>
        <p>{shipping.address}</p>
        <p>
          {shipping.city}, {shipping.state}
        </p>
      </div>

      <div>
        <h2 className="font-bold">Payment</h2>

        <p>{paymentMethod}</p>
      </div>

      <div>
        <h2 className="font-bold mb-3">Order Summary</h2>

        {items.map((item) => (
          <div key={item.productId} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="text-xl font-bold">Total: ₹{total}</div>

      <div className="flex gap-4">
        <button onClick={previousStep} className="rounded border px-5 py-3">
          Back
        </button>

        <button
          onClick={placeOrder}
          className="rounded bg-green-600 px-5 py-3 text-white"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
