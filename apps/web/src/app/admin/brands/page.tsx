"use client"

import { RecordManager } from "@/components/management/record-manager"

type Brand = {
  id: string
  name: string
  slug: string
  contactName?: string | null
  defaultCommissionRate: number
  status: string
  _count?: { campaigns: number; products: number }
}

export default function AdminBrandsPage() {
  return (
    <RecordManager<Brand>
      title="Brand directory"
      description="Manage beauty brand profiles, contacts, social links, and default commission rates for collaborations."
      endpoint="/admin/brands"
      emptyText="No brands found."
      fields={[
        { name: "name", label: "Brand name", required: true },
        { name: "slug", label: "Slug" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "contactName", label: "Contact name" },
        { name: "contactEmail", label: "Contact email", type: "email" },
        { name: "contactPhone", label: "Contact phone" },
        { name: "websiteUrl", label: "Website URL" },
        { name: "facebookUrl", label: "Facebook URL" },
        { name: "tiktokUrl", label: "TikTok URL" },
        { name: "defaultCommissionRate", label: "Commission rate", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
          ],
        },
      ]}
      columns={[
        { label: "Brand", render: (brand) => <strong className="text-stone-950">{brand.name}</strong> },
        { label: "Slug", render: (brand) => brand.slug },
        { label: "Contact", render: (brand) => brand.contactName ?? "Unassigned" },
        { label: "Commission", render: (brand) => `${brand.defaultCommissionRate}%` },
        { label: "Linked work", render: (brand) => `${brand._count?.campaigns ?? 0} campaigns / ${brand._count?.products ?? 0} products` },
        { label: "Status", render: (brand) => brand.status },
      ]}
    />
  )
}
