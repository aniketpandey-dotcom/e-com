import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const ProductCardComponent = ProductCard as any;

// SERVER component — no "use client" directive
// This entire component runs on the server:
//   - console.log appears in the terminal, NOT in the browser
//   - It can directly call async functions (database, file system, etc.)
//   - It sends ZERO JavaScript to the browser bundle
export default async function ProductList() {
  // Direct async data fetching — no useEffect, no loading state needed
  const products = await getProducts();

  // This log appears in the SERVER terminal (check your terminal, not browser devtools)
  console.log(
    `[SERVER] ProductList rendered with ${products.length} products at ${new Date().toISOString()}`,
  );

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
