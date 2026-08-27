import { NextRequest, NextResponse } from "next/server";
import {
  createVelocityOrder,
  buildVelocityRedirectUrl,
} from "@/lib/server/velocity";
import * as ordersDal from "@/lib/server/dal/orders.dal";
import * as usersDal from "@/lib/server/dal/users.dal";
import { fetchDelhiveryWaybill, getDelhiveryTrackingUrl } from "@/lib/server/delhivery";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      city,
      state,
      pincode,
      addressLine1,
      addressLine2,
      items,
      total,
      discountAmount = 0,
      discountCode,
      shippingAddress,
      createAccount,
      password,
    } = body;

    if (!customerEmail || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid checkout details or empty items." },
        { status: 400 }
      );
    }

    // 1. Account creation if requested
    let finalUserId = userId || null;
    if (!finalUserId && createAccount && customerEmail && password) {
      try {
        const cleanEmail = customerEmail.toLowerCase().trim();
        let user = await usersDal.getUserByEmail(cleanEmail);
        if (!user) {
          const bcrypt = await import("bcryptjs");
          const passwordHash = await bcrypt.hash(password, 10);
          user = await usersDal.createUser({
            name: customerName?.trim() || cleanEmail.split("@")[0] || "Valued Customer",
            email: cleanEmail,
            passwordHash,
            phone: customerPhone,
            role: "CUSTOMER",
          });
        }
        finalUserId = user.id;
      } catch (err) {
        console.warn("Auto-account creation skipped during Velocity checkout:", err);
      }
    }

    // 2. Prepare pre-allocated Delhivery tracking info
    const liveAwb = await fetchDelhiveryWaybill();
    const trackingUrl = getDelhiveryTrackingUrl(liveAwb);
    const deliveryDateObj = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
    const estimatedDelivery = deliveryDateObj.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // 3. Create initial Pending Order in DB using standard DAL
    const fullAddress =
      shippingAddress ||
      [addressLine1, addressLine2, city, state, pincode].filter(Boolean).join(", ") +
        " [Payment: VELOCITY_BNPL]";

    const createdOrder = await ordersDal.createOrder({
      userId: finalUserId,
      total: Math.round(total),
      customerName: customerName || "Customer",
      customerEmail,
      customerPhone,
      shippingAddress: fullAddress,
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      country: "India",
      shippingCarrier: "Delhivery Express",
      trackingNumber: liveAwb,
      trackingUrl,
      estimatedDelivery,
      items: items.map((item: any) => ({
        productId: item.productId || item.id,
        quantity: item.quantity || 1,
        unitPrice: Number(item.unitPrice || item.price || 0),
      })),
    });

    // 4. Build Velocity Payload
    const cleanPhone = (customerPhone || "").replace(/[^0-9]/g, "").slice(-10);
    const origin =
      request.headers.get("origin") ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    const velocityPayload = {
      order_id: createdOrder.id,
      customer: {
        name: customerName || "Customer",
        email: customerEmail,
        phone: cleanPhone,
        address: {
          address_line_1: addressLine1 || "Address Line 1",
          address_line_2: addressLine2 || undefined,
          city: city || "City",
          state: state || "State",
          country: "India",
          zip: pincode || "110001",
        },
      },
      order_details: {
        total_price: Math.round(total),
        total_discount: Math.round(discountAmount) || 0,
        total_tax: 0,
        line_items: items.map((item: any) => {
          const unitP = Number(item.unitPrice || item.price || 0);
          const qty = Number(item.quantity || 1);
          return {
            name: item.name || item.product?.name || "Product",
            unit_price: Math.round(unitP),
            quantity: qty,
            total_price: Math.round(unitP * qty),
          };
        }),
      },
      notes: discountCode ? `Coupon applied: ${discountCode}` : undefined,
    };

    // 5. Call Velocity API to create order
    const velocityRes = await createVelocityOrder(velocityPayload);

    // 6. Build Hosted Checkout Redirection URL
    const stateToken = `st_${createdOrder.id}_${Date.now().toString(36)}`;
    const redirectUri = `${origin}/checkout/velocity-callback`;

    const redirectUrl = buildVelocityRedirectUrl({
      velocityOrderId: velocityRes.velocity_order_id,
      stateToken,
      redirectUri,
    });

    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
      velocityOrderId: velocityRes.velocity_order_id,
      redirectUrl,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to initialize Velocity BNPL order";
    console.error("Velocity Order Init Error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
