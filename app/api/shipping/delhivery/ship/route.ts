import { NextRequest, NextResponse } from "next/server";
import { fetchDelhiveryWaybill, getDelhiveryTrackingUrl } from "@/lib/server/delhivery";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    // 1. Fetch live authentic waybill from Delhivery API
    const liveAwb = await fetchDelhiveryWaybill();
    const carrier = "Delhivery Express";
    const trackingUrl = getDelhiveryTrackingUrl(liveAwb);

    // 2. Calculate 3-4 days estimated delivery
    const deliveryDateObj = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const estimatedDelivery = deliveryDateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // 3. Update order in database
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        shippingCarrier: carrier,
        trackingNumber: liveAwb,
        trackingUrl: trackingUrl,
        estimatedDelivery: estimatedDelivery,
        status: "SHIPPED",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Shipment created with Delhivery! AWB: ${liveAwb}`,
      data: {
        trackingNumber: liveAwb,
        shippingCarrier: carrier,
        trackingUrl: trackingUrl,
        estimatedDelivery: estimatedDelivery,
        status: updatedOrder.status,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to ship with Delhivery";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
