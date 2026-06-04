import { ProductListSkeleton } from "@/components/Skeletons";

// loading.tsx — shown automatically while the page's async data is being fetched.
// Next.js wraps the page in a <Suspense> boundary using this component as the fallback.
// This file applies to app/products/page.tsx.
export default function ProductsLoading() {
  return (
    <div className="w-full py-16 px-8 bg-white dark:bg-black">
      <ProductListSkeleton />
    </div>
  );
}
