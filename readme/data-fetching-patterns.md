# Chapter 6: Data Fetching Patterns

---

## Part 1 — Theory & Concepts

### `fetch()` in Server Components — Extended Fetch API

Next.js extends the native `fetch()` API with caching and revalidation options. In Server Components, you can fetch data directly — no `useEffect`, no loading states to manage manually.

```tsx
// Server Component — direct async data fetching
export default async function ProductsPage() {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();
  return <ul>{data.products.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

**Next.js extends fetch with two extra options:**

```tsx
// Option 1: cache (standard fetch option, extended by Next.js)
fetch(url, { cache: "force-cache" })  // Cache indefinitely (default)
fetch(url, { cache: "no-store" })     // Never cache, always fresh

// Option 2: next.revalidate (Next.js-specific)
fetch(url, { next: { revalidate: 3600 } })  // Cache for 1 hour, then revalidate
```

---

### `cache: 'force-cache'` vs `cache: 'no-store'` vs `revalidate`

| Strategy | fetch Option | Behavior | Use Case |
|----------|-------------|----------|----------|
| **Static (SSG)** | `cache: "force-cache"` | Cached indefinitely until next build or manual revalidation | Product listings, blog posts, marketing pages |
| **Dynamic (SSR)** | `cache: "no-store"` | Never cached, fetched fresh on every request | User-specific data, real-time prices, dashboards |
| **ISR** | `next: { revalidate: N }` | Cached for N seconds, then regenerated in background | Product details, news articles — fresh enough, but fast |

#### `cache: "force-cache"` — Static / SSG (Default)

```tsx
// Cached forever — same as SSG
const res = await fetch("https://api.example.com/products", {
  cache: "force-cache",  // This is the default, can be omitted
});
```

- Response is cached at build time and served from cache on every request
- Fastest possible response (served from CDN edge)
- Data only updates when you rebuild or manually revalidate

#### `cache: "no-store"` — Dynamic / SSR

```tsx
// Never cached — fresh data on every request
const res = await fetch("https://api.example.com/products", {
  cache: "no-store",
});
```

- Every request hits the origin server
- Always shows the latest data
- Slower response time (no caching)
- Use for: user sessions, real-time data, personalized content

#### `next: { revalidate: N }` — Incremental Static Regeneration (ISR)

```tsx
// Cached for 3600 seconds (1 hour), then revalidated
const res = await fetch("https://api.example.com/products/1", {
  next: { revalidate: 3600 },
});
```

- First request: fetches and caches the response
- Within 3600s: serves from cache (fast)
- After 3600s: next request triggers background regeneration
- Subsequent requests get the updated cached version
- Best of both worlds: speed of SSG + freshness of SSR

#### Page-Level Revalidation

You can also set revalidation at the page level instead of per-fetch:

```tsx
// app/products/[id]/page.tsx
export const revalidate = 3600; // All fetches in this page revalidate every hour

export default async function ProductPage({ params }) {
  const product = await fetch(`https://api.example.com/products/${params.id}`);
  // No need to set revalidate on each fetch — the page-level setting applies
}
```

---

### Parallel Data Fetching with `Promise.all()`

When you need multiple independent pieces of data, fetch them in parallel:

#### Sequential Fetching (Slow — Waterfall)

```tsx
// ❌ Sequential — total time = productTime + reviewsTime
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);    // Wait...
  const reviews = await getReviews(params.id);    // Then wait again...
  return <div>{/* render both */}</div>;
}
// If product takes 200ms and reviews take 300ms → total: 500ms
```

#### Parallel Fetching (Fast — Concurrent)

```tsx
// ✅ Parallel — total time = max(productTime, reviewsTime)
export default async function ProductPage({ params }) {
  const [product, reviews] = await Promise.all([
    getProduct(params.id),     // Both start at the same time
    getReviews(params.id),     // No waiting!
  ]);
  return <div>{/* render both */}</div>;
}
// If product takes 200ms and reviews take 300ms → total: 300ms
```

#### When to use which:

| Pattern | When to Use |
|---------|-------------|
| **Sequential** | Second fetch depends on first (e.g., fetch user, then fetch user's orders) |
| **Parallel** (`Promise.all`) | Fetches are independent (e.g., product + reviews, user + notifications) |
| **Suspense streaming** | Show partial UI immediately, stream in the rest |

---

### Loading UI with `loading.tsx` and Suspense Boundaries

#### `loading.tsx` — Automatic Suspense Boundary

Next.js automatically wraps your page in a `<Suspense>` boundary using `loading.tsx` as the fallback:

```
app/products/
├── page.tsx          # The actual page (may be slow — async data fetch)
├── loading.tsx       # Shown instantly while page.tsx loads
└── [id]/
    ├── page.tsx      # Product detail page
    └── loading.tsx   # Shown while product detail loads
```

This is equivalent to:
```tsx
<Suspense fallback={<Loading />}>
  <Page />
