// Skeleton UI components for loading states
// These are Server Components — no JS shipped to the browser

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-5 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-4 w-24 rounded bg-zinc-100 dark:bg-zinc-800 mt-2" />
        </div>
        <div className="h-5 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-4 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="h-12 w-36 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}

export function ProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="w-full h-64 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-8 w-64 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-7 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="space-y-2">
          <div className="h-5 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-5 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-5 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
        <div className="h-4 w-32 rounded bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="flex gap-4 mt-4">
        <div className="h-12 w-36 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-12 w-40 rounded-full bg-zinc-100 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-4 w-16 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="h-4 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
