import Link from "next/link"
import { ArrowUpRight, BookOpenText } from "lucide-react"
import { API_URL, assetUrl } from "@/lib/api-client"

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  coverImageUrl?: string | null
  publishedAt?: string | null
  brand?: { name: string } | null
}

async function getArticles() {
  const response = await fetch(`${API_URL}/articles`, { cache: "no-store" })
  if (!response.ok) {
    return []
  }
  return (await response.json()) as Article[]
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-black tracking-tight text-stone-950">
          B-SHOWSELL
        </Link>
        <header className="mt-10">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950">Articles</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Published collaboration stories, product explainers, and affiliate recommendations.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:border-stone-300"
            >
              {article.coverImageUrl ? (
                <div className="relative aspect-[16/9] bg-stone-100">
                  <img src={assetUrl(article.coverImageUrl)} alt="" className="h-full w-full object-cover" />
                </div>
              ) : null}
              <article className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <BookOpenText className="size-5 text-rose-600" aria-hidden="true" />
                  <ArrowUpRight className="size-4 text-stone-400" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-stone-950">{article.title}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{article.excerpt || "Read the full article."}</p>
                <p className="mt-4 text-xs font-semibold uppercase text-stone-500">{article.brand?.name ?? "B-ShowSell"}</p>
              </article>
            </Link>
          ))}
        </section>

        {!articles.length ? <p className="mt-8 rounded-lg border border-stone-200 bg-white p-8 text-stone-500">No articles are published yet.</p> : null}
      </div>
    </main>
  )
}
