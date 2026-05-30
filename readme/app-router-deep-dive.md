# Chapter 4: App Router Deep Dive & File-Based Routing

---

## Part 1 — Theory & Concepts

### App Router vs Pages Router — When to Use Which

Next.js has **two routing systems** that coexist:

| Feature | App Router (`app/`) | Pages Router (`pages/`) |
|---------|-------------------|----------------------|
| **Introduced** | Next.js 13+ (stable in 14) | Next.js 1+ (original) |
| **Components** | Server Components by default | Client Components by default |
| **Layouts** | Nested, persistent layouts | `_app.tsx` + per-page `getLayout` |
| **Data Fetching** | `async` components, `fetch()` | `getServerSideProps`, `getStaticProps` |
| **Loading UI** | `loading.tsx` (built-in Suspense) | Manual implementation |
| **Error Handling** | `error.tsx` (built-in Error Boundary) | Manual Error Boundaries |
| **Streaming** | Built-in with React Suspense | Not supported |
| **Server Actions** | Supported | Not supported |
| **Status** | **Recommended** for new projects | Maintained, not deprecated |

**When to use App Router:**
- All new projects (Next.js 14+)
- When you need Server Components, streaming, or Server Actions
- When you want nested layouts that persist across navigations

**When to use Pages Router:**
- Existing projects that haven't migrated yet
- Libraries/tools that don't yet support App Router
- You can incrementally adopt App Router — both routers work side by side

---

### Dynamic Routes: `[id]`, `[...slug]`, `[[...optionalSlug]]`

Next.js uses bracket syntax in folder names to create dynamic URL segments.

#### `[id]` — Single Dynamic Segment

```
app/products/[id]/page.tsx
```
| URL | `params.id` |
|-----|-------------|
| `/products/1` | `"1"` |
| `/products/abc` | `"abc"` |
| `/products/wireless-headphones` | `"wireless-headphones"` |

```tsx
// app/products/[id]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <h1>Product: {id}</h1>;
}
```

#### `[...slug]` — Catch-All Segment

```
app/blog/[...slug]/page.tsx
```
| URL | `params.slug` |
|-----|---------------|
| `/blog/hello` | `["hello"]` |
| `/blog/2024/june/post` | `["2024", "june", "post"]` |
| `/blog` | ❌ 404 (does NOT match) |

```tsx
// app/blog/[...slug]/page.tsx
export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <h1>Path: {slug.join("/")}</h1>;
}
```

#### `[[...optionalSlug]]` — Optional Catch-All Segment

```
app/docs/[[...slug]]/page.tsx
```
| URL | `params.slug` |
|-----|---------------|
| `/docs` | `undefined` (matches root!) |
| `/docs/intro` | `["intro"]` |
| `/docs/api/reference/auth` | `["api", "reference", "auth"]` |

The key difference: **optional catch-all also matches the root path** (no segments).

---

### Route Groups: `(group)/` Folders — Layout Organization

Route groups use **parentheses** in folder names. They organize code **without affecting the URL**.

```
app/
├── (auth)/                    # Route group — does NOT add "/auth" to URL
│   ├── layout.tsx             # Layout ONLY for auth pages (centered card)
│   ├── login/page.tsx         # URL: /login  (not /auth/login)
│   └── register/page.tsx      # URL: /register
├── (shop)/                    # Route group for shop pages
│   ├── layout.tsx             # Layout with sidebar navigation
│   ├── products/page.tsx      # URL: /products
│   └── cart/page.tsx          # URL: /cart
└── layout.tsx                 # Root layout (wraps everything)
```

**Use cases:**
1. **Organize by feature** — group related routes without URL impact
2. **Different layouts** — auth pages get a centered layout, shop pages get a sidebar
3. **Split the root layout** — create multiple root layouts with `(group)/layout.tsx`

---

### Parallel Routes and Intercepted Routes

#### Parallel Routes (`@slot`)

Render multiple pages simultaneously in the same layout — like a dashboard with independent panels:

```
app/
├── layout.tsx                 # Receives {children}, {analytics}, {team}
├── page.tsx                   # Main content
├── @analytics/page.tsx        # Analytics panel (parallel slot)
└── @team/page.tsx             # Team panel (parallel slot)
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2">
        {analytics}
        {team}
      </div>
    </div>
  );
}
```

Each slot can have its own `loading.tsx` and `error.tsx`, and they load independently.

#### Intercepted Routes (`(.)`, `(..)`, `(...)`)

Intercept a route and show it in a different context (e.g., modal overlay):

```
app/
├── feed/
│   └── page.tsx               # Feed page with photo thumbnails
├── photo/[id]/
│   └── page.tsx               # Full photo page (direct URL access)
└── feed/
    └── (.)photo/[id]/
        └── page.tsx           # Intercepted: shows photo as modal over feed
```

| Prefix | Matches |
|--------|---------|
| `(.)` | Same level |
| `(..)` | One level up |
| `(..)(..)` | Two levels up |
| `(...)` | Root level |

