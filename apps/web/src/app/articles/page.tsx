import Link from "next/link"
import { ArrowUpRight, BookOpenText } from "lucide-react"

const articles = ["Summer glow campaign", "How to layer lightweight serums", "Affiliate picks for humid weather"]

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-black tracking-tight text-stone-950">
          B-SHOWSELL
        </Link>
        <header className="mt-10">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950">Articles</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Public advertising and affiliate content routes are ready for published article APIs.
          </p>
        </header>

        <section className="mt-8 divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white shadow-sm">
          {articles.map((article) => (
            <article key={article} className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-4">
                <BookOpenText className="size-5 text-rose-600" aria-hidden="true" />
                <div>
                  <h2 className="font-semibold text-stone-950">{article}</h2>
                  <p className="mt-1 text-sm text-stone-500">Article list shell for Phase 4 content.</p>
                </div>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-stone-400" aria-hidden="true" />
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
