# Chapter 3: Next.js & React Foundations

---

## Part 1 — Theory & Concepts

### What is Next.js?

Next.js is a **full-stack React framework** built by Vercel. It extends React with production-grade features out of the box:

- **File-system routing** — folders and files inside `app/` automatically become URL routes.
- **Server-side rendering** — pages can be rendered on the server before being sent to the browser.
- **Automatic code-splitting** — only the JavaScript needed for the current page is loaded.
- **Built-in optimizations** — image, font, and script optimization come free.
- **API routes / Server Actions** — build backend logic without a separate server.

> **Think of Next.js as React + routing + server capabilities + build tooling, all in one.**

---

### SSR vs CSR vs SSG vs ISR — Rendering Strategies Explained

| Strategy | Full Name | When HTML is Generated | Use Case |
|----------|-----------|----------------------|----------|
| **CSR** | Client-Side Rendering | In the browser at runtime | Dashboards, authenticated apps, highly interactive UIs |
| **SSR** | Server-Side Rendering | On the server **per request** | Personalized pages, real-time data, SEO-critical content |
| **SSG** | Static Site Generation | At **build time** | Blogs, marketing pages, docs — content that rarely changes |
| **ISR** | Incremental Static Regeneration | At build time + **revalidated** on a timer | E-commerce product pages, news sites — stale-while-revalidate |

#### CSR (Client-Side Rendering)
```
Browser requests page → receives empty HTML shell → JavaScript downloads →
React renders UI in the browser → user sees content
```
- **Pros:** Rich interactivity, reduced server load
- **Cons:** Slow initial load, poor SEO (crawlers see empty page), spinner on first visit

#### SSR (Server-Side Rendering)
```
Browser requests page → server runs React → generates full HTML →
sends complete page to browser → JavaScript hydrates for interactivity
```
- **Pros:** Great SEO, fast first meaningful paint, always fresh data
- **Cons:** Slower TTFB (server must render every request), higher server cost

#### SSG (Static Site Generation)
```
At build time → Next.js pre-renders every page to static HTML →
pages served from CDN → instant load
```
- **Pros:** Fastest possible load, cheapest to host, perfect SEO
- **Cons:** Content is stale until next build, not suitable for dynamic data

#### ISR (Incremental Static Regeneration)
```
At build time → pages are pre-rendered → after revalidation interval →
next request triggers background regeneration → updated page served
```
- **Pros:** Combines SSG speed with fresh data, scales infinitely
- **Cons:** Content can be slightly stale within the revalidation window

#### How Next.js App Router handles this:

```tsx
// SSG (default) — page is statically generated at build time
export default function Page() {
  return <h1>Static Page</h1>;
}

// SSR — opt in with dynamic data fetching
export const dynamic = "force-dynamic"; // or use cookies(), headers()
export default async function Page() {
  const data = await fetch("https://api.example.com/data", { cache: "no-store" });
  return <h1>{data}</h1>;
}

// ISR — static with timed revalidation
export const revalidate = 60; // regenerate every 60 seconds
export default async function Page() {
  const data = await fetch("https://api.example.com/data");
  return <h1>{data}</h1>;
}
```

---

### Next.js vs Plain React vs Remix — Comparison

| Feature | Plain React (Vite/CRA) | Next.js | Remix |
|---------|----------------------|---------|-------|
| **Rendering** | CSR only | SSR, SSG, ISR, CSR | SSR, CSR |
| **Routing** | Manual (React Router) | File-system based | File-system based (nested) |
| **Data Fetching** | useEffect / React Query | Server Components, fetch | Loaders & Actions |
| **Server Components** | No | Yes (default) | Limited |
| **API Routes** | No (need separate server) | Yes (Route Handlers) | Yes (Actions) |
| **Static Export** | Yes | Yes | Limited |
| **Deployment** | Any static host | Vercel, self-host, Docker | Any Node.js host |
| **Learning Curve** | Low | Medium | Medium |
| **Bundle Size** | You control | Optimized automatically | Optimized automatically |
| **SEO** | Poor (CSR) | Excellent | Excellent |
| **Best For** | SPAs, prototypes | Full-stack apps, e-commerce | Data-heavy apps, forms |

**When to choose what:**
- **Plain React** → You're building a SPA (dashboard, admin panel) and don't need SEO.
- **Next.js** → You need SSR/SSG, SEO, full-stack capabilities, and a mature ecosystem.
- **Remix** → You want progressive enhancement, nested routing, and strong form handling.

---

## Part 2 — Hands-On: Setting Up the Project

