// Data fetching layer — fetches from dummyjson.com public API
// This module runs ONLY on the server (no "use client" directive)

const API_BASE = "https://dummyjson.com";

// --- Types ---

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  thumbnail: string;
  rating: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

// --- API response types (internal) ---

interface DummyJsonProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  thumbnail: string;
  rating: number;
  reviews?: DummyJsonReview[];
}

interface DummyJsonReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface DummyJsonProductsResponse {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
}

// --- Mapper ---

function mapProduct(p: DummyJsonProduct): Product {
  return {
    id: String(p.id),
    name: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    stock: p.stock,
    thumbnail: p.thumbnail,
    rating: p.rating,
  };
}

// --- Data fetching functions ---

// Fetch all products — uses force-cache (SSG by default, cached across requests)
export async function getProducts(): Promise<Product[]> {
  console.log(`[SERVER] Fetching all products at ${new Date().toISOString()}`);

  const res = await fetch(`${API_BASE}/products?limit=12&select=id,title,price,description,category,stock,thumbnail,rating`, {
    // force-cache: response is cached indefinitely until revalidated
    // This is the default in Next.js, shown explicitly for learning
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }

  const data: DummyJsonProductsResponse = await res.json();
  return data.products.map(mapProduct);
}

// Fetch a single product — uses time-based revalidation (ISR)
export async function getProductById(id: string): Promise<Product | undefined> {
  console.log(`[SERVER] Fetching product id=${id} at ${new Date().toISOString()}`);

  const res = await fetch(`${API_BASE}/products/${id}`, {
    // Revalidate every 3600 seconds (1 hour) — ISR pattern
    next: { revalidate: 3600 },
  });

  if (res.status === 404) return undefined;
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}: ${res.status} ${res.statusText}`);
  }

  const data: DummyJsonProduct = await res.json();
  return mapProduct(data);
}

// Fetch reviews for a product — uses no-store (always fresh, SSR)
export async function getProductReviews(id: string): Promise<Review[]> {
  console.log(`[SERVER] Fetching reviews for product id=${id} at ${new Date().toISOString()}`);

  const res = await fetch(`${API_BASE}/products/${id}?select=reviews`, {
    // no-store: never cache, always fetch fresh data (SSR)
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch reviews for product ${id}: ${res.status}`);
  }

  const data: { reviews?: DummyJsonReview[] } = await res.json();
  return (data.reviews ?? []).map((r) => ({
    rating: r.rating,
    comment: r.comment,
    date: r.date,
    reviewerName: r.reviewerName,
    reviewerEmail: r.reviewerEmail,
  }));
}

// Fetch product AND reviews in PARALLEL using Promise.all()
export async function getProductWithReviews(id: string): Promise<{
  product: Product | undefined;
  reviews: Review[];
}> {
  console.log(`[SERVER] Parallel fetch: product + reviews for id=${id}`);

  // Promise.all() fires BOTH requests simultaneously
  // Total time = max(productTime, reviewsTime) instead of productTime + reviewsTime
  const [product, reviews] = await Promise.all([
    getProductById(id),
    getProductReviews(id),
  ]);

  return { product, reviews };
}
