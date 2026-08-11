"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react"

type DashboardData = {
  totalSales: number
  periodSales: number
  orderCount: number
  periodOrderCount: number
  productCount: number
  customerCount: number
  itemsOrdered: number
  fulfilledOrders: number
  deliveredOrders: number
  pendingOrders: number
  lowStockCount: number
  outOfStockCount: number
  currentPeriodLabel: string
  previousPeriodLabel: string
  chartData: { date: string; current: number; previous: number }[]
  recentOrders: { id: string; status: string; total: number; customerName: string; itemCount: number }[]
  topProducts: { name: string; quantity: number }[]
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
})

function formatOrderReference(id: string) {
  return `#${id.slice(-8).toUpperCase()}`
}

function formatOrderStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

export function AdminOverview({ data }: { data: DashboardData }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [rangeLabel, setRangeLabel] = useState("Last 30 days")
  const [selectedMetric, setSelectedMetric] = useState("Total sales")
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"
  const metrics = [
    { label: "Sessions", value: "—", change: "No data" },
    { label: "Total sales", value: currencyFormatter.format(data.periodSales), change: "Last 30 days" },
    { label: "Orders", value: data.periodOrderCount.toLocaleString("en-IN"), change: "Last 30 days" },
    { label: "Conversion rate", value: "—", change: "No data" },
  ]
  const chartMaximum = Math.max(10, ...data.chartData.flatMap((point) => [point.current, point.previous]))
  const today = new Date()
  const calendarMonths = [-1, 0].map((offset) => {
    const month = new Date(today.getFullYear(), today.getMonth() + offset, 1)
    return {
      label: month.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      firstDay: month.getDay(),
      dayCount: new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(),
    }
  })

  return (
    <section className="relative flex flex-1 flex-col gap-4 bg-[#f5f5f5] p-4 pt-6">
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <h1 className="mt-1 text-lg font-semibold tracking-tight text-black">
            {greeting}, Admin
          </h1>
          <p className="mt-0.5 text-xs text-black/55">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <button
          type="button"
          aria-expanded={isDatePickerOpen}
          onClick={() => setIsDatePickerOpen((open) => !open)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/25 bg-white px-2.5 text-xs font-medium text-black/75 shadow-sm transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25"
        >
          <CalendarDays className="size-3.5 text-black/65" />
          {rangeLabel}
          <ChevronDown className="size-3.5 text-black/55" />
        </button>

        {isDatePickerOpen ? (
          <div className="absolute right-0 top-10 z-30 flex w-[min(680px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-black/15 bg-white shadow-xl">
            <div className="hidden w-40 shrink-0 border-r border-black/10 bg-[#fafafa] p-2 sm:block">
              {["Today", "Yesterday", "Last 7 days", "Last 30 days", "Quarter to date", "Custom range"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setRangeLabel(option)
                    setIsDatePickerOpen(false)
                  }}
                  className={`w-full rounded-md px-2 py-2 text-left text-xs transition-colors hover:bg-black/5 ${
                    option === rangeLabel ? "bg-black/10 font-medium" : "text-black/70"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="min-w-0 flex-1 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-black/70">Last</span>
                <input aria-label="Number of days" defaultValue="30" className="h-8 w-20 rounded-md border border-black/20 px-2 outline-none focus:border-black/50" />
                <select aria-label="Date unit" defaultValue="Days" className="h-8 rounded-md border border-black/20 bg-white px-2 outline-none focus:border-black/50">
                  <option>Days</option>
                  <option>Weeks</option>
                  <option>Months</option>
                </select>
                <label className="inline-flex items-center gap-1.5 text-black/70">
                  <input type="checkbox" defaultChecked className="accent-black" /> Include today
                </label>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-6 text-xs text-black/75">
                {calendarMonths.map((month) => (
                  <div key={month.label}>
                    <p className="mb-3 text-center font-semibold">{month.label}</p>
                    <div className="grid grid-cols-7 gap-y-2 text-center text-black/60">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} className="text-[10px]">{day}</span>)}
                      {Array.from({ length: month.firstDay + month.dayCount }, (_, index) => {
                        const day = index - month.firstDay + 1
                        return <span key={index} className="px-1 py-0.5">{day > 0 ? day : ""}</span>
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end gap-2 border-t border-black/10 pt-3">
                <button type="button" onClick={() => setIsDatePickerOpen(false)} className="rounded-md border border-black/20 px-3 py-1.5 text-xs">Cancel</button>
                <button type="button" onClick={() => setIsDatePickerOpen(false)} className="rounded-md bg-black px-3 py-1.5 text-xs text-white">Apply</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative rounded-xl border border-black/10 bg-white p-2 shadow-sm sm:p-3">
        <button
          type="button"
          aria-label={isExpanded ? "Collapse overview" : "Expand overview"}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="absolute right-3 top-3 z-10 inline-flex size-7 items-center justify-center rounded-md text-black/50 transition-colors hover:bg-black/5 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
        >
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        <div className="grid grid-cols-2 gap-2 pr-8 sm:grid-cols-4">
          {metrics.map((metric) => (
            <button
              type="button"
              key={metric.label}
              aria-pressed={selectedMetric === metric.label}
              onClick={() => setSelectedMetric(metric.label)}
              className={`relative min-h-14 rounded-lg px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25 ${
                selectedMetric === metric.label
                  ? "bg-[#f0f0f0]"
                  : "bg-white hover:bg-black/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-black/75">{metric.label}</p>
                {selectedMetric === metric.label ? <span className="text-sm text-black/45">↗</span> : null}
              </div>
              <p className="mt-1 text-sm font-semibold text-black">
                {metric.value} <span className="font-normal text-black/55">{metric.change}</span>
              </p>
            </button>
          ))}
        </div>

        {isExpanded ? <div className="mt-4 h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e5e5e5" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737373", fontSize: 11 }}
                dy={8}
              />
              <YAxis
                domain={[0, chartMaximum]}
                tickCount={3}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737373", fontSize: 11 }}
                width={28}
              />
              <Tooltip
                cursor={{ stroke: "#d4d4d4", strokeDasharray: "3 3" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#8bd4f5"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#08a7f5"
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div> : null}

        {isExpanded ? <div className="flex justify-center gap-5 pt-2 text-[11px] text-black/55">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#08a7f5]" /> {data.currentPeriodLabel}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#8bd4f5]" /> {data.previousPeriodLabel}
          </span>
        </div> : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium">
          <span aria-hidden>▣</span> {data.pendingOrders} {data.pendingOrders === 1 ? "order" : "orders"} to fulfil
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium">
          <span aria-hidden>▱</span> Payment capture data unavailable
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr]">
        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent orders</h2>
            <Link href="/dashboard/orders" className="text-xs text-black/55 underline underline-offset-2 hover:text-black">
              View all
            </Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="mt-3 py-3 text-center text-xs text-black/55">No orders have been placed yet.</p>
          ) : (
            <div className="mt-3 divide-y divide-black/10">
              {data.recentOrders.map((order) => (
                <Link key={order.id} href="/dashboard/orders" className="flex items-center justify-between gap-3 py-3 text-xs hover:bg-black/[0.02]">
                  <span className="font-medium">{formatOrderReference(order.id)}</span>
                  <span className="text-black/55">{formatOrderStatus(order.status)}</span>
                  <span className="font-medium">{currencyFormatter.format(order.total)}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Top products</h2>
          {data.topProducts.length === 0 ? (
            <p className="mt-3 py-3 text-xs text-black/55">Top products will appear after an order is placed.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {data.topProducts.map((product) => (
                <div key={product.name} className="flex items-center justify-between gap-3 text-xs">
                  <span className="truncate text-black/70">{product.name}</span>
                  <span className="shrink-0 font-medium">{product.quantity} sold</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Quick actions</h2>
          <div className="mt-3 grid gap-2">
            <Link href="/dashboard/products/new" className="rounded-md border border-black/15 px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-black hover:text-white">Add product</Link>
            <Link href="/dashboard/customers" className="rounded-md border border-black/15 px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-black hover:text-white">View customers</Link>
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Store health</h2>
            <span className="size-2 rounded-full bg-black/25" />
          </div>
          <p className="mt-3 text-2xl font-semibold">—</p>
          <p className="mt-1 text-xs text-black/55">Health monitoring is not configured</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/10">
            <div className="h-full w-0 rounded-full bg-emerald-500" />
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Traffic sources</h2>
          <p className="mt-3 py-3 text-xs text-black/55">No traffic data has been collected yet.</p>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Inventory alerts</h2>
          <div className="mt-3 space-y-3 text-xs">
            <div className="flex items-center justify-between"><span className="text-black/70">Low stock</span><span className="rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-800">{data.lowStockCount} items</span></div>
            <div className="flex items-center justify-between"><span className="text-black/70">Out of stock</span><span className="rounded-full bg-red-100 px-2 py-1 font-medium text-red-800">{data.outOfStockCount} items</span></div>
            <Link href="/dashboard/products/inventory" className="inline-block pt-1 text-black/55 underline underline-offset-2 hover:text-black">Review inventory</Link>
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Customer snapshot</h2>
          <p className="mt-3 text-2xl font-semibold">{data.customerCount.toLocaleString("en-IN")}</p>
          <p className="mt-1 text-xs text-black/55">Total customers</p>
          <p className="mt-3 text-xs font-medium text-black/55">No comparison data yet</p>
        </section>
      </div>

    </section>
  )
}
