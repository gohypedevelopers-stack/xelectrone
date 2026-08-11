import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Package } from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getOrdersForDashboard } from "@/lib/server/controllers/dashboard.controller";

export const metadata: Metadata = {
  title: "Orders | Xelectron Admin",
  description: "Manage Xelectron orders and fulfillment.",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function orderReference(id: string) {
  return `#${id.slice(-8).toUpperCase()}`;
}

function statusClass(status: string) {
  if (status === "DELIVERED") return "bg-emerald-100 text-emerald-900";
  if (status === "CANCELLED") return "bg-red-100 text-red-900";
  if (status === "PROCESSING" || status === "SHIPPED") return "bg-sky-100 text-sky-900";
  return "bg-amber-100 text-amber-900";
}

export default async function OrdersPage() {
  const orders = await getOrdersForDashboard();
  const activeOrders = orders.filter((order) => order.status !== "CANCELLED");
  const itemsOrdered = activeOrders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
  const summary = [
    { label: "Orders", value: orders.length },
    { label: "Items ordered", value: itemsOrdered },
    { label: "Open orders", value: orders.filter((order) => ["PENDING", "CONFIRMED", "PROCESSING"].includes(order.status)).length },
    { label: "Fulfilled", value: orders.filter((order) => ["SHIPPED", "DELIVERED"].includes(order.status)).length },
    { label: "Delivered", value: orders.filter((order) => order.status === "DELIVERED").length },
  ];

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="flex items-center gap-2 text-lg font-semibold"><Package className="size-4" /> Orders</h1>
                <p className="mt-1 text-xs text-black/55">All orders recorded in your database.</p>
              </div>
              <Link href="/dashboard/orders/create-order" className="inline-flex h-8 items-center rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80">
                Create order
              </Link>
            </div>

            <section className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="grid grid-cols-2 divide-x divide-y divide-black/10 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
                <div className="flex items-center gap-2 px-4 py-4 text-xs font-medium"><CalendarDays className="size-4" /> All time</div>
                {summary.map((metric) => (
                  <div key={metric.label} className="px-4 py-3">
                    <p className="text-xs font-medium text-black/65">{metric.label}</p>
                    <p className="mt-1 text-sm font-semibold">{metric.value.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                <h2 className="text-sm font-semibold">Orders</h2>
                <span className="text-xs text-black/55">{orders.length.toLocaleString("en-IN")} total</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse text-left text-xs">
                  <thead className="bg-black/[0.025] text-black/65">
                    <tr>
                      {['Order', 'Date', 'Customer', 'Total', 'Status', 'Items', 'Shipping'].map((heading) => (
                        <th key={heading} className="border-b border-black/10 px-3 py-2.5 font-medium">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-sm text-black/55">No orders yet. Create your first order to see it here.</td>
                      </tr>
                    ) : orders.map((order) => {
                      const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                      return (
                        <tr key={order.id} className="hover:bg-black/[0.02]">
                          <td className="border-b border-black/10 px-3 py-2.5 font-medium">{orderReference(order.id)}</td>
                          <td className="border-b border-black/10 px-3 py-2.5">{dateFormatter.format(order.createdAt)}</td>
                          <td className="border-b border-black/10 px-3 py-2.5">{order.user.name}</td>
                          <td className="border-b border-black/10 px-3 py-2.5 text-right">{currencyFormatter.format(order.total)}</td>
                          <td className="border-b border-black/10 px-3 py-2.5"><span className={`rounded-md px-2 py-1 ${statusClass(order.status)}`}>{formatStatus(order.status)}</span></td>
                          <td className="border-b border-black/10 px-3 py-2.5">{itemCount} {itemCount === 1 ? "item" : "items"}</td>
                          <td className="max-w-56 truncate border-b border-black/10 px-3 py-2.5 text-black/65">{order.shippingAddress || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
