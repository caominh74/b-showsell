"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PackageCheck } from "lucide-react"
import { fetchApi } from "@/lib/api-client"

type Order = {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  placedAt: string
  items: { id: string; productNameSnapshot: string; quantity: number }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadOrders() {
      try {
        setOrders(await fetchApi<Order[]>("/orders"))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load orders")
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  return (
    <div className="space-y-5">
      <section className="border-b border-stone-200 pb-4">
        <h2 className="text-lg font-semibold text-stone-950">Order history</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600">Track your orders from mock payment through fulfillment.</p>
      </section>

      {error ? <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <section className="space-y-3">
        {loading ? (
          <p className="text-sm text-stone-500">Loading orders...</p>
        ) : orders.length ? (
          orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="block rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-stone-400">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-stone-950">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-stone-500">{new Date(order.placedAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-stone-950">{order.total.toLocaleString()} VND</p>
                  <p className="mt-1 text-xs text-stone-500">{order.status} / {order.paymentStatus}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-stone-600">{order.items.map((item) => `${item.productNameSnapshot} x ${item.quantity}`).join(", ")}</p>
            </Link>
          ))
        ) : (
          <section className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
            <PackageCheck className="mx-auto size-8 text-stone-400" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-stone-950">No orders yet.</p>
          </section>
        )}
      </section>
    </div>
  )
}
