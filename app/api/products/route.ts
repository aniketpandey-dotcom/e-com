import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";
// const products = [
//   {
//     id: 1,
//     name: "iPhone 15",
//     price: 80000,
//     category: "Mobile",
//   },
//   {
//     id: 2,
//     name: "MacBook Air",
//     price: 120000,
//     category: "Laptop",
//   },
//   {
//     id: 3,
//     name: "AirPods Pro",
//     price: 25000,
//     category: "Accessories",
//   },
// ];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const limit = searchParams.get("limit");

  let result = products;

  if (limit) {
    result = products.slice(0, Number(limit));
  }

  return NextResponse.json(
    {
      success: true,
      count: result.length,
      data: result,
    },
    {
      status: 200,
    },
  );
}
