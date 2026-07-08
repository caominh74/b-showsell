import { AppShell } from "@/components/app-shell"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
      <AppShell title="Staff Operations" eyebrow="Store workflow">
        {children}
      </AppShell>
    </ProtectedRoute>
  )
}
