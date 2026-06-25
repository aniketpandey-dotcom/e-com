"use client";

import CheckoutStepper from "@/components/CheckoutStepper";
import ShippingForm from "@/components/ShippingForm";
import PaymentForm from "@/components/PaymentForm";
import ReviewOrder from "@/components/ReviewOrder";

import { useCheckoutStore } from "@/stores/checkout-store";

export default function CheckoutPage() {
  const step = useCheckoutStore((state) => state.step);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Checkout</h1>

      <CheckoutStepper currentStep={step} />

      <div className="rounded-xl border p-6 shadow">
        {step === 1 && <ShippingForm />}

        {step === 2 && <PaymentForm />}

        {step === 3 && <ReviewOrder />}
      </div>
    </div>
  );
}
