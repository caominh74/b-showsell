import { BookOpenText, CircleDollarSign, Megaphone, Users } from "lucide-react"

const stats = [
  { label: "Active campaigns", value: "12", icon: Megaphone },
  { label: "Published articles", value: "38", icon: BookOpenText },
  { label: "Managed users", value: "126", icon: Users },
  { label: "Month revenue", value: "84.2m VND", icon: CircleDollarSign },
]

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <stat.icon className="size-5 text-rose-600" aria-hidden="true" />
            <p className="mt-4 text-2xl font-semibold text-stone-950">{stat.value}</p>
            <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-950">Phase 1 workspace scaffold</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
          Admin navigation is ready for user management, brands, campaigns, content, products, orders, and reporting
          screens as Phase 2 features come online.
        </p>
      </section>
    </div>
  )
}
