"use client"

import { useEffect, useState } from "react"
import { Check, EyeOff, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api-client"

interface Review {
  id: string
  rating: number
  title?: string | null
  body?: string | null
  status: string
  product: { name: string }
  customer: { fullName: string; email: string }
}

export default function StaffReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [error, setError] = useState("")

  async function load() {
    try {
      setReviews(await fetchApi<Review[]>("/staff/reviews"))
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load reviews")
    }
  }

  async function moderate(id: string, status: string) {
    await fetchApi(`/staff/reviews/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) })
    await load()
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">Review Moderation</h2>
          <p className="mt-1 text-sm text-stone-600">Approve, reject, or hide customer product reviews.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Refresh
        </Button>
      </div>
      {error ? <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      <section className="divide-y divide-stone-100 rounded-lg border border-stone-200 bg-white shadow-sm">
        {reviews.map((review) => (
          <article key={review.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-stone-950">{review.title || review.product.name}</h3>
                <p className="mt-1 text-sm text-stone-500">
                  {review.product.name} by {review.customer.fullName} · {review.rating}/5 · {review.status}
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-700">{review.body || "No body provided."}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => moderate(review.id, "APPROVED")}>
                  <Check className="size-4" aria-hidden="true" />
                  Approve
                </Button>
                <Button variant="outline" size="sm" onClick={() => moderate(review.id, "REJECTED")}>
                  <X className="size-4" aria-hidden="true" />
                  Reject
                </Button>
                <Button variant="outline" size="sm" onClick={() => moderate(review.id, "HIDDEN")}>
                  <EyeOff className="size-4" aria-hidden="true" />
                  Hide
                </Button>
              </div>
            </div>
          </article>
        ))}
        {!reviews.length ? <p className="p-8 text-sm text-stone-500">No reviews need moderation.</p> : null}
      </section>
    </div>
  )
}