### Step 1: Create the Next.js App

```bash
npx create-next-app@latest ecommerce-app --typescript --tailwind
```

**What this command does:**
- `npx create-next-app@latest` — runs the latest Next.js project scaffolder
- `ecommerce-app` — project/folder name
- `--typescript` — enables TypeScript (`.tsx` files, `tsconfig.json`)
- `--tailwind` — sets up Tailwind CSS with PostCSS

**Additional flags chosen during setup:**
- ESLint enabled for code quality
- App Router (not Pages Router)
- No `src/` directory — code lives at root level
- `@/*` import alias for clean imports
- Turbopack enabled for faster dev builds

---

### Step 2: Generated File Structure — Annotated

```
ecommerce-app/
│
├── app/                        # 🗂 APP ROUTER — Core of your application
│   ├── layout.tsx              #    Root layout — wraps ALL pages (global shell)
│   ├── page.tsx                #    Home page — renders at route "/"
│   ├── globals.css             #    Global styles + Tailwind imports
│   └── favicon.ico             #    Browser tab icon
│
├── public/                     # 🌐 STATIC ASSETS — Served as-is at root URL
│   ├── next.svg                #    Next.js logo
│   ├── vercel.svg              #    Vercel logo
│   ├── globe.svg               #    Globe icon
│   ├── file.svg                #    File icon
│   └── window.svg              #    Window icon
│
├── node_modules/               # 📦 DEPENDENCIES — Installed npm packages (gitignored)
│
├── .next/                      # ⚙️ BUILD OUTPUT — Generated by Next.js (gitignored)
│
├── package.json                # 📋 PROJECT MANIFEST — dependencies, scripts, metadata
├── package-lock.json           # 🔒 LOCK FILE — exact dependency versions
├── tsconfig.json               # 🔧 TYPESCRIPT CONFIG — compiler options, path aliases
├── next.config.ts              # ⚙️ NEXT.JS CONFIG — framework-level settings
├── postcss.config.mjs          # 🎨 POSTCSS CONFIG — Tailwind CSS plugin setup
├── eslint.config.mjs           # 📏 ESLINT CONFIG — linting rules
├── next-env.d.ts               # 📝 TYPE DECLARATIONS — auto-generated Next.js types
├── .gitignore                  # 🚫 GIT IGNORE — files excluded from version control
└── README.md                   # 📖 README — project documentation
```

#### Key Folders Explained:

**`app/` — The Application Directory**
This is where your entire app lives with the App Router. Key concepts:
- Every `page.tsx` file becomes a route
- Every `layout.tsx` file wraps its sibling and child pages
- Folders create URL segments: `app/about/page.tsx` → `/about`
- Special files: `loading.tsx`, `error.tsx`, `not-found.tsx`

**`public/` — Static Assets**
Files here are served at the root URL path:
- `public/logo.png` → accessible at `http://localhost:3000/logo.png`
- No processing — served exactly as-is
- Good for images, fonts, `robots.txt`, `sitemap.xml`

**`components/` — (You create this)**
Not generated by default, but conventionally created for reusable UI components:
```
components/
├── Header.tsx
├── Footer.tsx
├── ProductCard.tsx
└── ui/
    ├── Button.tsx
    └── Input.tsx
```

---

### Step 3: Understanding `app/layout.tsx` — The Global Shell

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Font optimization — Next.js downloads & self-hosts Google Fonts at build time
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata API — sets <title> and <meta> tags for SEO
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// RootLayout wraps EVERY page in your app
// The {children} prop receives the current page component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Key concepts:**
1. **`layout.tsx` is the global shell** — it wraps every page. Think of it like `index.html` in a traditional React app.
2. **`{children}` is the current page** — when you visit `/`, children = `app/page.tsx`. When you visit `/about`, children = `app/about/page.tsx`.
3. **Layouts don't re-render on navigation** — only the `{children}` (page content) changes. This makes navigation fast.
4. **Font optimization** — `next/font/google` downloads fonts at build time and self-hosts them. No external requests, no layout shift.
5. **Metadata export** — a type-safe way to set `<title>`, `<meta>`, Open Graph tags, etc.

**Layout nesting diagram:**
```
RootLayout (app/layout.tsx)
├── HomePage (app/page.tsx)           → route: /
├── AboutPage (app/about/page.tsx)    → route: /about
└── ShopLayout (app/shop/layout.tsx)  → nested layout for /shop/*
    ├── ShopPage (app/shop/page.tsx)  → route: /shop
    └── ProductPage (app/shop/[id]/page.tsx) → route: /shop/123
```

