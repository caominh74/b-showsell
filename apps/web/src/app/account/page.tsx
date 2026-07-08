"use client"

import Link from "next/link"
import { Heart, PackageCheck, ShoppingCart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { buttonVariants } from "@/components/ui/button"

export default function AccountPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-rose-600">Signed in as {user?.email}</p>
        <h2 className="mt-2 text-2xl font-semibold text-stone-950">Hi, {user?.fullName}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
          Your account area is ready for orders, reviews, cart activity, and profile updates.
        </p>
        <Link href="/products" className={buttonVariants({ className: "mt-5" })}>
          Browse products
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Cart", href: "/account/cart", icon: ShoppingCart },
          { label: "Order history", href: "/account/orders", icon: PackageCheck },
          { label: "Reviews", href: "/account/reviews", icon: Heart },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-stone-400">
            <item.icon className="size-5 text-rose-600" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-stone-950">{item.label}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}