**Common pattern:** Click a photo in a feed → shows modal (intercepted). Share/refresh the URL → shows full page (original route).

---

### Navigation: Link, useRouter, redirect(), notFound()

| Method | Type | Use Case |
|--------|------|----------|
| `<Link>` | Component | Declarative navigation in JSX (preferred) |
| `useRouter()` | Client Hook | Programmatic navigation in event handlers |
| `redirect()` | Server Function | Redirect in Server Components, actions, route handlers |
| `notFound()` | Server Function | Trigger 404 from Server Components |

#### `<Link>` Component
```tsx
import Link from "next/link";

// Basic link
<Link href="/products">Products</Link>

// Dynamic route
<Link href={`/products/${product.id}`}>View Product</Link>

// Replace history (no back button)
<Link href="/login" replace>Login</Link>

// Prefetch disabled (prefetch is ON by default)
<Link href="/heavy-page" prefetch={false}>Heavy Page</Link>
```

#### `useRouter()` Hook
```tsx
"use client"; // Required — useRouter is a client hook

import { useRouter } from "next/navigation";

export default function MyComponent() {
  const router = useRouter();

  return (
    <>
      <button onClick={() => router.push("/products")}>Go to Products</button>
      <button onClick={() => router.replace("/login")}>Replace with Login</button>
      <button onClick={() => router.back()}>Go Back</button>
      <button onClick={() => router.refresh()}>Refresh Server Data</button>
      <button onClick={() => router.prefetch("/about")}>Prefetch About</button>
    </>
  );
}
```

#### `redirect()` — Server-Side Redirect
```tsx
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login"); // Server-side redirect — never reaches the client
  }
  return <h1>Welcome, {user.name}</h1>;
}
```

#### `notFound()` — Trigger 404
```tsx
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    notFound(); // Renders the nearest not-found.tsx
  }
  return <h1>{product.name}</h1>;
}
```

---

## Part 2 — Hands-On Implementation

### Updated Project Structure

```
ecommerce-app/app/
├── layout.tsx                      # Root layout — now includes Breadcrumb
├── page.tsx                        # Home page (/)
├── not-found.tsx                   # Global 404 page
├── error.tsx                       # Global error boundary
├── globals.css                     # Global styles
├── favicon.ico
│
├── about/
│   └── page.tsx                    # About page (/about)
│
├── products/
│   ├── page.tsx                    # Products listing (/products)
│   └── [id]/
│       └── page.tsx                # Dynamic product detail (/products/1)
│
├── (auth)/
│   ├── layout.tsx                  # Auth-specific layout (centered card)
│   └── login/
│       └── page.tsx                # Login page (/login) — uses useRouter
│
└── navigation-demo/
    └── page.tsx                    # useRouter demo page (/navigation-demo)

components/
└── Breadcrumb.tsx                  # Breadcrumb using usePathname hook
```

---

### Step 1: Dynamic Product Detail Page — `app/products/[id]/page.tsx`

**Route:** `/products/1`, `/products/2`, etc.

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";

const products = [
  { id: "1", name: "Wireless Headphones", price: 79.99, ... },
  { id: "2", name: "Running Shoes", price: 129.99, ... },
  // ...
];

// Pre-render known product IDs at build time (SSG)
export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

// Dynamic <title> per product
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return { title: "Product Not Found" };
  return { title: `${product.name} — Ecommerce App` };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound(); // Triggers not-found.tsx
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
}
```

**Key concepts demonstrated:**
- `[id]` folder creates a dynamic segment — `params.id` receives the URL value
- `params` is a **Promise** in Next.js 16 — must be awaited
- `generateStaticParams()` tells Next.js which IDs to pre-render (SSG)
- `generateMetadata()` sets dynamic `<title>` and `<meta>` per page
- `notFound()` triggers the nearest `not-found.tsx` for invalid IDs

---

### Step 2: Route Group Login Page — `app/(auth)/login/page.tsx`

**Route:** `/login` (NOT `/auth/login` — parentheses are ignored in the URL)

**Auth layout** (`app/(auth)/layout.tsx`):
```tsx
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-100">
      <div className="w-full max-w-md px-6">{children}</div>
    </div>
  );
}
```

This layout **only wraps auth pages** (login, register). Product pages and the home page are NOT affected — they use the root layout directly.

**Login page** (`app/(auth)/login/page.tsx`):
```tsx
"use client"; // Required for useState and useRouter

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // After successful login → programmatic navigation
    router.push("/products");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

**Key concepts demonstrated:**
- `(auth)` folder is a **route group** — organizes without affecting URL
- Separate `layout.tsx` provides a centered card layout for auth pages only
- `"use client"` directive is required because we use hooks (`useState`, `useRouter`)
- `router.push("/products")` performs programmatic navigation after form submit

---

### Step 3: Breadcrumb Component — Using `usePathname` Hook

**File:** `components/Breadcrumb.tsx`