</Suspense>
```

#### Manual `<Suspense>` — Granular Control

For more control, wrap individual slow components in `<Suspense>`:

```tsx
import { Suspense } from "react";

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id); // Fast — renders immediately

  return (
    <div>
      {/* Product info shows instantly */}
      <h1>{product.name}</h1>
      <p>${product.price}</p>

      {/* Reviews stream in when ready — skeleton shown while loading */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews productId={params.id} />  {/* Slow async component */}
      </Suspense>
    </div>
  );
}
```

**Key insight:** `loading.tsx` is all-or-nothing (entire page). `<Suspense>` lets you show parts of the page immediately while other parts load.

---

### Error Boundaries with `error.tsx`

Error boundaries catch runtime errors in data fetching and rendering:

```tsx
// app/products/error.tsx
"use client"; // Must be a Client Component

export default function ProductsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Failed to load products</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}
```

**Error boundary hierarchy:**
```
app/error.tsx                    ← catches errors from all pages
app/products/error.tsx           ← catches errors in /products (overrides parent)
app/products/[id]/error.tsx      ← catches errors in /products/[id] only
```

If a `fetch()` throws or returns a non-OK status and you throw an Error, the nearest `error.tsx` catches it.

---

## Part 2 — Hands-On Implementation

### What We Built

```
ecommerce-app/
├── lib/
│   └── products.ts                 # Fetches from dummyjson.com with different cache strategies
├── components/
│   ├── ProductList.tsx             # Server — fetches product list (force-cache)
│   ├── ProductCard.tsx             # Server — renders card with thumbnail from API
│   ├── ProductReviews.tsx          # Server — fetches reviews (no-store), wrapped in Suspense
│   └── Skeletons.tsx               # Skeleton UI components for loading states
├── app/products/
│   ├── page.tsx                    # Products listing page
│   ├── loading.tsx                 # Skeleton UI shown while products load
│   └── [id]/
│       ├── page.tsx                # Product detail + Suspense for reviews
│       └── loading.tsx             # Skeleton for product detail
└── next.config.ts                  # Added dummyjson.com image domain
```

---

### Step 1: Data Layer — `lib/products.ts`

Replaced mock data with real API calls using three different caching strategies:

```tsx
const API_BASE = "https://dummyjson.com";

// ① force-cache — product listing (SSG, cached indefinitely)
export async function getProducts(): Promise<Product[]> {
  const res = await fetch(
    `${API_BASE}/products?limit=12&select=id,title,price,description,category,stock,thumbnail,rating`,
    { cache: "force-cache" }
  );
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const data = await res.json();
  return data.products.map(mapProduct);
}

// ② next.revalidate — product detail (ISR, revalidate every hour)
export async function getProductById(id: string): Promise<Product | undefined> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    next: { revalidate: 3600 },
  });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
  return mapProduct(await res.json());
}

