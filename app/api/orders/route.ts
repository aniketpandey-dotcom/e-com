import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      orders: [
        {
          id: 1,
          total: 5000,
        },
      ],
    },
    {
      status: 200,
    },
  );
}
