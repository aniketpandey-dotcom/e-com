import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductCardProps {
  product: Product;
}

// SERVER component — no "use client" directive
// This component renders on the server and sends zero JS to the browser.
// It can safely nest a Client Component (AddToCartButton) inside it.
export default function ProductCard({ product }: ProductCardProps) {
  // This log appears in the SERVER terminal only
  console.log(`[SERVER] Rendering ProductCard for "${product.name}"`);

  return (
    <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <Link
        href={`/products/${product.id}`}
        className="block transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 -m-6 p-6 mb-0 pb-4 rounded-t-lg"
      >
        <div className="flex items-start gap-4">
          <Image
            src={product.thumbnail}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-black dark:text-zinc-50 truncate">
                {product.name}
              </h2>
              <span className="text-lg font-semibold text-black dark:text-zinc-50 flex-shrink-0 ml-2">
                ${product.price}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {product.category} · ★ {product.rating.toFixed(1)}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>
      </Link>

      {/* Client Component nested inside Server Component */}
      {/* Only AddToCartButton ships JS to the browser — the rest of ProductCard does not */}
      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          price={product.price}
        />
      </div>
    </div>
  );
}
