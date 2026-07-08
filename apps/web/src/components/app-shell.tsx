"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpenText,
  Boxes,
  Building2,
  CalendarDays,
  Home,
  LogOut,
  PackageSearch,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Role } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems: Record<Role, { href: string; label: string; icon: React.ElementType }[]> = {
  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/brands", label: "Brands", icon: Building2 },
    { href: "/admin/campaigns", label: "Campaigns", icon: CalendarDays },
    { href: "/admin/content", label: "Content", icon: BookOpenText },
    { href: "/admin/reports", label: "Reports", icon: Settings },
  ],
  STAFF: [
    { href: "/staff", label: "Operations", icon: Boxes },
    { href: "/staff/products", label: "Products", icon: PackageSearch },
    { href: "/staff/orders", label: "Orders", icon: ShoppingBag },
  ],
  CUSTOMER: [
    { href: "/account", label: "Account", icon: Home },
    { href: "/account/cart", label: "Cart", icon: ShoppingCart },
    { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  ],
}

interface AppShellProps {
  children: React.ReactNode
  title: string
  eyebrow: string
}

export function AppShell({ children, title, eyebrow }: AppShellProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const items = user ? navItems[user.role] : []

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-stone-200 bg-white px-4 py-5 lg:block">
        <Link href="/" className="flex h-10 items-center rounded-md px-2 text-lg font-black tracking-tight">
          B-SHOWSELL
        </Link>
        <nav className="mt-8 space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950",
                  active && "bg-stone-950 text-white hover:bg-stone-950 hover:text-white",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">{eyebrow}</p>
              <h1 className="text-xl font-semibold text-stone-950">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right text-sm md:block">
                <p className="font-medium text-stone-950">{user?.fullName}</p>
                <p className="text-xs text-stone-500">{user?.role}</p>
              </div>
              <Button variant="outline" size="icon" onClick={logout} aria-label="Log out">
                <LogOut className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-9 shrink-0 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-600",
                  pathname === item.href && "border-stone-950 bg-stone-950 text-white",
                )}
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  )
}
