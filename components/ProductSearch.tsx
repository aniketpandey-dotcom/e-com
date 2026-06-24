"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProductSearch } from "@/hooks/use-product-search";

export default function ProductSearch() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const { data, isLoading } = useProductSearch(search);

  const handleSelect = (id: number) => {
    setSearch("");
    setOpen(false);

    router.push(`/products/${id}`);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        className=" rounded-lg border bg-white px-4 py-3"
      />

      {open && search.length >= 2 && (
        <div className="absolute top-full max-h-80 overflow-auto z-50 mt-2 w-full rounded-lg border bg-white shadow-lg">
          {isLoading && <div className="p-4 text-center">Loading...</div>}

          {data?.products?.map((product: any) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product.id)}
              className="flex w-full items-center gap-3 p-3 hover:bg-gray-100"
            >
              <div className="relative h-12 w-12">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="rounded object-cover"
                />
              </div>

              <div className="text-left">
                <p>{product.title}</p>
                <p className="text-sm text-gray-500">₹{product.price}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
