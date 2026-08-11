"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const user = {
    name: session?.user.name ?? "Xelectron Admin",
    email: session?.user.email ?? "",
    avatar: session?.user.image ?? "",
  }
  const initials = user.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  async function handleSignOut() {
    setIsSigningOut(true)
    await authClient.signOut()
    router.replace("/login")
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-black/5">
          <div className="flex size-8.5 shrink-0 items-center justify-center rounded-lg bg-[#1a1a1a] text-white text-xs font-semibold shadow-2xs">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="size-full rounded-lg object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-[13px] font-semibold text-[#1a1a1a]">{user.name}</span>
            <span className="mt-0.5 truncate text-[11px] font-normal text-[#707070]">{user.email}</span>
          </div>
          <button
            type="button"
            disabled={isSigningOut}
            onClick={() => void handleSignOut()}
            title="Log out"
            aria-label="Log out"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white text-black/60 shadow-2xs hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer group-data-[collapsible=icon]:hidden"
          >
            <LogOutIcon className="size-3.5" />
          </button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
