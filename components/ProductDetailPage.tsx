"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "./AddToCartButton";
import ProductGallery from "./ProductGallery";
import cloudinaryLoader from "@/lib/cloudinary";
import AddToCartButton from "./AddToCartButton";

type Props = {
  product: any;
};

export default function ProductDetailPage({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(
    product.thumbnail || product.images[0],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="flex gap-4">
          <div className="relative flex-1 overflow-hidden rounded-2xl border bg-white p-6 shadow-sm">
            <Image
              loader={cloudinaryLoader}
              key={selectedImage}
              src={selectedImage}
              alt={product.title}
              width={600}
              height={600}
              priority
              placeholder="blur"
              blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACw="
              className="
    h-[500px]
    w-full
    object-contain
    transition-transform
    duration-300
    hover:scale-105
  "
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div>
          <span className="rounded-full bg-gray-100 px-4 py-1 text-sm capitalize">
            {product.category}
          </span>

          <h1 className="mt-4 text-4xl font-bold">{product.title}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-yellow-500">⭐ {product.rating}</span>

            <span className="text-gray-500">
              ({product.reviews?.length} reviews)
            </span>
          </div>

          <div className="mt-6">
            <p className="text-4xl font-bold text-green-600">
              ${product.price}
            </p>

            <p className="mt-1 text-sm text-red-500">
              {product.discountPercentage}% OFF
            </p>
          </div>

          <p className="mt-6 leading-7 text-gray-700">{product.description}</p>

          <div className="mt-8 space-y-3 text-sm">
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>

            <p>
              <strong>SKU:</strong> {product.sku}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="font-medium text-green-600">
                {product.availabilityStatus}
              </span>
            </p>

            <p>
              <strong>Stock:</strong> {product.stock} available
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <AddToCartButton product={product} />

            <button className="rounded-lg border px-6 py-3 font-medium transition hover:bg-gray-100">
              Buy Now
            </button>
          </div>

          <div className="mt-8 rounded-xl bg-gray-50 p-4 text-sm">
            <p>🚚 {product.shippingInformation}</p>

            <p className="mt-2">🛡️ {product.warrantyInformation}</p>

            <p className="mt-2">↩️ {product.returnPolicy}</p>
          </div>
        </div>
      </div>

      {/* SPECIFICATIONS */}
      <div className="p-4 m-4">
        <ProductGallery
          images={product.images}
          selectedImage={selectedImage}
          onSelect={setSelectedImage}
        />
      </div>

      <div className="mt-12 rounded-2xl border p-6">
        <h2 className="mb-6 text-2xl font-bold">Product Specifications</h2>

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

      {/* REVIEWS */}

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>

        <div className="space-y-4">
          {product.reviews?.map((review: any, index: number) => (
            <div
              key={index}
              className="
                  rounded-xl
                  border
                  p-5
                  transition
                  hover:shadow-md
                "
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{review.reviewerName}</h3>

                <span>⭐ {review.rating}</span>
              </div>

              <p className="mt-3 text-gray-700">{review.comment}</p>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString("en-US")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
