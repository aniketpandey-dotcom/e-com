import { ProductListSkeleton } from "@/components/Skeletons";

// loading.tsx — shown automatically while the page's async data is being fetched.
// Next.js wraps the page in a <Suspense> boundary using this component as the fallback.
// This file applies to app/products/page.tsx.
export default function ProductsLoading() {
  return (
    <main className="w-full py-16 px-8 bg-white dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-2">
        Products
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        Loading products from API...
      </p>

      <ProductListSkeleton count={6} />
    </main>
  );
}
