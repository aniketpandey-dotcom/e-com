"use client";

import { useCheckoutStore } from "@/stores/checkout-store";

export default function PaymentForm() {
  const { paymentMethod, setPaymentMethod, nextStep, previousStep } =
    useCheckoutStore();

  return (
    <div className="space-y-4">
      <label className="flex gap-3">
        <input
          type="radio"
          checked={paymentMethod === "cod"}
          onChange={() => setPaymentMethod("cod")}
        />
        Cash on Delivery
      </label>

      <label className="flex gap-3">
        <input
          type="radio"
          checked={paymentMethod === "upi"}
          onChange={() => setPaymentMethod("upi")}
        />
        UPI
      </label>

      <label className="flex gap-3">
        <input
          type="radio"
          checked={paymentMethod === "card"}
          onChange={() => setPaymentMethod("card")}
        />
        Credit Card
      </label>

      <div className="flex gap-4">
        <button onClick={previousStep} className="rounded border px-5 py-3">
          Back
        </button>

        <button
          onClick={nextStep}
          className="rounded bg-blue-600 px-5 py-3 text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
