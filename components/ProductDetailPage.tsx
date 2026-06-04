import Image from "next/image";
import Button from "./Button";

type Props = {
  product: any;
};

export default function ProductDetailPage({ product }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Product Image */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={500}
            height={500}
            className="mx-auto h-[450px] w-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            {product.category}
          </span>

          <h1 className="mt-4 text-4xl font-bold">{product.title}</h1>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-yellow-500">⭐</span>
            <span>{product.rating}</span>
            <span className="text-gray-500">
              ({product.reviews?.length} Reviews)
            </span>
          </div>

          <div className="mt-6">
            <p className="text-4xl font-bold text-green-600">
              ${product.price}
            </p>

            <p className="mt-1 text-sm text-green-600">
              {product.discountPercentage}% OFF
            </p>
          </div>

          <p className="mt-6 text-gray-700">{product.description}</p>

          <div className="mt-6 space-y-2 text-sm">
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>

            <p>
              <strong>SKU:</strong> {product.sku}
            </p>

            <p>
              <strong>Stock:</strong>{" "}
              <span className="font-medium text-green-600">
                {product.stock} Available
              </span>
            </p>

            <p>
              <strong>Status:</strong> {product.availabilityStatus}
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <Button>Add to Cart</Button>

            <button className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Extra Info */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Shipping</h3>
          <p className="mt-2 text-sm text-gray-600">
            {product.shippingInformation}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Warranty</h3>
          <p className="mt-2 text-sm text-gray-600">
            {product.warrantyInformation}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <h3 className="font-semibold">Returns</h3>
          <p className="mt-2 text-sm text-gray-600">{product.returnPolicy}</p>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-10 rounded-xl border p-6">
        <h2 className="mb-4 text-2xl font-bold">Product Specifications</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <p>
            <strong>Weight:</strong> {product.weight}g
          </p>

          <p>
            <strong>Minimum Order:</strong> {product.minimumOrderQuantity}
          </p>

          <p>
            <strong>Width:</strong> {product.dimensions?.width} cm
          </p>

          <p>
            <strong>Height:</strong> {product.dimensions?.height} cm
          </p>

          <p>
            <strong>Depth:</strong> {product.dimensions?.depth} cm
          </p>

          <p>
            <strong>Barcode:</strong> {product.meta?.barcode}
          </p>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>

        <div className="space-y-4">
          {product.reviews?.map((review: any, index: number) => (
            <div key={index} className="rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{review.reviewerName}</h3>

                <span>⭐ {review.rating}</span>
              </div>

              <p className="mt-2 text-gray-700">{review.comment}</p>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
