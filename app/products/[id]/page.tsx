import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import ProductReviews from "@/components/ProductReviews";
import { ReviewsSkeleton } from "@/components/Skeletons";

// Revalidate every 3600 seconds (1 hour) — ISR at the page level
export const revalidate = 3600;

// generateMetadata() — dynamic metadata for each product page.
// This function runs on the server and sets <title>, <meta>, and Open Graph tags.
// Next.js deduplicates the fetch — if getProductById(id) is called here AND in the page
// component, the actual network request only happens ONCE.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    // Title uses the template from root layout: "%s | Ecommerce App"
    title: product.name,
    description: product.description,

    // Open Graph — rich previews on Facebook, LinkedIn, Discord, Slack, etc.
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      url: `https://ecommerce-app.example.com/products/${id}`,
      images: [
        {
          url: product.thumbnail,
          width: 400,
          height: 400,
          alt: product.name,
        },
      ],
    },

    // Twitter Card — rich previews on Twitter/X
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.thumbnail],
    },
  };
}

// SERVER component — fetches data directly, no useEffect needed
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  // If product doesn't exist, trigger the not-found.tsx page
  if (!product) {
    notFound();
  }

  return (
    <main className="w-full py-16 px-8 bg-white dark:bg-black">
      {/* Product details — all rendered on the server */}
      <div className="flex flex-col gap-6">
        {/* Product image from API */}
        <div className="w-full h-64 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
          <Image
              src={product.thumbnail}
              alt={product.name}
              width={400}
              height={256}
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              {product.category}
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-black dark:text-zinc-50">
                ${product.price}
              </p>
              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                ★ {product.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {product.description}
            </p>
            <p className="text-sm text-zinc-500">
              {product.stock > 0 ? (
                <span className="text-green-600 dark:text-green-400">
                  ✓ In stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">✗ Out of stock</span>
              )}
            </p>
          </div>

          {/* Client Component nested inside Server Component */}
          <div className="flex gap-4 mt-4">
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              price={product.price}
            />
            <Link
              href="/products"
              className="flex h-12 items-center justify-center rounded-full border border-zinc-200 px-8 font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              Back to Products
            </Link>
          </div>
        </div>

        {/* Reviews section — wrapped in Suspense so it streams in independently */}
        {/* The product details above render immediately; reviews load in the background */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <Suspense fallback={<ReviewsSkeleton />}>
            <ProductReviews productId={id} />
          </Suspense>
        </div>
      </main>
  );
}
