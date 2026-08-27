import { NextRequest, NextResponse } from "next/server";
import { verifyVelocityWebhook, getVelocityConfig } from "@/lib/server/velocity";
import { db } from "@/lib/db";
import * as productsDal from "@/lib/server/dal/products.dal";

export async function GET() {
  return NextResponse.json({
    success: true,
    status: "active",
    message: "Velocity Webhook endpoint is active and listening for POST requests.",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-velocity-signature");
    const config = getVelocityConfig();

    // Verify webhook HMAC signature if webhook secret is configured
    if (config.webhookSecret) {
      const isValid = verifyVelocityWebhook(rawBody, signature, config.webhookSecret);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Invalid Velocity webhook signature" },
          { status: 401 }
        );
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { event, data } = payload || {};
    const orderId =
      data?.order_id ||
      data?.merchant_order_id ||
      payload?.order_id ||
      payload?.merchant_order_id ||
      data?.id;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing order_id in webhook data" },
        { status: 400 }
      );
    }

    if (event === "payments.success" || data?.status === "success") {
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (order && order.status !== "CONFIRMED" && order.status !== "PROCESSING" && order.status !== "SHIPPED") {
        await db.order.update({
          where: { id: orderId },
          data: {
            status: "CONFIRMED",
          },
        });

        // Decrement product inventory stock
        if (order.items && order.items.length > 0) {
          await Promise.all(
            order.items.map((item: any) =>
              productsDal.decrementProductStock(item.productId, item.quantity)
            )
          );
        }
      }
    } else if (event === "payments.failed" || data?.status === "failed") {
      await db.order.updateMany({
        where: { id: orderId, status: "PENDING" },
        data: {
          status: "CANCELLED",
        },
      });
    }

    return NextResponse.json({ success: true, status: "ok" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed";
    console.error("Velocity Webhook Error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
