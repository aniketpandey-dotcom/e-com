import { NextRequest, NextResponse } from "next/server";
import { cart } from "@/lib/products";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Validate ID
  if (isNaN(Number(id))) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid cart item ID",
      },
      {
        status: 400,
      },
    );
  }

  const index = cart.findIndex((item) => item.id === Number(id));

  // Item not found
  if (index === -1) {
    return NextResponse.json(
      {
        success: false,
        message: "Cart item not found",
      },
      {
        status: 404,
      },
    );
  }

  const deletedItem = cart.splice(index, 1)[0];

  return NextResponse.json(
    {
      success: true,
      message: "Cart item deleted successfully",
      data: deletedItem,
    },
    {
      status: 200,
    },
  );
}
