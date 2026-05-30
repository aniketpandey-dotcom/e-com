import { getProductReviews } from "@/lib/products";

interface ProductReviewsProps {
  productId: string;
}

// SERVER component — fetches reviews on the server
// This component is intentionally separate so it can be wrapped in <Suspense>
// allowing the product details to render immediately while reviews load
export default async function ProductReviews({ productId }: ProductReviewsProps) {
  const reviews = await getProductReviews(productId);

  console.log(
    `[SERVER] ProductReviews rendered with ${reviews.length} reviews for product ${productId}`
  );

  if (reviews.length === 0) {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        No reviews yet for this product.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
        Customer Reviews ({reviews.length})
      </h2>
      {reviews.map((review, index) => (
        <div
          key={index}
          className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-black dark:text-zinc-100">
              {review.reviewerName}
            </span>
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {review.comment}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
            {new Date(review.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
