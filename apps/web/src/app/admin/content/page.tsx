"use client"

import { RecordManager } from "@/components/management/record-manager"

interface Article {
  id: string
  title: string
  slug: string
  status: string
  publishedAt?: string | null
  campaign?: { name: string } | null
}

export default function AdminContentPage() {
  return (
    <RecordManager<Article>
      title="Advertising Articles"
      description="Create website advertising content, connect it to campaigns and brands, then publish it for visitors."
      endpoint="/admin/articles"
      emptyText="No articles have been created."
      fields={[
        { name: "campaignId", label: "Campaign", type: "select", optionEndpoint: "/admin/campaigns" },
        { name: "brandId", label: "Brand", type: "select", optionEndpoint: "/admin/brands" },
        { name: "title", label: "Title", required: true },
        { name: "slug", label: "Slug" },
        { name: "excerpt", label: "Excerpt", type: "textarea" },
        { name: "bodyMarkdown", label: "Body", type: "textarea", required: true },
        { name: "coverImageUrl", label: "Cover image URL" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"].map((value) => ({ label: value, value })),
        },
      ]}
      columns={[
        { label: "Title", render: (article) => <span className="font-medium text-stone-950">{article.title}</span> },
        { label: "Slug", render: (article) => article.slug },
        { label: "Campaign", render: (article) => article.campaign?.name ?? "None" },
        { label: "Status", render: (article) => article.status },
        {
          label: "Published",
          render: (article) => (article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Not yet"),
        },
      ]}
    />
  )
}
