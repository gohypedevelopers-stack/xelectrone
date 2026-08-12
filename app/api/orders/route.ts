import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as ordersController from "@/lib/server/controllers/orders.controller";
import { requireAdmin, AuthError } from "@/lib/server/dal/auth";

// GET /api/orders?userId=
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;

    const orders = await ordersController.listOrders(userId);
    return NextResponse.json({ success: true, data: orders });
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
    await requireAdmin();
    const body = await request.json();
    const order = await ordersController.createOrder(body);
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