---

### Step 4: Understanding `app/page.tsx` — The Home Page

```tsx
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main>
        <Image src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
        <h1>To get started, edit the page.tsx file.</h1>
        {/* ... buttons and links ... */}
      </main>
    </div>
  );
}
```

**Key concepts:**
1. **`export default function`** — the default export becomes the page component for that route.
2. **No `"use client"` directive** — this is a **Server Component** by default (runs on the server, not in the browser).
3. **`next/image`** — optimized image component with lazy loading, responsive sizing, and format conversion.
4. **`priority`** — tells Next.js to preload this image (use for above-the-fold images).

---

### Step 5: Creating the About Page

Created `app/about/page.tsx` — this file automatically creates the `/about` route:

```tsx
export default function AboutPage() {
  return (
    <div>
      <main>
        <h1>About Us</h1>
        <p>Welcome to ecommerce-app — a Next.js-powered online store.</p>
        <section>
          <h2>Our Tech Stack</h2>
          <ul>
            <li>Next.js 16 — React framework with App Router, SSR & SSG</li>
            <li>React 19 — UI library with Server Components</li>
            <li>TypeScript — Type-safe JavaScript</li>
            <li>Tailwind CSS 4 — Utility-first CSS framework</li>
          </ul>
        </section>
        <a href="/">← Back to Home</a>
      </main>
    </div>
  );
}
```

**Routing rule:** `app/about/page.tsx` → URL path `/about`. The folder name becomes the URL segment.

---

### Step 6: Running the Dev Server

```bash
npm run dev
```

Output:
```
▲ Next.js 16.2.6 (Turbopack)
- Local:    http://localhost:3000
- Network:  http://192.168.29.111:3000
✓ Ready in 417ms
```

**What to observe:**
1. Visit `http://localhost:3000` — see the home page
2. Visit `http://localhost:3000/about` — see the about page
3. Edit `app/page.tsx` and save — **hot-reload** updates the browser instantly without a full refresh
4. The terminal shows route compilation logs as you navigate

**Turbopack** (enabled by default in Next.js 15+) is the Rust-based successor to Webpack, providing significantly faster dev builds.

---

### Step 7: Understanding Routing Basics

Next.js App Router uses **file-system based routing**:

| File Path | URL Route | Description |
|-----------|-----------|-------------|
| `app/page.tsx` | `/` | Home page |
| `app/about/page.tsx` | `/about` | About page |
| `app/shop/page.tsx` | `/shop` | Shop page |
| `app/shop/[id]/page.tsx` | `/shop/123` | Dynamic route (product detail) |
| `app/blog/[...slug]/page.tsx` | `/blog/2024/my-post` | Catch-all route |
| `app/(marketing)/pricing/page.tsx` | `/pricing` | Route group (no URL segment) |

**Special files in any route folder:**
| File | Purpose |
|------|---------|
| `page.tsx` | The UI for this route |
| `layout.tsx` | Shared wrapper for this route and children |
| `loading.tsx` | Loading UI (shown while page loads) |
| `error.tsx` | Error boundary for this route |
| `not-found.tsx` | 404 UI for this route |
| `route.ts` | API endpoint (no UI) |

---

## Key `package.json` Scripts

```json
{
  "scripts": {
    "dev": "next dev",       // Start dev server with hot-reload
    "build": "next build",   // Create production build
    "start": "next start",   // Start production server
    "lint": "eslint"         // Run ESLint checks
  }
}
```

---

## Quick Reference: Key Config Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js framework configuration (redirects, env vars, image domains) |
| `tsconfig.json` | TypeScript compiler options + `@/*` path alias |
| `postcss.config.mjs` | PostCSS plugins — Tailwind CSS integration |
| `eslint.config.mjs` | ESLint rules — Next.js core web vitals + TypeScript |
| `globals.css` | Global styles, Tailwind import, CSS variables |

---

## Summary

| What We Did | Result |
|-------------|--------|
| Learned SSR vs CSR vs SSG vs ISR | Understand when to use each rendering strategy |
| Compared Next.js vs React vs Remix | Know which framework fits which use case |
| Ran `create-next-app` | Scaffolded a full project with TS + Tailwind |
| Explored file structure | Understand every file's purpose |
| Created `app/about/page.tsx` | Learned file-system routing |
| Ran `npm run dev` | Dev server with hot-reload at localhost:3000 |
| Read `layout.tsx` | Understand the global shell / layout nesting concept |
