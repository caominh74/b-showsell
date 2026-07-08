"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api-client"

type Order = {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  recipientName: string
  recipientPhone: string
  city?: string | null
  placedAt: string
  customer?: { fullName: string; email: string }
  items: { id: string; productNameSnapshot: string; quantity: number; lineTotal: number }[]
}

const statuses = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  async function loadOrders() {
    setLoading(true)
    setError("")
    try {
      setOrders(await fetchApi<Order[]>("/staff/orders"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders")
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(orderId: string, status: string) {
    await fetchApi(`/staff/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
    await loadOrders()
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">Order fulfillment</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-stone-600">
            Review customer orders, inspect line items, and move eligible orders through payment, packing, shipping, and delivery.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadOrders} disabled={loading}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Refresh
        </Button>
      </section>

      {error ? <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr><td className="px-4 py-8 text-stone-500" colSpan={6}>Loading...</td></tr>
              ) : orders.length ? (
                orders.map((order) => (
                  <tr key={order.id} className="align-top">
                    <td className="px-4 py-3">
                      <strong className="text-stone-950">{order.orderNumber}</strong>
                      <p className="text-xs text-stone-500">{order.recipientName} / {order.recipientPhone}</p>
                    </td>
                    <td className="px-4 py-3">
                      {order.customer?.fullName ?? "Unknown"}
                      <p className="text-xs text-stone-500">{order.customer?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {order.items.map((item) => (
                        <p key={item.id}>{item.productNameSnapshot} x {item.quantity}</p>
                      ))}
                    </td>
                    <td className="px-4 py-3 font-semibold text-stone-950">{order.total.toLocaleString()} VND</td>
                    <td className="px-4 py-3">
                      <select
                        className="h-9 rounded-md border border-stone-300 bg-white px-2 text-sm"
                        value={order.status}
                        onChange={(event) => updateStatus(order.id, event.target.value).catch((err) => setError(err.message))}
                      >
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <p className="mt-1 text-xs text-stone-500">{order.paymentStatus}</p>
                    </td>
                    <td className="px-4 py-3">{new Date(order.placedAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td className="px-4 py-8 text-stone-500" colSpan={6}>No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
