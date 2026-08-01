"use client"

import * as React from "react"
import Image from "next/image"

import { NavMain } from "@/admin-panel/components/nav-main"
import { NavUser } from "@/admin-panel/components/nav-user"
import { adminRoutes } from "@/admin-panel/routes"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  HomeIcon,
  BadgePercentIcon,
  InboxIcon,
  ChartNoAxesCombinedIcon,
  PackageIcon,
  UsersRoundIcon,
  ChevronsUpDown,
} from "lucide-react"

const routeIcons: Record<string, React.ReactNode> = {
  Home: <HomeIcon className="size-4 shrink-0" />,
  Orders: <InboxIcon className="size-4 shrink-0" />,
  Products: <PackageIcon className="size-4 shrink-0" />,
  Customers: <UsersRoundIcon className="size-4 shrink-0" />,
  Discounts: <BadgePercentIcon className="size-4 shrink-0" />,
  Analytics: <ChartNoAxesCombinedIcon className="size-4 shrink-0" />,
}

const navMain = adminRoutes.map((route) => ({
  title: route.label,
  url: route.href,
  icon: routeIcons[route.label],
  items: route.children?.map((child) => ({
    title: child.label,
    url: child.href,
  })),
}))

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r border-black/5 bg-[#ebebeb] text-[#303030]" {...props}>
      <SidebarHeader className="px-3 pt-3.5 pb-2.5">
        <div className="flex flex-row items-center gap-2.5 px-1 py-0.5">
          <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#09090b] text-white shadow-2xs">
            <span className="text-[11px] font-bold tracking-wider text-white">XE</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col text-left leading-none group-data-[collapsible=icon]:hidden">
            <span className="truncate text-[13.5px] font-semibold text-[#1a1a1a] tracking-tight">XElectron</span>
            <span className="mt-1 truncate text-[11px] font-medium text-[#707070]">
              Admin Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-1 overflow-y-auto">
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter className="p-2">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
