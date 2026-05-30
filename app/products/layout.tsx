import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/products";

// Nested metadata — merges with root layout metadata
// The title uses the template from root: "%s | Ecommerce App"
export const metadata: Metadata = {
  title: "Products",
  description: "Browse our full catalog of products with reviews and ratings.",
  openGraph: {
    title: "Shop Products — Ecommerce App",
    description: "Browse our full catalog of products with reviews and ratings.",
  },
};

// Nested layout — wraps ALL pages under /products/*
// This layout adds a sidebar with category navigation.
// It does NOT re-render when navigating between /products and /products/[id].
export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch products to extract unique categories for the sidebar
  const products = await getProducts();
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="flex flex-1 bg-zinc-50 dark:bg-black">
      {/* Sidebar — persistent across all /products/* routes */}
      <aside className="hidden md:flex w-56 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-6 gap-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
            Navigation
          </h2>
          <nav className="flex flex-col gap-1">
            <Link
              href="/products"
              className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/"
              className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              ← Back to Home
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
            Categories
          </h2>
          <nav className="flex flex-col gap-1">
            {categories.map((category) => (
              <span
                key={category}
                className="text-sm text-zinc-600 dark:text-zinc-400 px-3 py-1.5 rounded-md capitalize"
              >
                {category}
              </span>
            ))}
          </nav>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            {products.length} products available
          </p>
        </div>
      </aside>

      {/* Main content — {children} is the current page */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