// ③ no-store — reviews (SSR, always fresh)
export async function getProductReviews(id: string): Promise<Review[]> {
  const res = await fetch(`${API_BASE}/products/${id}?select=reviews`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch reviews`);
  const data = await res.json();
  return data.reviews ?? [];
}

// ④ Promise.all — parallel fetch product + reviews
export async function getProductWithReviews(id: string) {
  const [product, reviews] = await Promise.all([
    getProductById(id),      // Both fire simultaneously
    getProductReviews(id),   // No waterfall!
  ]);
  return { product, reviews };
}
```

**Caching summary for our app:**

| Function | Cache Strategy | Why |
|----------|---------------|-----|
| `getProducts()` | `force-cache` | Product listing rarely changes, serve from cache |
| `getProductById()` | `revalidate: 3600` | Product details update occasionally, refresh hourly |
| `getProductReviews()` | `no-store` | Reviews should always be fresh |

---

### Step 2: Skeleton Loading UI — `components/Skeletons.tsx`

Created reusable skeleton components with Tailwind's `animate-pulse`:

```tsx
export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-40 rounded bg-zinc-200" />
        <div className="h-5 w-16 rounded bg-zinc-200" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-full rounded bg-zinc-100" />
        <div className="h-4 w-3/4 rounded bg-zinc-100" />
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="h-12 w-36 rounded-full bg-zinc-200" />
      </div>
    </div>
  );
}

export function ProductListSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ReviewsSkeleton() { /* ... */ }
export function ProductDetailSkeleton() { /* ... */ }
```

**Key point:** Skeletons mimic the layout of the actual content — same dimensions, same structure — so there's no layout shift when data loads.

---

### Step 3: `loading.tsx` — Automatic Loading State

```tsx
// app/products/loading.tsx
import { ProductListSkeleton } from "@/components/Skeletons";

export default function ProductsLoading() {
  return (
    <div>
      <h1>Products</h1>
      <p>Loading products from API...</p>
      <ProductListSkeleton count={6} />
    </div>
  );
}
```

**How `loading.tsx` works internally:**
```tsx
// Next.js internally wraps your page like this:
<Suspense fallback={<ProductsLoading />}>
  <ProductsPage />           {/* Your async page */}
</Suspense>
```

1. User navigates to `/products`
2. `loading.tsx` renders instantly (skeleton UI)
3. `page.tsx` fetches data from dummyjson.com on the server
4. Once data arrives, `page.tsx` replaces the skeleton — no full page reload

---

### Step 4: Product Detail with `revalidate: 3600` and Suspense

```tsx
// app/products/[id]/page.tsx

// Page-level revalidation — all data on this page revalidates hourly
export const revalidate = 3600;

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);  // ISR — cached 1 hour

  if (!product) notFound();

  return (
    <div>
      {/* Product info renders immediately */}
      <h1>{product.name}</h1>
      <p>${product.price}</p>

      {/* Reviews wrapped in Suspense — streams in when ready */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews productId={id} />
      </Suspense>
    </div>
  );
}
```

**What happens when you visit `/products/1`:**
1. `loading.tsx` skeleton shows instantly
2. Product detail fetches from API (ISR — cached 1 hour)
3. Product info renders, replacing the full skeleton
4. Reviews section shows `<ReviewsSkeleton />` (Suspense fallback)
5. Reviews fetch completes → skeleton replaced with actual reviews
6. Subsequent visits within 1 hour serve the cached version instantly

---

### Step 5: `<Suspense>` Wrapping a Slow Component

```tsx
// The ProductReviews component fetches with cache: "no-store" (always fresh)
// It's wrapped in Suspense so it doesn't block the rest of the page

<Suspense fallback={<ReviewsSkeleton />}>
  <ProductReviews productId={id} />
</Suspense>
```

**Without Suspense:** The entire page waits for reviews before any HTML is sent.

**With Suspense:** Product details stream to the browser immediately. Reviews stream in when ready. The user sees useful content faster.

```
Timeline without Suspense:
[--- fetch product ---][--- fetch reviews ---][--- render all ---] → user sees content

Timeline with Suspense:
[--- fetch product ---][--- render product ---] → user sees product
                       [--- fetch reviews  ---][--- render ---] → reviews stream in
```

---

### Step 6: Configuring External Images — `next.config.ts`

```tsx
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
    ],
  },
};
```

The `next/image` component requires you to whitelist external image domains for security (prevents SSRF). This allows product thumbnails from the dummyjson CDN.

---

### Server Logs — Proof It Works

When you visit `/products` then `/products/1`, the **terminal** (not browser) shows:

```
[SERVER] Fetching all products at 2026-05-30T07:34:52.264Z
[SERVER] ProductList rendered with 12 products at 2026-05-30T07:34:52.420Z
[SERVER] Rendering ProductCard for "Essence Mascara Lash Princess"
[SERVER] Rendering ProductCard for "Eyeshadow Palette with Mirror"
...

[SERVER] Fetching product id=1 at 2026-05-30T07:35:12.320Z
[SERVER] Fetching reviews for product id=1 at 2026-05-30T07:35:12.578Z
[SERVER] ProductReviews rendered with 3 reviews for product 1
```

---

## Quick Reference: Data Fetching Decision Tree

```
What data are you fetching?
│
├── Static content (rarely changes)?
│   └── cache: "force-cache" (default) → SSG
│
├── Dynamic / personalized / real-time?
│   └── cache: "no-store" → SSR
│
├── Changes occasionally (hourly, daily)?
│   └── next: { revalidate: N } → ISR
│
├── Multiple independent fetches?
│   └── Promise.all([fetchA(), fetchB()]) → Parallel
│
├── Want partial page while rest loads?
│   └── <Suspense fallback={<Skeleton />}> → Streaming
│
└── Want full-page loading state?
    └── loading.tsx → Automatic Suspense
```

---

## Files Created / Modified

| File | Action | Purpose |
|------|--------|---------|
| `lib/products.ts` | Modified | Real API fetch with force-cache, no-store, revalidate, Promise.all |
| `components/Skeletons.tsx` | Created | Skeleton UI components (ProductCard, ProductList, ProductDetail, Reviews) |
| `components/ProductReviews.tsx` | Created | Server Component — fetches reviews with no-store |
| `components/ProductCard.tsx` | Modified | Added thumbnail image and rating from API |
| `app/products/loading.tsx` | Created | Skeleton loading state for products listing |
| `app/products/[id]/loading.tsx` | Created | Skeleton loading state for product detail |
| `app/products/[id]/page.tsx` | Modified | Added revalidate: 3600, Suspense for reviews |
| `next.config.ts` | Modified | Added cdn.dummyjson.com to allowed image domains |

---

## Summary

| What We Built | Key Concept Learned |
|---------------|-------------------|
| `getProducts()` with `force-cache` | SSG caching — cached indefinitely |
| `getProductById()` with `revalidate: 3600` | ISR — cached 1 hour, background regeneration |
| `getProductReviews()` with `no-store` | SSR — always fresh, never cached |
| `getProductWithReviews()` with `Promise.all()` | Parallel fetching — concurrent requests |
| `loading.tsx` files | Automatic Suspense boundary — skeleton during page load |
| `<Suspense fallback={<ReviewsSkeleton />}>` | Granular streaming — product shows while reviews load |
| `components/Skeletons.tsx` | Skeleton UI with animate-pulse — no layout shift |
| `next.config.ts` image config | Whitelisting external image domains for next/image |
