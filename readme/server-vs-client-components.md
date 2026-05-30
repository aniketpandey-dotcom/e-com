# Chapter 5: Server Components vs Client Components

---

## Part 1 — Theory & Concepts

### The `"use client"` Directive — When and Why

In the App Router, **every component is a Server Component by default**. To make a component run in the browser, you must add `"use client"` at the top of the file.

```tsx
// Server Component (default) — runs on the server
export default function ProductCard() { ... }

// Client Component — runs in the browser
"use client";
export default function AddToCartButton() { ... }
```

**When to add `"use client"`:**

| Need `"use client"` | Don't need it |
|---------------------|---------------|
| `useState`, `useReducer` | Static UI, text, images |
| `useEffect`, `useRef` | Data fetching (async/await) |
| `onClick`, `onChange` handlers | Database/file system access |
| Browser APIs (`window`, `localStorage`) | Importing server-only modules |
| `useContext` (consuming context) | `generateMetadata`, `generateStaticParams` |
| `useRouter`, `usePathname` | `redirect()`, `notFound()` |

**Rule of thumb:** If it needs interactivity or browser APIs, it's a Client Component. Everything else stays as a Server Component.

---

### Server Components: Zero JS Bundle, Direct Data Access

Server Components are the default in App Router. They run **only on the server** and send pure HTML to the browser.

```tsx
// This is a Server Component — NO "use client" directive
import { db } from "@/lib/database";

export default async function ProductList() {
  // ✅ Direct database access — this code NEVER reaches the browser
  const products = await db.query("SELECT * FROM products");

  // ✅ console.log appears in the server terminal, NOT browser devtools
  console.log(`Fetched ${products.length} products`);

  // ✅ Server-only secrets are safe here
  const apiKey = process.env.SECRET_API_KEY;

  return (
    <ul>
      {products.map((p) => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

**Benefits:**
- **Zero JavaScript sent** — the component's code is not in the browser bundle
- **Direct data access** — query databases, read files, call internal APIs
- **Secrets are safe** — environment variables never leak to the client
- **Async/await** — components can be `async` functions (no `useEffect`)
- **Smaller bundles** — heavy libraries (markdown parsers, date libs) stay on the server

**Limitations:**
- No `useState`, `useEffect`, `useRef`
- No event handlers (`onClick`, `onChange`)
- No browser APIs (`window`, `document`, `localStorage`)
- No React context consumption (`useContext`)

---

### Client Components: Interactivity, useState, useEffect

Client Components run in the browser and handle all interactive UI.

```tsx
"use client";

import { useState } from "react";

export default function AddToCartButton({ productId, name, price }) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    // ✅ This log appears in the BROWSER console
    console.log(`Adding ${name} to cart`);
    setAdded(true);
  }

  return (
    <button onClick={handleClick}>
      {added ? "✓ Added" : "Add to Cart"}
    </button>
  );
}
```

**Client Components are needed for:**
- State management (`useState`, `useReducer`)
- Side effects (`useEffect`)
- Event handlers (`onClick`, `onSubmit`, `onChange`)
- Browser APIs (`window`, `localStorage`, `IntersectionObserver`)
- Custom hooks that use any of the above
- Third-party libraries that use hooks internally

**Important:** Client Components are **still server-rendered** on initial load (SSR). The `"use client"` directive means the component's JS is also sent to the browser for hydration and interactivity — it does NOT mean "skip the server".

---

### Component Composition: Server Wraps Client

The key pattern in App Router is: **Server Components can import and render Client Components, but NOT vice versa.**

```
✅ Server → Client (server wraps client)
❌ Client → Server (client cannot import server)
✅ Client receives Server output as {children} prop
```

#### Pattern: Server Component wraps Client Component

```tsx
// ProductCard.tsx — SERVER component
import AddToCartButton from "./AddToCartButton"; // Client component

