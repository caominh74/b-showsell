"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { assetUrl, fetchApi, getStoredUser } from "@/lib/api-client"
import { Button, buttonVariants } from "@/components/ui/button"

type Product = {
  id: string
  name: string
  slug: string
  description?: string | null
  ingredients?: string | null
  usageInstructions?: string | null
  price: number
  salePrice?: number | null
  stockQuantity: number
  isLimitedEdition: boolean
  brand?: { name: string; description?: string | null }
  category?: { name: string }
  images: { id: string; url: string; altText?: string | null }[]
  reviews: { id: string; rating: number; title?: string | null; body?: string | null; customer?: { fullName: string } }[]
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const average = useMemo(
    () => (product?.reviews.length ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length : 0),
    [product],
  )

  useEffect(() => {
    async function loadProduct() {
      setLoading(true)
      try {
        setProduct(await fetchApi<Product>(`/products/${params.slug}`))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load product")
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [params.slug])

  async function addToCart() {
    if (!product) return
    const user = getStoredUser()
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/products/${product.slug}`)}`)
      return
    }
    setSaving(true)
    setError("")
    setMessage("")
    try {
      await fetchApi("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, quantity }),
      })
      setMessage("Added to cart")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add to cart")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-stone-50 px-5 py-8 text-sm text-stone-500">Loading product...</main>
  }

  if (!product) {
    return <main className="min-h-screen bg-stone-50 px-5 py-8 text-sm text-rose-700">{error || "Product not found"}</main>
  }

  const hero = product.images[0]
  const price = product.salePrice ?? product.price

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-950">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Products
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="aspect-[4/3] bg-stone-100">
              {hero ? (
                <img src={assetUrl(hero.url)} alt={hero.altText ?? product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-stone-400">
                  <ShoppingCart className="size-12" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">{product.brand?.name ?? product.category?.name}</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-950">{product.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-stone-600">
              <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              {average ? `${average.toFixed(1)} from ${product.reviews.length} reviews` : "No reviews yet"}
            </p>
            <p className="mt-5 text-2xl font-semibold text-stone-950">{price.toLocaleString()} VND</p>
            {product.salePrice ? <p className="mt-1 text-sm text-stone-500 line-through">{product.price.toLocaleString()} VND</p> : null}
            <p className="mt-5 text-sm leading-6 text-stone-600">{product.description ?? "Curated beauty product from B-ShowSell."}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex h-10 items-center overflow-hidden rounded-md border border-stone-300 bg-white">
                <button className="grid size-10 place-items-center" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button className="grid size-10 place-items-center" onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} aria-label="Increase quantity">
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
              <Button onClick={addToCart} disabled={saving || product.stockQuantity < 1}>
                <ShoppingCart className="size-4" aria-hidden="true" />
                {product.stockQuantity < 1 ? "Out of stock" : saving ? "Adding..." : "Add to cart"}
              </Button>
              <Link href="/account/cart" className={buttonVariants({ variant: "outline" })}>
                View cart
              </Link>
            </div>
            <p className="mt-3 text-xs text-stone-500">{product.stockQuantity} in stock</p>
            {message ? <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p> : null}
            {error ? <p className="mt-3 text-sm font-medium text-rose-700">{error}</p> : null}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <InfoBlock title="Ingredients" body={product.ingredients} fallback="Ingredient details are being prepared." />
          <InfoBlock title="Usage" body={product.usageInstructions} fallback="Usage instructions are being prepared." />
        </section>

        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-950">Customer reviews</h2>
          <div className="mt-4 space-y-4">
            {product.reviews.length ? (
              product.reviews.map((review) => (
                <article key={review.id} className="border-t border-stone-100 pt-4">
                  <p className="text-sm font-semibold text-stone-950">{review.title ?? `${review.rating}/5 stars`}</p>
                  <p className="mt-1 text-xs text-stone-500">{review.customer?.fullName ?? "Customer"}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{review.body ?? "No written review."}</p>
                </article>
              ))
            ) : (
              <p className="text-sm text-stone-500">No approved reviews yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function InfoBlock({ title, body, fallback }: { title: string; body?: string | null; fallback: string }) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{body || fallback}</p>
    </section>
  )
}
