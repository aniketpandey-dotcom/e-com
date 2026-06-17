import { NextRequest, NextResponse } from "next/server";

import { cart } from "@/lib/products";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { productId, quantity } = body;

    // Validation for missing fields
    if (productId == null || quantity == null) {
      return NextResponse.json(
        {
          success: false,
          message: "productId and quantity are required",
        },
        {
          status: 400,
        },
      );
    }

    // Validation for invalid quantity
    if (quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be greater than 0",
        },
        {
          status: 400,
        },
      );
    }

    const cartItem = {
      id: Date.now(),
      productId,
      quantity,
    };

    cart.push(cartItem);

    return NextResponse.json(
      {
        success: true,
        message: "Product added to cart",
        data: cartItem,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON payload",
      },
      {
        status: 400,
      },
    );
  }
}
