"use client"

import { useEffect, useState } from "react"
import { Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api-client"

interface RevenueReport {
  grandTotal: number
  grandProfit: number
  totals: { sourceType: string; _sum: { amount: number | null; profitAmount: number | null } }[]
}

interface CampaignReport {
  id: string
  name: string
  brand: string
  reach: number
  impressions: number
  clicks: number
  ctr: number
}

export default function AdminReportsPage() {
  const [revenue, setRevenue] = useState<RevenueReport | null>(null)
  const [campaigns, setCampaigns] = useState<CampaignReport[]>([])
  const [error, setError] = useState("")

  async function load() {
    setError("")
    try {
      const [revenueReport, campaignReport] = await Promise.all([
        fetchApi<RevenueReport>("/admin/reports/revenue"),
        fetchApi<CampaignReport[]>("/admin/reports/campaigns"),
      ])
      setRevenue(revenueReport)
      setCampaigns(campaignReport)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load reports")
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function downloadRevenueCsv() {
    const csv = await fetchApi<string>("/reports/revenue/export.csv")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "revenue.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">Revenue and KPI Reports</h2>
          <p className="mt-1 text-sm text-stone-600">Track advertising, affiliate, product sale, and campaign performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={downloadRevenueCsv}>
            <Download className="size-4" aria-hidden="true" />
            CSV
          </Button>
        </div>
      </div>

      {error ? <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-stone-500">Total Revenue</p>
          <p className="mt-2 text-2xl font-semibold text-stone-950">{formatMoney(revenue?.grandTotal ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-stone-500">Profit</p>
          <p className="mt-2 text-2xl font-semibold text-stone-950">{formatMoney(revenue?.grandProfit ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-stone-500">Campaigns</p>
          <p className="mt-2 text-2xl font-semibold text-stone-950">{campaigns.length}</p>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Reach</th>
              <th className="px-4 py-3">Impressions</th>
              <th className="px-4 py-3">Clicks</th>
              <th className="px-4 py-3">CTR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="px-4 py-3 font-medium text-stone-950">{campaign.name}</td>
                <td className="px-4 py-3">{campaign.brand}</td>
                <td className="px-4 py-3">{campaign.reach}</td>
                <td className="px-4 py-3">{campaign.impressions}</td>
                <td className="px-4 py-3">{campaign.clicks}</td>
                <td className="px-4 py-3">{(campaign.ctr * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}
