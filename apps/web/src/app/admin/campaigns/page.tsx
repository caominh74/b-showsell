"use client"

import { RecordManager } from "@/components/management/record-manager"

type Campaign = {
  id: string
  name: string
  collaborationType: string
  status: string
  startDate?: string | null
  endDate?: string | null
  advertisingFee: number
  brand?: { name: string }
  _count?: { milestones: number }
}

type Milestone = {
  id: string
  title: string
  dueAt: string
  reminderAt?: string | null
  status: string
  campaign?: { name: string; brand?: { name: string } }
  assignedTo?: { fullName: string } | null
}

export default function AdminCampaignsPage() {
  return (
    <div className="space-y-8">
      <RecordManager<Campaign>
        title="Campaigns"
        description="Create collaboration campaigns with lifecycle status, commercial terms, and date windows."
        endpoint="/admin/campaigns"
        emptyText="No campaigns found."
        fields={[
          { name: "brandId", label: "Brand", type: "select", optionEndpoint: "/admin/brands", required: true },
          { name: "name", label: "Campaign name", required: true },
          {
            name: "collaborationType",
            label: "Collaboration type",
            type: "select",
            required: true,
            options: [
              { label: "Advertising", value: "ADVERTISING" },
              { label: "Affiliate", value: "AFFILIATE" },
              { label: "Brand ambassador", value: "BRAND_AMBASSADOR" },
              { label: "Limited edition", value: "LIMITED_EDITION" },
            ],
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Draft", value: "DRAFT" },
              { label: "Planned", value: "PLANNED" },
              { label: "In progress", value: "IN_PROGRESS" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Cancelled", value: "CANCELLED" },
            ],
          },
          { name: "startDate", label: "Start date", type: "date" },
          { name: "endDate", label: "End date", type: "date" },
          { name: "advertisingFee", label: "Advertising fee", type: "number" },
          { name: "expectedCommissionRate", label: "Expected commission", type: "number" },
          { name: "actualAffiliateCommission", label: "Affiliate commission", type: "number" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "notes", label: "Notes", type: "textarea" },
        ]}
        columns={[
          { label: "Campaign", render: (campaign) => <strong className="text-stone-950">{campaign.name}</strong> },
          { label: "Brand", render: (campaign) => campaign.brand?.name ?? "Unknown" },
          { label: "Type", render: (campaign) => campaign.collaborationType },
          { label: "Status", render: (campaign) => campaign.status },
          { label: "Window", render: (campaign) => `${formatDate(campaign.startDate)} - ${formatDate(campaign.endDate)}` },
          { label: "Fee", render: (campaign) => `${campaign.advertisingFee.toLocaleString()} VND` },
          { label: "Milestones", render: (campaign) => campaign._count?.milestones ?? 0 },
        ]}
      />

      <RecordManager<Milestone>
        title="Milestones and reminders"
        description="Create campaign due dates, assign internal owners, and queue in-app reminder notifications."
        endpoint="/admin/milestones"
        emptyText="No milestones found."
        fields={[
          { name: "campaignId", label: "Campaign", type: "select", optionEndpoint: "/admin/campaigns", required: true },
          { name: "assignedToId", label: "Assignee", type: "select", optionEndpoint: "/admin/users" },
          { name: "title", label: "Title", required: true },
          { name: "dueAt", label: "Due date", type: "date", required: true },
          { name: "reminderAt", label: "Reminder date", type: "date" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Pending", value: "PENDING" },
              { label: "Done", value: "DONE" },
              { label: "Overdue", value: "OVERDUE" },
              { label: "Cancelled", value: "CANCELLED" },
            ],
          },
          { name: "description", label: "Description", type: "textarea" },
        ]}
        columns={[
          { label: "Milestone", render: (milestone) => <strong className="text-stone-950">{milestone.title}</strong> },
          { label: "Campaign", render: (milestone) => milestone.campaign?.name ?? "Unknown" },
          { label: "Brand", render: (milestone) => milestone.campaign?.brand?.name ?? "Unknown" },
          { label: "Due", render: (milestone) => formatDate(milestone.dueAt) },
          { label: "Reminder", render: (milestone) => formatDate(milestone.reminderAt) },
          { label: "Owner", render: (milestone) => milestone.assignedTo?.fullName ?? "Unassigned" },
          { label: "Status", render: (milestone) => milestone.status },
        ]}
      />
    </div>
  )
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString() : "Unset"
}
