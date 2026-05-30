# Chapter 7: Layouts, Metadata & SEO Foundation

---

## Part 1 — Theory & Concepts

### Root Layout vs Nested Layouts — Composition

In the App Router, **layouts** are UI that wraps pages and persists across navigations.

```
app/
├── layout.tsx              ← ROOT LAYOUT (required, wraps everything)
├── page.tsx                ← Home page
└── products/
    ├── layout.tsx          ← NESTED LAYOUT (wraps all /products/* pages)
    ├── page.tsx            ← Products listing
    └── [id]/
        └── page.tsx        ← Product detail
```

**Key rules:**

| Rule | Detail |
|------|--------|
| Root layout is required | Must include `<html>` and `<body>` tags |
| Layouts don't re-render | Only `{children}` (the page) changes on navigation |
| Layouts are composable | Root → Nested → Page (like Russian dolls) |
| Layouts fetch data | They can be async Server Components |
| Layouts share UI | Sidebars, headers, navigation persist across pages |

**How nesting works:**
```
Visit /products/1:

RootLayout (header, cart, font)
└── ProductsLayout (sidebar with categories)
    └── ProductDetailPage (product info + reviews)
```

When navigating from `/products/1` to `/products/2`:
- RootLayout stays mounted (no re-render)
- ProductsLayout stays mounted (sidebar persists)
- Only the page content changes

---

### Metadata API: Static and Dynamic Metadata

Next.js provides a type-safe **Metadata API** for SEO. No more manually managing `<head>`.

#### Static Metadata (exported object)

```tsx
// app/layout.tsx or any page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Store",
  description: "Best products online",
};
```

#### Dynamic Metadata (function)

```tsx
// app/products/[id]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return {
    title: product.name,
    description: product.description,
  };
}
```

#### Metadata inheritance and merging:

```
Root layout:     title.template = "%s | Ecommerce App"
Products layout: title = "Products"        → renders as: "Products | Ecommerce App"
Product detail:  title = "Headphones"      → renders as: "Headphones | Ecommerce App"
```

---

### `generateMetadata()` Function for Dynamic Pages

```tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Not Found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      images: [{ url: product.thumbnail }],
    },
  };
}
```

**Key points:**
- `generateMetadata` is async — can fetch data
- Next.js deduplicates fetches — if both `generateMetadata` and the page call `getProductById(id)`, only ONE network request is made
- Runs on the server — safe to access databases/secrets
- Return type is `Metadata` — fully typed

---

### Open Graph and Twitter Card Metadata

#### Open Graph (Facebook, LinkedIn, Discord, Slack)

```tsx
export const metadata: Metadata = {
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ecommerce App",
    title: "Product Name",
    description: "Product description",
    url: "https://example.com/products/1",
    images: [
      {
        url: "https://example.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Product preview",
      },
    ],
  },
};
```

#### Twitter Card

```tsx
export const metadata: Metadata = {
  twitter: {
    card: "summary_large_image",    // or "summary", "player", "app"
    title: "Product Name",
    description: "Product description",
    creator: "@username",
    images: ["https://example.com/twitter-image.jpg"],
  },
};
```

**Generated HTML:**
```html
<meta property="og:title" content="Product Name" />
<meta property="og:description" content="Product description" />
<meta property="og:image" content="https://example.com/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Product Name" />
<meta name="twitter:image" content="https://example.com/twitter-image.jpg" />
```

---

### Favicon, Manifest, and App Icons

Next.js supports favicon/icons via the Metadata API or special file conventions:

#### Metadata API approach:
```tsx
export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
    shortcut: "/shortcut-icon.png",
  },
  manifest: "/manifest.json",
};
```

#### File convention approach:
Place these files in `app/`:
```
app/
├── favicon.ico           → <link rel="icon" href="/favicon.ico">
├── icon.png              → <link rel="icon" type="image/png" href="/icon.png">
├── apple-icon.png        → <link rel="apple-touch-icon" href="/apple-icon.png">
└── opengraph-image.png   → Used as default OG image for all pages
```

#### Web Manifest (`public/manifest.json`):
```json
{
  "name": "Ecommerce App",
  "short_name": "EcomApp",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    { "src": "/favicon.ico", "sizes": "48x48", "type": "image/x-icon" }
  ]
}
```

---

### Font Optimization with `next/font`

`next/font` downloads fonts at build time and self-hosts them — zero external requests, no layout shift.

#### Google Fonts (`next/font/google`)

