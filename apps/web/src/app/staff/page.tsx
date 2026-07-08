import { ClipboardList, PackageSearch, ShoppingBag } from "lucide-react"

const workQueues = [
  { label: "Products to review", value: "9", icon: PackageSearch },
  { label: "Orders pending", value: "17", icon: ShoppingBag },
  { label: "Reviews awaiting moderation", value: "6", icon: ClipboardList },
]

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {workQueues.map((queue) => (
          <article key={queue.label} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <queue.icon className="size-5 text-rose-600" aria-hidden="true" />
            <p className="mt-4 text-2xl font-semibold text-stone-950">{queue.value}</p>
            <p className="mt-1 text-sm text-stone-500">{queue.label}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-950">Operations shell</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
          Staff routes are protected and ready for product catalog, order fulfillment, and review moderation workflows.
        </p>
      </section>
    </div>
  )
}
