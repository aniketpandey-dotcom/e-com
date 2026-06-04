import type { Metadata } from "next";
import { getProducts } from "@/lib/products";

// Nested metadata — merges with root layout metadata
// The title uses the template from root: "%s | Ecommerce App"
export const metadata: Metadata = {
  title: "Products",
  description: "Browse our full catalog of products with reviews and ratings.",
  openGraph: {
    title: "Shop Products — Ecommerce App",
    description:
      "Browse our full catalog of products with reviews and ratings.",
  },
};

export default async function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => data.products);
  const response = await fetch("https://dummyjson.com/products/categories");
  const categories = await response.json();

  return (
    <div className="flex flex-1 bg-zinc-50 dark:bg-black">
      {/* Sidebar — persistent across all /products/* routes */}
      <aside className="sticky top-20 hidden h-[calc(100vh-100px)] w-64 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Categories
          </h2>
        </div>

        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto pr-2">
          <nav className="space-y-2">
            {categories.map((category: any) => (
              <button
                key={category.name}
                className="w-full rounded-lg px-3 py-2 text-left capitalize text-gray-700 transition hover:bg-gray-100"
              >
                {category.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Fixed Bottom Section */}
        <div className="mt-4 border-t pt-4">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-sm text-gray-500">Available Products</p>

            <p className="text-2xl font-bold text-gray-900">
              {products.length}
            </p>
          </div>
        </div>
      </aside>

      {/* Main content — {children} is the current page */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