```tsx
import { Inter, Fira_Code } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",    // CSS variable name
  display: "swap",             // Show fallback immediately, swap when loaded
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${firaCode.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

#### Connect to Tailwind CSS:
```css
/* globals.css */
@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-fira-code);
}
```

#### Local Fonts (`next/font/local`)

```tsx
import localFont from "next/font/local";

const myFont = localFont({
  src: "../public/fonts/MyFont.woff2",
  variable: "--font-custom",
  display: "swap",
});
```

**Benefits of next/font:**
- No external network requests (fonts are bundled)
- No Cumulative Layout Shift (size-adjust calculated automatically)
- Privacy: no requests to Google's servers
- Automatic subset optimization (only characters you use)

---

## Part 2 — Hands-On Implementation

### Updated Project Structure

```
ecommerce-app/
├── app/
│   ├── layout.tsx              # Root layout — Inter font, full Metadata API
│   ├── globals.css             # Updated: --font-inter as sans
│   ├── products/
│   │   ├── layout.tsx          # NEW: Nested layout with sidebar
│   │   ├── page.tsx            # Simplified (sidebar handles nav)
│   │   ├── loading.tsx         # Updated wrapper
│   │   └── [id]/
│   │       ├── page.tsx        # Enhanced generateMetadata with OG + Twitter
│   │       └── loading.tsx     # Updated wrapper
│   └── ...
└── public/
    └── manifest.json           # NEW: Web manifest for PWA
```

---

### Step 1: Root Layout — Font + Full Metadata

```tsx
// app/layout.tsx
import { Inter, Geist_Mono } from "next/font/google";

// Inter — a popular, highly readable sans-serif font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Title template — child pages provide the %s value
  title: {
    default: "Ecommerce App — Next.js Store",
    template: "%s | Ecommerce App",
  },
  description: "A modern e-commerce store built with Next.js...",
  keywords: ["ecommerce", "next.js", "react", "typescript"],
  authors: [{ name: "React Training" }],

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ecommerce App",
    title: "Ecommerce App — Next.js Store",
    description: "A modern e-commerce store...",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Ecommerce App — Next.js Store",
    creator: "@reacttraining",
  },

  // Icons & manifest
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png" },
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
};
```

**Title template in action:**
| Page | `title` export | Rendered `<title>` |
|------|---------------|-------------------|
| Root (default) | — | "Ecommerce App — Next.js Store" |
| Products layout | `"Products"` | "Products \| Ecommerce App" |
| Product detail | `"Wireless Headphones"` | "Wireless Headphones \| Ecommerce App" |

---

### Step 2: Tailwind CSS — Using Inter Font Variable

```css
/* app/globals.css */
@theme inline {
  --font-sans: var(--font-inter);     /* Changed from --font-geist-sans */
  --font-mono: var(--font-geist-mono);
}
```

Now `font-sans` in Tailwind uses Inter everywhere. The CSS variable `--font-inter` is set on `<html>` via the `inter.variable` className.

---

### Step 3: Nested Products Layout with Sidebar

```tsx
// app/products/layout.tsx
import { getProducts } from "@/lib/products";
import Link from "next/link";

// Nested metadata — merges with root layout's title.template
export const metadata: Metadata = {
  title: "Products",
  description: "Browse our full catalog of products.",
  openGraph: {
    title: "Shop Products — Ecommerce App",
    description: "Browse our full catalog of products.",
  },
};

