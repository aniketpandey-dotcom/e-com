"use client";

type Props = {
  currentStep: number;
};

const steps = ["Shipping", "Payment", "Review"];

export default function CheckoutStepper({ currentStep }: Props) {
  return (
    <div className="mb-10 flex justify-center gap-8">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white
            ${currentStep >= index + 1 ? "bg-blue-600" : "bg-gray-300"}`}
          >
            {index + 1}
          </div>

          <span className="mt-2 text-sm">{step}</span>
        </div>
      ))}
    </div>
  );
}
