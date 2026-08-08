import * as ordersDal from "@/lib/server/dal/orders.dal";

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

  // Recalculate total from items for integrity
  const calculatedTotal = data.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return ordersDal.createOrder({
    ...data,
    total: calculatedTotal,
  });
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