export default async function ProductsLayout({ children }) {
  // Fetch categories for the sidebar (server component — direct async)
  const products = await getProducts();
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="flex flex-1">
      {/* Sidebar — PERSISTS across /products and /products/[id] */}
      <aside className="hidden md:flex w-56 flex-col border-r p-6">
        <nav>
          <Link href="/products">All Products</Link>
          <Link href="/">← Back to Home</Link>
        </nav>
        <nav>
          <h2>Categories</h2>
          {categories.map((cat) => <span key={cat}>{cat}</span>)}
        </nav>
        <p>{products.length} products available</p>
      </aside>

      {/* Page content changes, sidebar stays */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
```

**Key concepts:**
1. **Sidebar persists** — navigating between `/products` and `/products/1` doesn't re-render the sidebar
2. **Async layout** — fetches product categories on the server
3. **Nested metadata** — `title: "Products"` becomes "Products | Ecommerce App" via the template
4. **Layout-level OG** — provides default Open Graph for all product pages

---

### Step 4: `generateMetadata()` with Open Graph Images

```tsx
// app/products/[id]/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name, // Becomes "Headphones | Ecommerce App" via template

    description: product.description,

    // Open Graph — rich link previews
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      url: `https://ecommerce-app.example.com/products/${id}`,
      images: [{
        url: product.thumbnail,  // Product image as OG image
        width: 400,
        height: 400,
        alt: product.name,
      }],
    },

    // Twitter Card — rich tweet previews
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.thumbnail],
    },
  };
}
```

**Generated HTML for `/products/1`:**
```html
<title>Essence Mascara Lash Princess | Ecommerce App</title>
<meta name="description" content="The Essence Mascara Lash Princess..." />
<meta property="og:title" content="Essence Mascara Lash Princess" />
<meta property="og:image" content="https://cdn.dummyjson.com/products/images/..." />
<meta property="og:url" content="https://ecommerce-app.example.com/products/1" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Essence Mascara Lash Princess" />
<meta name="twitter:image" content="https://cdn.dummyjson.com/products/images/..." />
```

---

### Step 5: Web Manifest — `public/manifest.json`

```json
{
  "name": "Ecommerce App",
  "short_name": "EcomApp",
  "description": "A modern e-commerce store built with Next.js",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    { "src": "/favicon.ico", "sizes": "48x48", "type": "image/x-icon" }
  ]
}
```

Referenced in root layout metadata via `manifest: "/manifest.json"`. This enables "Add to Home Screen" on mobile devices.

---

## Metadata Inheritance & Merging Rules

```
Root Layout metadata (base)
│
├── openGraph.siteName: "Ecommerce App"     ← inherited by ALL pages
├── title.template: "%s | Ecommerce App"    ← applied to child titles
├── twitter.creator: "@reacttraining"        ← inherited
│
└── Products Layout metadata (merge)
    │
    ├── title: "Products"                    ← renders "Products | Ecommerce App"
    ├── openGraph.title: "Shop Products"     ← overrides parent's OG title
    │
    └── Product [id] metadata (merge)
        │
        ├── title: "Headphones"              ← renders "Headphones | Ecommerce App"
        ├── openGraph.title: "Headphones"    ← overrides
        ├── openGraph.images: [...]          ← adds product-specific image
        └── twitter.images: [...]            ← adds product-specific image
```

**Rules:**
- Child metadata **overrides** parent for same keys
- `title.template` from parent is applied to child `title` strings
- Arrays (like `keywords`) are replaced, not merged
- Nested objects (like `openGraph`) are shallow-merged

---

## Quick Reference: Metadata API Fields

| Field | Type | Purpose |
|-------|------|---------|
| `title` | `string \| { default, template }` | Page title and template |
| `description` | `string` | Meta description for SEO |
| `keywords` | `string[]` | Meta keywords |
| `authors` | `{ name, url }[]` | Page authors |
| `openGraph` | `object` | Facebook/LinkedIn/Discord previews |
| `twitter` | `object` | Twitter/X card previews |
| `icons` | `object` | Favicons and app icons |
| `manifest` | `string` | Web manifest URL |
| `robots` | `object` | Crawling directives |
| `alternates` | `object` | Canonical URL, hreflang |
| `verification` | `object` | Google/Bing verification codes |

---

## Files Created / Modified

| File | Action | Purpose |
|------|--------|---------|
| `app/layout.tsx` | Modified | Inter font, full Metadata API (OG, Twitter, icons, manifest, title template) |
| `app/globals.css` | Modified | `--font-sans: var(--font-inter)` |
| `app/products/layout.tsx` | Created | Nested layout with sidebar, categories from API, nested metadata |
| `app/products/page.tsx` | Modified | Simplified wrapper (sidebar handles navigation) |
| `app/products/loading.tsx` | Modified | Updated to match new layout structure |
| `app/products/[id]/page.tsx` | Modified | Enhanced generateMetadata with OG images + Twitter cards |
| `app/products/[id]/loading.tsx` | Modified | Updated to match new layout structure |
| `public/manifest.json` | Created | Web manifest for PWA support |

---

## Summary

| What We Built | Key Concept Learned |
|---------------|-------------------|
| Products nested layout with sidebar | Layouts persist across navigation, compose vertically |
| Root metadata with title template | `title.template: "%s | Ecommerce App"` — child pages slot into template |
| Static metadata (root + products) | Exported `metadata` object for pages with known content |
| Dynamic `generateMetadata()` | Async function for data-dependent metadata (per-product SEO) |
| Open Graph + Twitter cards | Rich link previews with product images |
| Favicon + manifest | App icons and PWA support |
| Inter font via `next/font/google` | Self-hosted, zero layout shift, privacy-friendly |
| Font → Tailwind integration | CSS variable `--font-inter` mapped to Tailwind's `font-sans` |
