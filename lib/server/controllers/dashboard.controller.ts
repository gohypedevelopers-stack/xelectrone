import { db } from "@/lib/db";

const orderInclude = {
  user: { select: { id: true, name: true, email: true } },
  items: {
    include: {
      product: { select: { id: true, name: true } },
    },
  },
} as const;

export async function getOrdersForDashboard() {
  return db.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getDashboardOverview() {
  const [orders, inventory, customerCount] = await Promise.all([
    getOrdersForDashboard(),
    db.product.findMany({ select: { quantity: true } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  const activeOrders = orders.filter((order) => order.status !== "CANCELLED");
  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(startOfToday);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  const previousPeriodStart = new Date(thirtyDaysAgo);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

  const salesInRange = (from: Date, to: Date) =>
    activeOrders
      .filter((order) => order.createdAt >= from && order.createdAt < to)
      .reduce((sum, order) => sum + order.total, 0);

  const periodEnd = new Date(startOfToday);
  periodEnd.setDate(periodEnd.getDate() + 1);
  const periodOrders = activeOrders.filter(
    (order) => order.createdAt >= thirtyDaysAgo && order.createdAt < periodEnd
  );
  const totalSales = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const itemsOrdered = activeOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
  const fulfilledOrders = orders.filter((order) => order.status === "SHIPPED" || order.status === "DELIVERED").length;
  const deliveredOrders = orders.filter((order) => order.status === "DELIVERED").length;
  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING" || order.status === "CONFIRMED" || order.status === "PROCESSING"
  ).length;

  const productSales = new Map<string, { name: string; quantity: number }>();
  for (const order of activeOrders) {
    for (const item of order.items) {
      const current = productSales.get(item.productId) ?? { name: item.product.name, quantity: 0 };
      current.quantity += item.quantity;
      productSales.set(item.productId, current);
    }
  }

  const chartData = Array.from({ length: 11 }, (_, index) => {
    const daysAgo = (10 - index) * 3;
    const dayStart = new Date(startOfToday);
    dayStart.setDate(dayStart.getDate() - daysAgo);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const previousDayStart = new Date(dayStart);
    previousDayStart.setDate(previousDayStart.getDate() - 30);
    const previousDayEnd = new Date(dayEnd);
    previousDayEnd.setDate(previousDayEnd.getDate() - 30);

    return {
      date: dayStart.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      current: salesInRange(dayStart, dayEnd),
      previous: salesInRange(previousDayStart, previousDayEnd),
    };
  });

  const formatDateRange = (from: Date, to: Date) => {
    const format = (date: Date) =>
      date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
    return `${format(from)}–${format(to)}`;
  };

  return {
    totalSales,
    periodSales: periodOrders.reduce((sum, order) => sum + order.total, 0),
    orderCount: orders.length,
    periodOrderCount: periodOrders.length,
    productCount: inventory.length,
    customerCount,
    itemsOrdered,
    fulfilledOrders,
    deliveredOrders,
    pendingOrders,
    recentOrders: orders.slice(0, 5).map((order) => ({
      id: order.id,
      status: order.status,
      total: order.total,
      customerName: order.user.name,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    })),
    topProducts: [...productSales.values()]
      .sort((first, second) => second.quantity - first.quantity)
      .slice(0, 5),
    chartData,
    currentPeriodLabel: formatDateRange(thirtyDaysAgo, today),
    previousPeriodLabel: formatDateRange(previousPeriodStart, new Date(thirtyDaysAgo.getTime() - 1)),
    lowStockCount: inventory.filter((product) => product.quantity > 0 && product.quantity <= 5).length,
    outOfStockCount: inventory.filter((product) => product.quantity === 0).length,
  };
}

export async function getCustomersForDashboard() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      orders: { select: { total: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt.toISOString(),
    orderCount: customer.orders.length,
    amountSpent: customer.orders
      .filter((order) => order.status !== "CANCELLED")
      .reduce((sum, order) => sum + order.total, 0),
  }));
}

export async function getCustomerForDashboard(id: string) {
  const customer = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      orders: {
        select: { id: true, total: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer || customer.orders === undefined) return null;

  return {
    ...customer,
    amountSpent: customer.orders
      .filter((order) => order.status !== "CANCELLED")
      .reduce((sum, order) => sum + order.total, 0),
  };
}
