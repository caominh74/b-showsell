import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { API_URL, assetUrl } from "@/lib/api-client"

interface Article {
  title: string
  excerpt?: string | null
  bodyMarkdown: string
  coverImageUrl?: string | null
  publishedAt?: string | null
  brand?: { name: string } | null
  affiliateLinks: {
    id: string
    label: string
    trackingCode: string
    product?: { name: string } | null
  }[]
}

async function getArticle(slug: string) {
  const response = await fetch(`${API_URL}/articles/${slug}`, { cache: "no-store" })
  if (!response.ok) {
    return null
  }
  return (await response.json()) as Article
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return (
      <main className="min-h-screen bg-stone-50 px-5 py-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/articles" className="text-sm font-medium text-stone-600">
            Back to articles
          </Link>
          <p className="mt-8 rounded-lg border border-stone-200 bg-white p-8 text-stone-500">Article not found.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8">
      <article className="mx-auto max-w-3xl">
        <Link href="/articles" className="text-sm font-medium text-stone-600">
          Back to articles
        </Link>
        <header className="mt-8">
          <p className="text-xs font-semibold uppercase text-rose-600">{article.brand?.name ?? "B-ShowSell"}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-950">{article.title}</h1>
          {article.excerpt ? <p className="mt-4 text-base leading-7 text-stone-600">{article.excerpt}</p> : null}
        </header>
        {article.coverImageUrl ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-stone-100">
            <img src={assetUrl(article.coverImageUrl)} alt="" className="h-full w-full object-cover" />
          </div>
        ) : null}
        <div className="mt-8 whitespace-pre-wrap text-sm leading-7 text-stone-800">{article.bodyMarkdown}</div>
        {article.affiliateLinks.length ? (
          <section className="mt-8 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase text-stone-500">Recommended Links</h2>
            <div className="mt-3 grid gap-2">
              {article.affiliateLinks.map((link) => (
                <a
                  key={link.id}
                  href={`${API_URL}/r/${link.trackingCode}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 hover:border-stone-950"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  )
}
