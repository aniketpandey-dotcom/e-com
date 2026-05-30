import ProductList from "@/components/ProductList";

// This page is a SERVER component — no "use client" directive.
// It delegates data fetching to ProductList (also a server component).
// The only JavaScript sent to the browser is from AddToCartButton (client component).
export default function ProductsPage() {
  return (
    <main className="w-full py-16 px-8 bg-white dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 mb-2">
        Products
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        Browse our collection. Check your terminal for server-side logs.
      </p>

      {/* ProductList is a Server Component — fetches data on the server */}
      <ProductList />
    </main>
  );
}
