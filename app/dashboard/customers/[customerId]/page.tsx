import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, PackageOpen, Phone, UserRound } from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCustomerForDashboard } from "@/lib/server/controllers/dashboard.controller";

export const metadata: Metadata = {
  title: "Customer | Xelectron Admin",
  description: "Review an Xelectron customer profile and activity.",
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
});

export default async function CustomerDetailPage({ params }: PageProps<"/dashboard/customers/[customerId]">) {
  const { customerId } = await params;
  const customer = await getCustomerForDashboard(customerId);
  if (!customer) notFound();

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="mx-auto max-w-4xl">
              <Link href="/dashboard/customers" className="text-xs text-black/55 underline underline-offset-2 hover:text-black">Back to customers</Link>
              <h1 className="mt-3 flex items-center gap-2 text-lg font-semibold"><UserRound className="size-4" /> {customer.name}</h1>
              <p className="mt-1 text-sm text-black/55">Customer since {dateFormatter.format(customer.createdAt)}</p>

              <section className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"><p className="text-xs text-black/55">Amount spent</p><p className="mt-1 text-lg font-semibold">{currencyFormatter.format(customer.amountSpent)}</p></div>
                <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"><p className="text-xs text-black/55">Orders</p><p className="mt-1 text-lg font-semibold">{customer.orders.length}</p></div>
                <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"><p className="text-xs text-black/55">Phone</p><p className="mt-1 text-lg font-semibold">{customer.phone || "—"}</p></div>
              </section>

              <section className="mt-4 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold">Contact information</h2>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-black/65">
                  <a href={`mailto:${customer.email}`} className="inline-flex items-center gap-2 text-[#005BD3] hover:underline"><Mail className="size-4" /> {customer.email}</a>
                  {customer.phone ? <span className="inline-flex items-center gap-2"><Phone className="size-4" /> {customer.phone}</span> : null}
                </div>
              </section>

              <section className="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                <div className="border-b border-black/10 px-4 py-3"><h2 className="text-sm font-semibold">Order history</h2></div>
                {customer.orders.length === 0 ? (
                  <div className="flex items-center gap-3 px-4 py-8 text-sm text-black/55"><PackageOpen className="size-5" /> This customer has not placed any orders yet.</div>
                ) : (
                  <div className="divide-y divide-black/10">
                    {customer.orders.map((order) => <div key={order.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm"><span className="font-medium">#{order.id.slice(-8).toUpperCase()}</span><span className="text-black/55">{dateFormatter.format(order.createdAt)} · {order.status}</span><span>{currencyFormatter.format(order.total)}</span></div>)}
                  </div>
                )}
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
