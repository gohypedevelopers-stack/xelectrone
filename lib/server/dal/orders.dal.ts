import { db } from "@/lib/db";

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getAllOrders() {
  return db.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, mainImage: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return db.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: {
            select: { id: true, name: true, mainImage: true, slug: true, price: true },
          },
        },
      },
    },
  });
}

export async function getOrdersByUserId(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, mainImage: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export type CreateOrderInput = {
  userId: string;
  total: number;
  shippingAddress?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
};

export async function createOrder(data: CreateOrderInput) {
  const { items, ...orderData } = data;

  return db.order.create({
    data: {
      ...orderData,
      items: { create: items },
    },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });
}

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  return db.order.update({
    where: { id },
    data: { status },
  });
}

export async function deleteOrder(id: string) {
  return db.order.delete({ where: { id } });
}

export async function countOrders() {
  return db.order.count();
}
