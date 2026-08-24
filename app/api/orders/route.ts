import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as ordersController from "@/lib/server/controllers/orders.controller";
import { getCurrentUser, AuthError } from "@/lib/server/dal/auth";
import { setSessionCookie } from "@/lib/server/auth/session-utils";

// GET /api/orders?userId=&contact=&orderId=
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get("userId") || undefined;
    const contact = searchParams.get("contact") || undefined;
    const orderId = searchParams.get("orderId") || undefined;

    // If orderId is provided, fetch single order for tracking
    if (orderId) {
      try {
        const order = await ordersController.getOrder(orderId);
        return NextResponse.json({ success: true, data: [order] });
      } catch {
        return NextResponse.json({ success: true, data: [] });
      }
    }

    // If contact (email or phone) is provided, lookup guest orders
    if (contact) {
      const orders = await ordersController.listOrders(undefined, contact);
      return NextResponse.json({ success: true, data: orders });
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized. Please log in." }, { status: 401 });
    }

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
    const body = await request.json();

    const order = await ordersController.createOrder({
      ...body,
      userId: user?.id || body.userId || null,
      customerName: body.customerName || (body.firstName ? `${body.firstName} ${body.lastName || ""}`.trim() : user?.name),
      customerEmail: body.customerEmail || body.email || user?.email,
      customerPhone: body.customerPhone || body.phone,
    });

    // If an account was automatically created during order placement, set session cookie
    if ((order as any).sessionToken) {
      await setSessionCookie((order as any).sessionToken);
    }

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