export default function ProductCard({ product }) {
  // Server-side rendering of product info (zero JS)
  return (
    <div>
      <h2>{product.name}</h2>
      <p>${product.price}</p>

      {/* Client component nested inside — only THIS ships JS */}
      <AddToCartButton
        productId={product.id}
        productName={product.name}
        price={product.price}
      />
    </div>
  );
}
```

```tsx
// AddToCartButton.tsx — CLIENT component
"use client";
import { useState } from "react";

export default function AddToCartButton({ productId, productName, price }) {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Add ({count})</button>;
}
```

**Result:** The product name, price, and description are rendered as static HTML (zero JS). Only the AddToCartButton ships JavaScript to the browser.

#### Pattern: Passing Server Components as `children`

```tsx
// app/layout.tsx — SERVER component
import { CartProvider } from "@/contexts/CartContext"; // Client component

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* CartProvider is a Client Component, but {children} can be Server Components */}
        <CartProvider>
          {children}  {/* ← Server Component pages passed as serialized React nodes */}
        </CartProvider>
      </body>
    </html>
  );
}
```

This works because `{children}` is passed as a **serialized prop** — the Server Components are already rendered to a React tree before being passed to the Client Component.

---

### Serialized Props Rule Between Server and Client

When a Server Component passes props to a Client Component, those props must be **serializable** (convertible to JSON).

**Allowed props (serializable):**
```tsx
// ✅ All of these can cross the server → client boundary
<ClientComponent
  name="Headphones"           // string
  price={79.99}               // number
  inStock={true}              // boolean
  tags={["audio", "wireless"]} // array of primitives
  metadata={{ color: "black" }} // plain object
  createdAt={new Date()}      // Date (special-cased by React)
/>
```

**NOT allowed (non-serializable):**
```tsx
// ❌ These CANNOT be passed from server to client
<ClientComponent
  onClick={() => alert("hi")}  // ❌ Functions
  dbConnection={db}            // ❌ Class instances
  component={<ServerComp />}   // ❌ Server Component elements (use children instead)
  ref={myRef}                  // ❌ Refs
/>
```

**Error you'll see:**
```
Error: Functions cannot be passed directly to Client Components unless you
explicitly expose it by marking it with "use server".
```

**Workaround for functions:** Use Server Actions (`"use server"`) to pass server-side functions to Client Components.

---

### Context and Providers in App Router

React Context requires `"use client"` because `useContext` is a client hook. The recommended pattern:

#### Step 1: Create a Client Context provider

```tsx
// contexts/CartContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  // ... cart logic
  return (
    <CartContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
```

#### Step 2: Wrap in the Server Component layout

```tsx
// app/layout.tsx — SERVER component
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CartProvider>
          {children}  {/* Server Component pages work inside Client provider */}
        </CartProvider>
      </body>
    </html>
  );
}
```

#### Step 3: Consume in any Client Component

```tsx
// components/AddToCartButton.tsx
"use client";
import { useCart } from "@/contexts/CartContext";

export default function AddToCartButton({ productId, name, price }) {
  const { addItem } = useCart();
  return <button onClick={() => addItem({ productId, name, price })}>Add</button>;
}
```

**Important:** Only Client Components can consume context via `useContext`. Server Components cannot use context — pass data via props or fetch directly instead.

---

## Part 2 — Hands-On Implementation

### Updated Project Structure

```
ecommerce-app/
├── app/
│   ├── layout.tsx                  # Server Component — wraps with CartProvider
│   ├── products/
│   │   ├── page.tsx                # Server Component — uses ProductList
│   │   └── [id]/page.tsx           # Server Component — uses AddToCartButton
│   └── ...
│
├── components/
│   ├── ProductList.tsx             # ⬜ SERVER — async data fetching, server logs
│   ├── ProductCard.tsx             # ⬜ SERVER — renders product, nests client button
│   ├── AddToCartButton.tsx         # 🟦 CLIENT — "use client", onClick, useCart
│   ├── CartIndicator.tsx           # 🟦 CLIENT — "use client", useCart for header
│   └── Breadcrumb.tsx              # 🟦 CLIENT — "use client", usePathname
│
├── contexts/
│   └── CartContext.tsx             # 🟦 CLIENT — "use client", createContext, useState
│
└── lib/
    └── products.ts                 # ⬜ SERVER — data layer, console.log on server
