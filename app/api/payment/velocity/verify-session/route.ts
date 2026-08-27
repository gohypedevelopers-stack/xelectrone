import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as productsDal from "@/lib/server/dal/products.dal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { state, orderId: explicitOrderId } = body;

    let targetOrderId = explicitOrderId;

    // Parse orderId from state token if not directly passed
    if (!targetOrderId && state && state.startsWith("st_")) {
      const parts = state.split("_");
      if (parts.length >= 2) {
        targetOrderId = parts[1];
      }
    }

    if (!targetOrderId) {
      return NextResponse.json(
        { success: false, error: "Unable to identify order from return state" },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({
      where: { id: targetOrderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // If order is still pending upon user return, confirm it
    if (order.status === "PENDING") {
      await db.order.update({
        where: { id: targetOrderId },
        data: {
          status: "CONFIRMED",
        },
      });

      if (order.items && order.items.length > 0) {
        await Promise.all(
          order.items.map((item: any) =>
            productsDal.decrementProductStock(item.productId, item.quantity)
          )
        );
      }

      // Send Order Confirmation Email
      if (order.customerEmail) {
        import("@/lib/server/mail").then(({ sendOrderConfirmationEmail }) => {
          sendOrderConfirmationEmail({
            id: order.id,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            total: order.total,
            trackingNumber: order.trackingNumber,
            trackingUrl: order.trackingUrl,
            estimatedDelivery: order.estimatedDelivery,
          }).catch((err) => console.warn("Failed to send Velocity order email:", err));
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: `XE-${order.id.slice(-6).toUpperCase()}`,
        total: order.total,
        shippingCarrier: order.shippingCarrier,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        estimatedDelivery: order.estimatedDelivery,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to verify session";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
