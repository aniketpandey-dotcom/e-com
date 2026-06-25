import { NextResponse } from "next/server";
import { products } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query")?.toLowerCase() || "";

  const page = Number(searchParams.get("page") || "1");

  const limit = 6;

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query),
  );

  const totalPages = Math.ceil(filteredProducts.length / limit);

  const start = (page - 1) * limit;

  const paginatedProducts = filteredProducts.slice(start, start + limit);

  return NextResponse.json({
    products: paginatedProducts,
    totalPages,
    currentPage: page,
  });
}
