import { AppShell } from "@/components/app-shell"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AppShell title="Admin Dashboard" eyebrow="Owner workspace">
        {children}
      </AppShell>
    </ProtectedRoute>
  )
}
