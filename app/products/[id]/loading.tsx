import { ProductDetailSkeleton } from "@/components/Skeletons";

// loading.tsx for the dynamic [id] route
// Shown while the product detail + reviews are being fetched
export default function ProductDetailLoading() {
  return (
    <main className="w-full py-16 px-8 bg-white dark:bg-black">
      <ProductDetailSkeleton />
    </main>
  );
}
