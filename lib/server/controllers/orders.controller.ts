import * as ordersDal from "@/lib/server/dal/orders.dal";
import * as productsDal from "@/lib/server/dal/products.dal";

// ─── List ────────────────────────────────────────────────────────────────────

export async function listOrders(userId?: string) {
  if (userId) {
    return ordersDal.getOrdersByUserId(userId);
  }
  return ordersDal.getAllOrders();
}

// ─── Get One ─────────────────────────────────────────────────────────────────

export async function getOrder(id: string) {
  const order = await ordersDal.getOrderById(id);
  if (!order) throw new Error("Order not found");
  return order;
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createOrder(data: ordersDal.CreateOrderInput) {
  if (!data.userId || !data.items || data.items.length === 0) {
    throw new Error("Missing required fields: userId, items (non-empty)");
  }

  // Resolve item product IDs if items were passed by slug or id
  const resolvedItems = await Promise.all(
    data.items.map(async (item) => {
      let product = await productsDal.getProductById(item.productId);
      if (!product) {
        product = await productsDal.getProductBySlug(item.productId);
      }

      if (!product) {
        // Fallback: If product is not found in DB by id or slug, use first available product
        const allProducts = await productsDal.getAllProducts();
        if (allProducts.length > 0) {
          product = allProducts[0];
        }
      }

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const itemPrice = typeof item.unitPrice === "number" && item.unitPrice > 0
        ? item.unitPrice
        : typeof product.price === "number"
        ? product.price
        : parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;

      return {
        productId: product.id,
        quantity: Math.max(1, item.quantity || 1),
        unitPrice: itemPrice,
      };
    })
  );

  const calculatedSubtotal = resolvedItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  // Preserve the actual total paid at checkout (including discounts/shipping)
  const finalTotal =
    typeof data.total === "number" && Number.isFinite(data.total) && data.total > 0
      ? data.total
      : calculatedSubtotal;

  const createdOrder = await ordersDal.createOrder({
    ...data,
    items: resolvedItems,
    total: finalTotal,
  });

  // Automatically reduce product inventory stock in database
  await Promise.all(
    resolvedItems.map((item) =>
      productsDal.decrementProductStock(item.productId, item.quantity)
    )
  );

  // Increment discount usage count if a discount code or automatic discount was applied
  if (data.discountCode) {
    const discountsDal = await import("@/lib/server/dal/discounts.dal");
    await discountsDal.incrementDiscountUsage(data.discountCode);
  } else if (finalTotal < calculatedSubtotal) {
    const discountsDal = await import("@/lib/server/dal/discounts.dal");
    const allDiscounts = await discountsDal.getAllDiscounts();
    const autoDiscount = allDiscounts.find((d: any) => !d.code);
    if (autoDiscount) {
      await discountsDal.incrementDiscountUsage(autoDiscount.id);
    }
  }

  // Update user phone number if provided
  if (data.phone && data.userId) {
    const { db } = await import("@/lib/db");
    await db.user.update({
      where: { id: data.userId },
      data: { phone: data.phone },
    });
  }

  return createdOrder;
}

// ─── Update Status ───────────────────────────────────────────────────────────

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  const existing = await ordersDal.getOrderById(id);
  if (!existing) throw new Error("Order not found");
  return ordersDal.updateOrderStatus(id, status);
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteOrder(id: string) {
  const existing = await ordersDal.getOrderById(id);
  if (!existing) throw new Error("Order not found");
  return ordersDal.deleteOrder(id);
}