```

Legend: ⬜ Server Component | 🟦 Client Component (`"use client"`)

---

### Step 1: Shared Data Layer — `lib/products.ts`

```tsx
// lib/products.ts — runs ONLY on the server (no "use client")

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
}

// Simulate async data fetching
export async function getProducts(): Promise<Product[]> {
  // This log appears in the SERVER terminal
  console.log(`[SERVER] Fetching all products at ${new Date().toISOString()}`);
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  console.log(`[SERVER] Fetching product id=${id} at ${new Date().toISOString()}`);
  return products.find((p) => p.id === id);
}
```

**Why a separate `lib/` module?** Centralizes data and avoids duplicating product arrays across files. In a real app, these functions would query a database.

---

### Step 2: ProductList Server Component — `components/ProductList.tsx`

```tsx
// components/ProductList.tsx — SERVER component (no "use client")
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default async function ProductList() {
  const products = await getProducts(); // Direct async data fetching

  // This log appears in your TERMINAL, not the browser
  console.log(`[SERVER] ProductList rendered with ${products.length} products`);

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**What to observe:**
- No `useEffect`, no `useState`, no loading spinner — data is available immediately
- `console.log` appears in the terminal where `npm run dev` is running
- Open browser DevTools → Console — you will NOT see these logs there

---

### Step 3: ProductCard Server Component with Client AddToCartButton

```tsx
// components/ProductCard.tsx — SERVER component
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({ product }) {
  console.log(`[SERVER] Rendering ProductCard for "${product.name}"`);

  return (
    <div>
      <h2>{product.name}</h2>
      <p>${product.price}</p>

      {/* Client Component — only this part ships JS to browser */}
      <AddToCartButton
        productId={product.id}      // ✅ string — serializable
        productName={product.name}  // ✅ string — serializable
        price={product.price}       // ✅ number — serializable
      />
    </div>
  );
}
```

```tsx
// components/AddToCartButton.tsx — CLIENT component
"use client";

import { useCart } from "@/contexts/CartContext";

export default function AddToCartButton({ productId, productName, price }) {
  const { addItem, items } = useCart();
  const quantity = items.find((i) => i.productId === productId)?.quantity ?? 0;

  function handleAddToCart() {
    console.log(`[CLIENT] Adding "${productName}" to cart`); // Browser console
    addItem({ productId, name: productName, price, quantity: 1 });
  }

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      {quantity > 0 && <span>({quantity} in cart)</span>}
    </div>
  );
}
```

**Composition pattern visualization:**
```
ProductCard (Server)          → zero JS in bundle
├── <h2>{product.name}</h2>   → static HTML
├── <p>${product.price}</p>   → static HTML
└── <AddToCartButton />       → CLIENT boundary
    ├── onClick handler       → JS sent to browser
    └── useCart context        → JS sent to browser
```

---

### Step 4: CartContext Provider — `contexts/CartContext.tsx`

```tsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  // ... removeItem, updateQuantity, clearCart ...

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within <CartProvider>");
  return context;
}
```

---

### Step 5: Wrapping CartProvider in App Layout

```tsx
// app/layout.tsx — SERVER component that wraps children in a Client provider
import { CartProvider } from "@/contexts/CartContext";
import CartIndicator from "@/components/CartIndicator";
import Breadcrumb from "@/components/Breadcrumb";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <header>
            <Breadcrumb />
            <CartIndicator />    {/* Shows cart count from context */}
          </header>
          {children}             {/* Server Component pages work here */}
        </CartProvider>
      </body>
    </html>
  );
}
```

**How this works:**
1. `RootLayout` is a Server Component
2. It renders `<CartProvider>` (a Client Component) passing `{children}` as a prop
3. `{children}` contains Server Component pages — they're already rendered to a React tree
4. The serialized Server Component output is passed through the Client Component
5. `CartIndicator` and `AddToCartButton` can consume the cart context

---

### Step 6: Verify — Server Component JS Not in Bundle

**How to verify in browser DevTools:**

1. Open `http://localhost:3000/products` in Chrome
2. Open DevTools → **Sources** tab → search for `[SERVER]`
3. You will NOT find `ProductList`, `ProductCard`, or `lib/products` code in any JS bundle
4. You WILL find `AddToCartButton` and `CartContext` code (they're Client Components)

**Check the Network tab:**
1. DevTools → **Network** → filter by **JS**
2. The JS bundles do NOT contain ProductList or ProductCard code
3. Only interactive components (AddToCartButton, CartIndicator, Breadcrumb) are in the JS

**Check the terminal:**
```
[SERVER] Fetching all products at 2026-05-30T07:28:09.381Z
[SERVER] ProductList rendered with 4 products at 2026-05-30T07:28:09.387Z
[SERVER] Rendering ProductCard for "Wireless Headphones"
[SERVER] Rendering ProductCard for "Running Shoes"
[SERVER] Rendering ProductCard for "Coffee Maker"
[SERVER] Rendering ProductCard for "Backpack"
```
These logs appear ONLY in the terminal — confirming these components run exclusively on the server.

---

## Quick Reference: Server vs Client Decision Tree

```
Does this component need...
│
├── useState / useReducer?           → "use client"
├── useEffect / useRef?              → "use client"
├── onClick / onChange handlers?     → "use client"
├── useContext?                      → "use client"
├── useRouter / usePathname?         → "use client"
├── Browser APIs (window, etc.)?     → "use client"
│
├── async data fetching?             → Server Component ✅
├── Database / file system access?   → Server Component ✅
├── Environment secrets?             → Server Component ✅
├── Heavy libraries (markdown, etc)? → Server Component ✅
└── Pure display (no interactivity)? → Server Component ✅
```

---

## Common Mistakes & Fixes

| Mistake | Error | Fix |
|---------|-------|-----|
| Using `useState` without `"use client"` | `useState` is not a function | Add `"use client"` to the file |
| Importing Server Component in Client | Module not found / hydration error | Pass as `{children}` prop instead |
| Passing a function from Server → Client | Functions cannot be passed to Client Components | Use Server Actions (`"use server"`) |
| Using `useContext` in Server Component | `useContext` is not available | Move to a Client Component |
| Putting `"use client"` on a page that fetches data | Loses Server Component benefits | Extract interactive parts to a separate Client Component |

---

## Files Created / Modified

| File | Type | What Changed |
|------|------|-------------|
| `lib/products.ts` | New | Shared product data with async getters + server logging |
| `components/ProductList.tsx` | New | Server Component — fetches data, logs on server |
| `components/ProductCard.tsx` | New | Server Component — renders product, nests AddToCartButton |
| `components/AddToCartButton.tsx` | New | Client Component — `"use client"`, onClick, useCart |
| `components/CartIndicator.tsx` | New | Client Component — displays cart count in header |
| `contexts/CartContext.tsx` | New | Client Component — CartProvider with useState, useCallback |
| `app/layout.tsx` | Modified | Wrapped with CartProvider, added CartIndicator to header |
| `app/products/page.tsx` | Modified | Now uses ProductList server component |
| `app/products/[id]/page.tsx` | Modified | Uses shared data layer + AddToCartButton |

---

## Summary

| What We Built | Key Concept Learned |
|---------------|-------------------|
| `lib/products.ts` | Server-only data layer — `console.log` in terminal only |
| `ProductList` (server) | Async Server Component — direct data fetch, zero JS bundle |
| `ProductCard` (server) | Composition — server wraps client at the boundary |
| `AddToCartButton` (client) | `"use client"` — interactivity, context consumption |
| `CartContext` provider | Context in App Router — always a Client Component |
| `CartProvider` in layout | Server wraps Client pattern — `{children}` serialization |
| Browser DevTools check | Verify server code absent from JS bundles |
