export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl h-[600] border border-gray-200 bg-white p-4 shadow-sm">
      <div className="h-52 w-full rounded-lg bg-gray-200" />

      <div className="mt-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-gray-200" />

        <div className="h-4 w-full rounded bg-gray-100" />

        <div className="h-4 w-2/3 rounded bg-gray-100" />

        <div className="h-6 w-24 rounded bg-gray-200" />

        <div className="h-10 w-full rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1  gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="h-[450px] rounded-xl bg-gray-200" />

        {/* Details */}
        <div>
          <div className="h-6 w-24 rounded bg-gray-200" />

          <div className="mt-4 h-10 w-3/4 rounded bg-gray-200" />

          <div className="mt-4 h-6 w-32 rounded bg-gray-100" />

          <div className="mt-6 h-10 w-28 rounded bg-gray-200" />

          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-3/4 rounded bg-gray-100" />
          </div>

          <div className="mt-8 flex gap-4">
            <div className="h-12 w-36 rounded-lg bg-gray-200" />
            <div className="h-12 w-36 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 rounded-xl bg-gray-100" />
        ))}
      </div>

      {/* Specifications */}
      <div className="mt-10 rounded-xl border p-6">
        <div className="mb-6 h-8 w-64 rounded bg-gray-200" />

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-5 rounded bg-gray-100" />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <div className="mb-6 h-8 w-52 rounded bg-gray-200" />

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl border p-4">
              <div className="h-5 w-40 rounded bg-gray-200" />

              <div className="mt-3 h-4 w-full rounded bg-gray-100" />

              <div className="mt-2 h-4 w-3/4 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