```tsx
"use client"; // usePathname is a client hook

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname(); // Returns current URL path, e.g. "/products/1"

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null; // Don't show on home page

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;
    const label = decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {breadcrumbs.map(({ href, label, isLast }) => (
        <span key={href}>
          <span> / </span>
          {isLast ? <span>{label}</span> : <Link href={href}>{label}</Link>}
        </span>
      ))}
    </nav>
  );
}
```

**How it works:**
1. `usePathname()` returns the current URL path (e.g., `/products/1`)
2. Split the path into segments: `["products", "1"]`
3. Build cumulative hrefs: `/products`, `/products/1`
4. Capitalize segment names: `"products"` → `"Products"`
5. Last segment is plain text (current page), others are clickable links

**Added to root layout** (`app/layout.tsx`) so it appears on every page:
```tsx
<body>
  <header>
    <Breadcrumb />
  </header>
  {children}
</body>
```

---

### Step 4: 404 Not Found Page — `app/not-found.tsx`

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link href="/">Go Back Home</Link>
    </div>
  );
}
```

**When it triggers:**
- Visiting any URL that doesn't match a route (e.g., `/xyz`)
- Calling `notFound()` from a Server Component (e.g., invalid product ID)
- You can have **nested** `not-found.tsx` files — `app/products/not-found.tsx` handles 404s specifically within `/products/*`

---

### Step 5: Error Boundary — `app/error.tsx`

```tsx
"use client"; // error.tsx MUST be a Client Component

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <pre>{error.message}</pre>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}
```

**Key rules:**
- `error.tsx` **must** be a Client Component (`"use client"`)
- It receives `error` (the thrown error) and `reset` (function to retry)
- `reset()` re-renders the segment without a full page reload
- `error.digest` is a server-safe error hash (no sensitive info leaks to client)
- Errors bubble up — if `app/products/error.tsx` doesn't exist, `app/error.tsx` catches it

**Error boundary hierarchy:**
```
app/layout.tsx          ← NOT caught by app/error.tsx (use app/global-error.tsx)
├── app/error.tsx       ← catches errors from app/page.tsx and children
├── app/page.tsx
└── app/products/
    ├── error.tsx       ← catches errors in /products/* only
    └── [id]/page.tsx
```

---

### Step 6: Programmatic Navigation Demo — `app/navigation-demo/page.tsx`

**Route:** `/navigation-demo`

This page demonstrates all `useRouter()` methods:

| Method | Behavior |
|--------|----------|
| `router.push("/path")` | Navigate to path, **adds** history entry (user can go Back) |
| `router.replace("/path")` | Navigate to path, **replaces** current history entry |
| `router.back()` | Go back one step (like browser Back button) |
| `router.refresh()` | Re-fetch Server Component data without full page reload |
| `router.prefetch("/path")` | Preload the route in the background for faster navigation |

**When to use `push` vs `replace`:**
- **`push`** — normal navigation (product listing → product detail)
- **`replace`** — after login redirect, after form submission, replacing filters

---

## Quick Reference: Special Files in App Router

| File | Purpose | Required Directive |
|------|---------|--------------------|
| `page.tsx` | UI for this route | — |
| `layout.tsx` | Persistent wrapper for this route + children | — |
| `loading.tsx` | Suspense fallback while page loads | — |
| `error.tsx` | Error boundary for runtime errors | `"use client"` |
| `not-found.tsx` | 404 UI for this route | — |
| `route.ts` | API endpoint (GET, POST, etc.) | — |
| `template.tsx` | Like layout but re-mounts on navigation | — |
| `default.tsx` | Fallback for parallel routes | — |

---

## Routes Created in This Chapter

| URL | File | Description |
|-----|------|-------------|
| `/` | `app/page.tsx` | Home page |
| `/about` | `app/about/page.tsx` | About page |
| `/products` | `app/products/page.tsx` | Products listing |
| `/products/1` | `app/products/[id]/page.tsx` | Dynamic product detail |
| `/login` | `app/(auth)/login/page.tsx` | Login (route group) |
| `/navigation-demo` | `app/navigation-demo/page.tsx` | useRouter demo |
| Any invalid URL | `app/not-found.tsx` | 404 page |
| Runtime error | `app/error.tsx` | Error boundary |

---

## Summary

| What We Built | Key Concept Learned |
|---------------|-------------------|
| `app/products/[id]/page.tsx` | Dynamic routes, `generateStaticParams`, `generateMetadata`, `notFound()` |
| `app/(auth)/login/page.tsx` | Route groups, separate layouts, `"use client"` |
| `components/Breadcrumb.tsx` | `usePathname` hook, Client Components, path parsing |
| `app/not-found.tsx` | Global 404 handling, error hierarchy |
| `app/error.tsx` | Error boundaries, `reset()` function, `"use client"` requirement |
| `app/navigation-demo/page.tsx` | `useRouter().push/replace/back/refresh/prefetch` |
| Updated `app/layout.tsx` | Breadcrumb integration, shared header pattern |
