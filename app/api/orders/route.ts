import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as ordersController from "@/lib/server/controllers/orders.controller";
import { getCurrentUser, requireAdmin, AuthError } from "@/lib/server/dal/auth";

// GET /api/orders?userId=
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get("userId") || undefined;

    if (user.role === "ADMIN") {
      const orders = await ordersController.listOrders(queryUserId);
      return NextResponse.json({ success: true, data: orders });
    } else {
      const orders = await ordersController.listOrders(user.id);
      return NextResponse.json({ success: true, data: orders });
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/orders
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Please log in to place an order." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const order = await ordersController.createOrder({
      ...body,
      userId: user.id,
    });
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("Missing") ? 400 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
