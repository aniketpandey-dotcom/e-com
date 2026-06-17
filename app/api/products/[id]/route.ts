import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Validate ID
  if (isNaN(Number(id))) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid product ID",
      },
      {
        status: 400,
      },
    );
  }

  const product = products.find((p) => p.id === Number(id));

  // Product not found
  if (!product) {
    return NextResponse.json(
      {
        success: false,
        message: "Product not found",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: product,
    },
    {
      status: 200,
    },
  );
}
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const body = await request.json();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return NextResponse.json(
      {
        success: false,
        message: "Product not found",
      },
      {
        status: 404,
      },
    );
  }

  product.name = body.name ?? product.name;
  product.price = body.price ?? product.price;
  product.category = body.category ?? product.category;

  return NextResponse.json(
    {
      success: true,
      message: "Product updated successfully",
      data: product,
    },
    {
      status: 200,
    },
  );
}
