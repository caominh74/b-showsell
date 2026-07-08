"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { Minus, PackageCheck, Plus, ShoppingCart, Trash2 } from "lucide-react"
import { assetUrl, fetchApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"

type Cart = {
  id: string
  subtotal: number
  items: {
    id: string
    productId: string
    quantity: number
    unitPriceSnapshot?: number | null
    product: {
      name: string
      slug: string
      price: number
      stockQuantity: number
      images: { id: string; url: string; altText?: string | null }[]
      brand?: { name: string }
    }
  }[]
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  async function loadCart() {
    setLoading(true)
    setError("")
    try {
      setCart(await fetchApi<Cart>("/cart"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load cart")
    } finally {
      setLoading(false)
    }
  }

  async function updateItem(itemId: string, quantity: number) {
    setError("")
    try {
      setCart(await fetchApi<Cart>(`/cart/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update cart")
    }
  }

  async function removeItem(itemId: string) {
    setError("")
    try {
      setCart(await fetchApi<Cart>(`/cart/items/${itemId}`, { method: "DELETE" }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove item")
    }
  }

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")
    setMessage("")
    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries())
    try {
      const order = await fetchApi<{ id: string; orderNumber: string }>("/checkout", {
        method: "POST",
        body: JSON.stringify(payload),
      })
      setMessage(`Order ${order.orderNumber} created`)
      await loadCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to checkout")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const shippingFee = cart && cart.subtotal > 0 && cart.subtotal <= 500000 ? 30000 : 0
  const total = (cart?.subtotal ?? 0) + shippingFee

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">Shopping cart</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600">Review product quantities, stock availability, and checkout with mock payment.</p>
        </div>
        <Link href="/products" className="text-sm font-medium text-rose-700 hover:text-rose-900">Continue shopping</Link>
      </section>

      {error ? <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      {message ? <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-stone-500">Loading cart...</p>
          ) : cart?.items.length ? (
            cart.items.map((item) => {
              const image = item.product.images[0]
              const price = item.unitPriceSnapshot ?? item.product.price
              return (
                <article key={item.id} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[96px_1fr_auto]">
                  <div className="aspect-square overflow-hidden rounded-md bg-stone-100">
                    {image ? <img src={assetUrl(image.url)} alt={image.altText ?? item.product.name} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div>
                    <Link href={`/products/${item.product.slug}`} className="font-semibold text-stone-950 hover:underline">{item.product.name}</Link>
                    <p className="mt-1 text-xs text-stone-500">{item.product.brand?.name ?? "B-ShowSell"}</p>
                    <p className="mt-3 text-sm font-semibold text-stone-950">{price.toLocaleString()} VND</p>
                    <p className="mt-1 text-xs text-stone-500">{item.product.stockQuantity} in stock</p>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <div className="flex h-9 items-center overflow-hidden rounded-md border border-stone-300">
                      <button className="grid size-9 place-items-center" onClick={() => updateItem(item.id, Math.max(0, item.quantity - 1))} aria-label="Decrease quantity">
                        <Minus className="size-4" aria-hidden="true" />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                      <button className="grid size-9 place-items-center" onClick={() => updateItem(item.id, item.quantity + 1)} aria-label="Increase quantity">
                        <Plus className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => removeItem(item.id)} aria-label="Remove item">
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </article>
              )
            })
          ) : (
            <section className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
              <ShoppingCart className="mx-auto size-8 text-stone-400" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-stone-950">Your cart is empty.</p>
            </section>
          )}
        </div>

        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-stone-950">Summary</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-stone-500">Subtotal</dt><dd className="font-medium">{(cart?.subtotal ?? 0).toLocaleString()} VND</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Shipping</dt><dd className="font-medium">{shippingFee.toLocaleString()} VND</dd></div>
            <div className="flex justify-between border-t border-stone-200 pt-3 text-base"><dt className="font-semibold">Total</dt><dd className="font-semibold">{total.toLocaleString()} VND</dd></div>
          </dl>
          <Button className="mt-5 w-full" disabled={!cart?.items.length} onClick={() => setCheckoutOpen((open) => !open)}>
            <PackageCheck className="size-4" aria-hidden="true" />
            Checkout
          </Button>
        </aside>
      </section>

      {checkoutOpen ? (
        <form onSubmit={checkout} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-stone-950">Delivery information</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              ["recipientName", "Recipient name"],
              ["recipientPhone", "Phone"],
              ["shippingAddressLine1", "Address line 1"],
              ["shippingAddressLine2", "Address line 2"],
              ["ward", "Ward"],
              ["district", "District"],
              ["city", "City"],
            ].map(([name, label]) => (
              <label key={name}>
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</span>
                <input name={name} required={["recipientName", "recipientPhone", "shippingAddressLine1"].includes(name)} className="mt-1 h-10 w-full rounded-md border border-stone-300 px-3 text-sm outline-none focus:border-stone-950" />
              </label>
            ))}
            <label className="md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Notes</span>
              <textarea name="notes" className="mt-1 min-h-20 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-950" />
            </label>
          </div>
          <Button type="submit" className="mt-4" disabled={saving}>{saving ? "Placing order..." : "Place mock order"}</Button>
        </form>
      ) : null}
    </div>
  )
}
