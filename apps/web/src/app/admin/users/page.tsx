"use client"

import { RecordManager } from "@/components/management/record-manager"

type AdminUser = {
  id: string
  email: string
  fullName: string
  role: string
  status: string
  createdAt: string
}

export default function AdminUsersPage() {
  return (
    <RecordManager<AdminUser>
      title="User management"
      description="Create admin, staff, and customer accounts, then track role and account status from one table."
      endpoint="/admin/users"
      emptyText="No users found."
      fields={[
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Password", type: "password", required: true },
        { name: "fullName", label: "Full name", required: true },
        {
          name: "role",
          label: "Role",
          type: "select",
          required: true,
          options: [
            { label: "Admin", value: "ADMIN" },
            { label: "Staff", value: "STAFF" },
            { label: "Customer", value: "CUSTOMER" },
          ],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
            { label: "Suspended", value: "SUSPENDED" },
          ],
        },
        { name: "phone", label: "Phone" },
      ]}
      columns={[
        { label: "Name", render: (user) => <strong className="text-stone-950">{user.fullName}</strong> },
        { label: "Email", render: (user) => user.email },
        { label: "Role", render: (user) => <Badge>{user.role}</Badge> },
        { label: "Status", render: (user) => <Badge>{user.status}</Badge> },
        { label: "Created", render: (user) => new Date(user.createdAt).toLocaleDateString() },
      ]}
    />
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-700">{children}</span>
}
