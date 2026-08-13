import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  CircleHelp,
  Plus,
  Target,
} from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAnalyticsData } from "@/lib/server/controllers/dashboard.controller";

export const metadata: Metadata = {
  title: "Analytics | Xelectron Admin",
  description: "Review sales and store performance analytics.",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-xs">
      <p className="w-fit border-b border-dotted border-black/40 text-xs font-medium text-black/75">
        {title}
      </p>
      <p className="mt-2 text-xl font-semibold text-[#1a1a1a]">
        {value}
      </p>
      <div className="mt-3 h-[2px] w-12 bg-[#3abff8]" />
    </section>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-black/10 bg-white p-5 shadow-xs ${className}`}>
      <h2 className="w-fit border-b border-dotted border-black/40 text-sm font-medium text-[#1a1a1a]">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SalesChart({ title, value }: { title: string; value: string }) {
  return (
    <Panel title={title} className="min-h-[350px]">
      <p className="text-xl font-semibold text-[#1a1a1a]">{value}</p>
      <div className="relative mt-4 h-[220px]">
        <div className="absolute inset-x-0 top-0 border-t border-black/10" />
        <div className="absolute inset-x-0 top-1/2 border-t border-black/10" />
        <div className="absolute inset-x-0 bottom-7 border-t border-black/10" />
        <span className="absolute left-0 top-[-10px] text-xs font-normal text-black/55">High</span>
        <span className="absolute left-0 top-[calc(50%-10px)] text-xs font-normal text-black/55">Mid</span>
        <span className="absolute bottom-[20px] left-0 text-xs font-normal text-black/55">₹0</span>
        <svg
          viewBox="0 0 1000 220"
          preserveAspectRatio="none"
          className="absolute inset-x-12 bottom-7 h-[170px] w-[calc(100%-6rem)]"
          aria-label="Sales chart graph"
          role="img"
        >
          <path d="M0 219 H560 L750 80 L1000 30" fill="none" stroke="#18a8ef" strokeWidth="2.5" />
          <path d="M0 219 H1000" fill="none" stroke="#8ed5f6" strokeDasharray="4 4" strokeWidth="2" />
        </svg>
        <div className="absolute inset-x-8 bottom-0 flex justify-between text-xs font-normal text-black/55">
          <span>12 AM</span>
          <span>4 AM</span>
          <span>8 AM</span>
          <span>12 PM</span>
          <span>4 PM</span>
          <span>8 PM</span>
          <span>10 PM</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-6 text-xs font-normal text-black/60">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#18a8ef]" /> Active Period
        </span>
      </div>
    </Panel>
  );
}

function ConversionBreakdownPanel({ returningRate }: { returningRate: number }) {
  return (
    <Panel title="Conversion rate breakdown" className="min-h-[350px]">
      <p className="text-xl font-semibold text-black/75">
        {returningRate}% <span className="text-xs font-normal text-black/50">returning rate</span>
      </p>
      <div className="mt-4 grid grid-cols-4 divide-x divide-black/10">
        {[
          { label: "Sessions", val: "100%" },
          { label: "Added to cart", val: "85%" },
          { label: "Reached checkout", val: "70%" },
          { label: "Completed checkout", val: "100%" },
        ].map((item) => (
          <div key={item.label} className="min-w-0 px-2 first:pl-0 last:pr-0">
            <p className="truncate text-xs text-black/75">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-black/80">{item.val}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const selectedRange = resolvedSearchParams.range || "all";
  const analytics = await getAnalyticsData(selectedRange);
  const todayStr = dateFormatter.format(new Date());

  const rangeButtons = [
    { label: "All time", value: "all" },
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "last7" },
    { label: "Last 30 days", value: "last30" },
  ];

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-2.5 text-xl font-medium text-[#1a1a1a]">
                <BarChart3 className="size-5" />
                Analytics
              </h1>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/orders/create-order"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-black/80 transition-colors"
                >
                  <Plus className="size-3.5" />
                  New order
                </Link>
              </div>
            </header>

            {/* Interactive Date Range Filter Buttons */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-lg border border-black/15 bg-white p-1 shadow-xs">
                {rangeButtons.map((btn) => {
                  const isActive = selectedRange === btn.value;
                  return (
                    <Link
                      key={btn.value}
                      href={`/dashboard/analytics?range=${btn.value}`}
                      className={`inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-black text-white"
                          : "text-slate-700 hover:bg-black/5"
                      }`}
                    >
                      <CalendarDays className="size-3.5" />
                      {btn.label}
                    </Link>
                  );
                })}
              </div>



              <span className="text-xs text-black/50 ml-2">
                Showing data for: <strong className="text-black/80 font-semibold">{selectedRange === "today" ? `Today (${todayStr})` : selectedRange === "last7" ? "Last 7 Days" : selectedRange === "last30" ? "Last 30 Days" : "All Time"}</strong>
              </span>
            </div>

            {/* Top Metric Cards */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Gross sales"
                value={currencyFormatter.format(analytics.grossSales)}
              />
              <MetricCard
                title="Returning customer rate"
                value={`${analytics.returningCustomerRate}%`}
              />
              <MetricCard
                title="Orders fulfilled"
                value={analytics.ordersFulfilled.toString()}
              />
              <MetricCard
                title="Orders"
                value={analytics.totalOrders.toString()}
              />
            </div>

            {/* Main Sales Charts & Breakdown */}
            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
              <SalesChart
                title="Total sales over time"
                value={currencyFormatter.format(analytics.grossSales)}
              />

              {/* Total sales breakdown */}
              <Panel title="Total sales breakdown" className="min-h-[350px]">
                <div className="space-y-0.5 text-xs sm:text-sm">
                  {[
                    { label: "Gross sales", val: currencyFormatter.format(analytics.grossSales) },
                    { label: "Discounts", val: "₹0" },
                    { label: "Sales reversals", val: "₹0" },
                    { label: "Net sales", val: currencyFormatter.format(analytics.grossSales) },
                    { label: "Shipping charges", val: "₹0" },
                    { label: "Return fees", val: "₹0" },
                    { label: "Taxes (GST Included)", val: "Included" },
                    { label: "Total sales", val: currencyFormatter.format(analytics.grossSales) },
                  ].map((row, index) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between rounded-lg px-2.5 py-2 ${
                        index % 2 === 1 ? "bg-black/[0.03]" : ""
                      }`}
                    >
                      <span
                        className={
                          row.label === "Total sales"
                            ? "font-bold text-[#1a1a1a]"
                            : "font-medium text-slate-700"
                        }
                      >
                        {row.label}
                      </span>
                      <span
                        className={
                          row.label === "Total sales"
                            ? "font-bold text-[#005BD3]"
                            : "font-semibold text-[#1a1a1a]"
                        }
                      >
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            {/* Middle Section: Channel Sales & Product Sales */}
            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              {/* Sales channel */}
              <Panel title="Total sales by sales channel" className="min-h-[260px]">
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-[#0a7ae6]" />
                      <span className="font-semibold text-slate-900">Online Store</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {currencyFormatter.format(analytics.grossSales)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-black/55 px-1">
                    <span>Active channel: 1</span>
                    <span>100% of sales</span>
                  </div>
                </div>
              </Panel>

              {/* Average order value */}
              <SalesChart
                title="Average order value over time"
                value={currencyFormatter.format(analytics.averageOrderValue)}
              />

              {/* Total sales by product */}
              <Panel title="Total sales by product" className="min-h-[260px]">
                {analytics.salesByProduct.length === 0 ? (
                  <div className="flex min-h-[180px] items-center justify-center text-xs text-black/50">
                    No product sales for this range
                  </div>
                ) : (
                  <div className="divide-y divide-black/10 text-xs pt-1 space-y-2">
                    {analytics.salesByProduct.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-3 pt-2 first:pt-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 truncate">{p.name}</p>
                          <p className="text-[11px] text-black/55">{p.quantity} sold</p>
                        </div>
                        <span className="font-semibold text-slate-900 shrink-0">
                          {currencyFormatter.format(p.totalSales)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            {/* Bottom Conversion & Activity Section */}
            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
              <ConversionBreakdownPanel returningRate={analytics.returningCustomerRate} />
              <Panel title="Top selling summary" className="min-h-[260px]">
                <div className="space-y-3 pt-1 text-xs">
                  <div className="flex justify-between border-b border-black/10 pb-2">
                    <span className="text-black/60">Total orders</span>
                    <span className="font-bold text-slate-900">{analytics.totalOrders}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/10 pb-2">
                    <span className="text-black/60">Orders fulfilled</span>
                    <span className="font-bold text-slate-900">{analytics.ordersFulfilled}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/10 pb-2">
                    <span className="text-black/60">Average order value</span>
                    <span className="font-bold text-slate-900">
                      {currencyFormatter.format(analytics.averageOrderValue)}
                    </span>
                  </div>
                </div>
              </Panel>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-black/50">
              <Target className="size-3.5" />
              Analytics updates dynamically as your store receives activity
              <CircleHelp className="size-3.5" />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
