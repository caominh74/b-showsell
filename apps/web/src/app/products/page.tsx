"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Search, ShoppingBag, SlidersHorizontal, Star } from "lucide-react"
import { assetUrl, fetchApi } from "@/lib/api-client"
import { Button, buttonVariants } from "@/components/ui/button"

type Product = {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number
  salePrice?: number | null
  stockQuantity: number
  isLimitedEdition: boolean
  brand?: { name: string }
  category?: { name: string }
  images: { id: string; url: string; altText?: string | null; isPrimary: boolean }[]
  reviews: { rating: number }[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadProducts(search = query) {
    setLoading(true)
    setError("")
    try {
      const qs = search ? `?q=${encodeURIComponent(search)}` : ""
      setProducts(await fetchApi<Product[]>(`/products${qs}`))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products")
    } finally {
      setLoading(false)
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    loadProducts(query)
  }

  useEffect(() => {
    loadProducts("")
  }, [])

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="text-sm font-black tracking-tight text-stone-950">
              B-SHOWSELL
            </Link>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-stone-950">Beauty products</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              Shop blogger-curated skincare, makeup, and limited campaign products with live stock and customer reviews.
            </p>
          </div>
          <Link href="/login" className={buttonVariants({ variant: "outline" })}>
            Sign in
          </Link>
        </header>

        <form onSubmit={submitSearch} className="mt-8 flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:flex-row">
          <label className="flex h-10 flex-1 items-center gap-2 rounded-md border border-stone-300 px-3">
            <Search className="size-4 text-stone-400" aria-hidden="true" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
            />
          </label>
          <Button type="submit" variant="outline">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Apply
          </Button>
        </form>

        {error ? <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-sm text-stone-500">Loading catalog...</p>
          ) : products.length ? (
            products.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <p className="text-sm text-stone-500">No products match your search.</p>
          )}
        </section>
      </div>
    </main>
  )
}

function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]
  const price = product.salePrice ?? product.price
  const average = useMemo(
    () => (product.reviews.length ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length : 0),
    [product.reviews],
  )

  return (
    <Link href={`/products/${product.slug}`} className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:border-stone-400">
      <div className="relative aspect-[4/3] bg-stone-100">
        {image ? (
          <img src={assetUrl(image.url)} alt={image.altText ?? product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-stone-400">
            <ShoppingBag className="size-10" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">{product.brand?.name ?? "B-ShowSell"}</p>
            <h2 className="mt-1 text-base font-semibold text-stone-950 group-hover:underline">{product.name}</h2>
          </div>
          {product.isLimitedEdition ? <span className="rounded-md bg-stone-950 px-2 py-1 text-xs font-semibold text-white">Limited</span> : null}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{product.description ?? product.category?.name}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-semibold text-stone-950">{price.toLocaleString()} VND</p>
          <p className="flex items-center gap-1 text-xs text-stone-500">
            <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
            {average ? average.toFixed(1) : "New"}
          </p>
        </div>
      </div>
    </Link>
  )
}
