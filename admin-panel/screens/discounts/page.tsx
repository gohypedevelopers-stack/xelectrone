import type { Metadata } from "next"
import {
  BadgePercent,
  ChevronDown,
  Columns2,
  Mail,
  MoreHorizontal,
  Search,
  Settings2,
  Tag,
  Truck,
  Upload,
  UserRound,
} from "lucide-react"

import { AppSidebar } from "@/admin-panel/components/app-sidebar"
import { CreateDiscountDialog } from "@/admin-panel/components/create-discount-dialog"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Discounts | SUOS Admin",
  description: "Manage discounts and automatic offers for SUOS.",
}

const discounts = [
  {
    title: "SHOPPED1ST",
    subtitle: "69% off 2 collections",
    status: "Active",
    method: "Code",
    eligibility: "All customers",
    type: "Amount off product",
    iconType: Tag,
    used: 0,
  },
  {
    title: "SHOP1ST",
    subtitle: "Free shipping on all products • For India",
    status: "Active",
    method: "Code",
    eligibility: "All customers",
    type: "Free shipping",
    iconType: Truck,
    used: 0,
  },
]

export default function DiscountsPage() {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main className="min-h-full flex-1 bg-[#f5f5f5] p-4 text-black sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="flex items-center gap-2.5 text-xl font-medium text-[#1a1a1a]">
                <Settings2 className="size-5" />
                Discounts
              </h1>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/15 bg-white px-3 text-xs font-medium text-[#1a1a1a] hover:bg-black/5"
                >
                  <Upload className="size-3.5" />
                  Export
                </button>
                <CreateDiscountDialog />
              </div>
            </div>

            <section className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-xs">
              <div className="flex flex-wrap items-center gap-3 border-b border-black/10 px-4 py-2.5">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-normal text-black/75 hover:text-black"
                >
                  All <ChevronDown className="size-3.5 text-black/50" />
                </button>
                <div className="flex min-w-52 flex-1 items-center gap-2 text-xs text-black/50">
                  <Search className="size-3.5 text-black/45" />
                  <input
                    aria-label="Search and filter discounts"
                    placeholder="Search and filter"
                    className="w-full bg-transparent text-xs text-[#1a1a1a] outline-none placeholder:text-black/40"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Columns"
                  className="rounded-md p-1 text-black/45 hover:bg-black/5 hover:text-black/75"
                >
                  <Columns2 className="size-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-black/10 text-black/60">
                      <th className="w-10 px-4 py-2.5 font-normal">
                        <input type="checkbox" aria-label="Select all discounts" className="rounded-sm border-black/20" />
                      </th>
                      <th className="px-4 py-2.5 font-normal">
                        Title
                      </th>
                      <th className="px-4 py-2.5 font-normal">
                        Status
                      </th>
                      <th className="px-4 py-2.5 font-normal">
                        Method
                      </th>
                      <th className="px-4 py-2.5 font-normal">
                        Eligibility
                      </th>
                      <th className="px-4 py-2.5 font-normal">
                        Type
                      </th>
                      <th className="px-4 py-2.5 font-normal">
                        Combinations
                      </th>
                      <th className="px-4 py-2.5 text-right font-normal">
                        Used
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-black/10">
                    {discounts.map((discount) => {
                      const TypeIcon = discount.iconType
                      return (
                        <tr key={discount.title} className="hover:bg-black/[0.015] transition-colors">
                          <td className="px-4 py-3.5 align-middle">
                            <input
                              type="checkbox"
                              aria-label={`Select ${discount.title}`}
                              className="rounded-sm border-black/20"
                            />
                          </td>
                          <td className="px-4 py-3.5 align-middle">
                            <div className="space-y-0.5">
                              <p className="text-xs font-semibold text-[#1a1a1a]">{discount.title}</p>
                              <p className="text-xs font-normal text-black/55">{discount.subtitle}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 align-middle">
                            <span className="inline-flex items-center rounded-md bg-[#e3f5e8] px-2 py-0.5 text-xs font-medium text-[#008060]">
                              {discount.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 align-middle font-normal text-[#1a1a1a]">
                            {discount.method}
                          </td>
                          <td className="px-4 py-3.5 align-middle">
                            <span className="inline-flex items-center gap-1.5 text-xs font-normal text-[#1a1a1a]">
                              <UserRound className="size-3.5 text-black/45" />
                              {discount.eligibility}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 align-middle">
                            <span className="inline-flex items-center gap-1.5 text-xs font-normal text-[#1a1a1a]">
                              <TypeIcon className="size-3.5 text-black/45" />
                              {discount.type}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 align-middle">
                            <span className="inline-flex items-center gap-1.5 text-black/25">
                              <Tag className="size-3.5" />
                              <Mail className="size-3.5" />
                              <Truck className="size-3.5" />
                            </span>
                          </td>
                          <td className="px-4 py-3.5 align-middle text-right font-normal text-[#1a1a1a]">
                            {discount.used}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="mt-6 text-center text-xs font-normal text-black/55">
              Learn more about discounts
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
