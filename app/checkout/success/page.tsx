import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
        <span className="text-5xl">✅</span>
      </div>

      <h1 className="text-4xl font-bold text-green-600">
        Order Placed Successfully!
      </h1>

      <p className="mt-4 text-gray-600">Thank you for shopping with us.</p>

      <p className="mt-6 text-gray-500">
        Your order has been confirmed and will be shipped soon.
      </p>

      <div className="mt-8 flex gap-4">
        <Link href="/" className="rounded-lg bg-blue-600 px-6 py-3 text-white">
          Continue Shopping
        </Link>

        <Link href="/products" className="rounded-lg border px-6 py-3">
          Browse Products
        </Link>
      </div>
    </div>
  );
}
