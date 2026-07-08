import { AppShell } from "@/components/app-shell"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <AppShell title="Customer Account" eyebrow="Shopping profile">
        {children}
      </AppShell>
    </ProtectedRoute>
  )
}
