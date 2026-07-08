"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Ban } from "lucide-react"
import { fetchApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"

type Order = {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  subtotal: number
  shippingFee: number
  total: number
  recipientName: string
  recipientPhone: string
  shippingAddressLine1: string
  ward?: string | null
  district?: string | null
  city?: string | null
  placedAt: string
  items: { id: string; productNameSnapshot: string; unitPriceSnapshot: number; quantity: number; lineTotal: number }[]
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadOrder() {
    setLoading(true)
    try {
      setOrder(await fetchApi<Order>(`/orders/${params.id}`))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load order")
    } finally {
      setLoading(false)
    }
  }

  async function cancelOrder() {
    setError("")
    try {
      setOrder(await fetchApi<Order>(`/orders/${params.id}/cancel`, { method: "POST" }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel order")
    }
  }

  useEffect(() => {
    loadOrder()
  }, [params.id])

  if (loading) return <p className="text-sm text-stone-500">Loading order...</p>
  if (!order) return <p className="text-sm text-rose-700">{error || "Order not found"}</p>

  return (
    <div className="space-y-5">
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Orders
      </Link>

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">{order.status} / {order.paymentStatus}</p>
            <h2 className="mt-1 text-2xl font-semibold text-stone-950">{order.orderNumber}</h2>
            <p className="mt-1 text-sm text-stone-500">{new Date(order.placedAt).toLocaleString()}</p>
          </div>
          <Button variant="outline" disabled={order.status !== "PENDING_PAYMENT"} onClick={cancelOrder}>
            <Ban className="size-4" aria-hidden="true" />
            Cancel order
          </Button>
        </div>
        {error ? <p className="mt-3 text-sm font-medium text-rose-700">{error}</p> : null}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 p-4 font-semibold text-stone-950">Items</div>
          <div className="divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 p-4 text-sm">
                <div>
                  <p className="font-medium text-stone-950">{item.productNameSnapshot}</p>
                  <p className="mt-1 text-stone-500">{item.unitPriceSnapshot.toLocaleString()} VND x {item.quantity}</p>
                </div>
                <p className="font-semibold text-stone-950">{item.lineTotal.toLocaleString()} VND</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-stone-950">Delivery</h3>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            {order.recipientName}<br />
            {order.recipientPhone}<br />
            {order.shippingAddressLine1}<br />
            {[order.ward, order.district, order.city].filter(Boolean).join(", ")}
          </p>
          <dl className="mt-5 space-y-2 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-stone-500">Subtotal</dt><dd>{order.subtotal.toLocaleString()} VND</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Shipping</dt><dd>{order.shippingFee.toLocaleString()} VND</dd></div>
            <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{order.total.toLocaleString()} VND</dd></div>
          </dl>
        </aside>
      </section>
    </div>
  )
}
