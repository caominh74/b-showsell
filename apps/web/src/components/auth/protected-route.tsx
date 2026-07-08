"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShieldAlert } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Role } from "@/lib/api-client"
import { buttonVariants } from "@/components/ui/button"

interface ProtectedRouteProps {
  allowedRoles?: Role[]
  children: React.ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [loading, pathname, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
        <div className="text-sm font-medium text-stone-600">Loading workspace...</div>
      </div>
    )
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
        <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <ShieldAlert className="mb-4 size-8 text-rose-600" aria-hidden="true" />
          <h1 className="text-xl font-semibold text-stone-950">Access restricted</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Your current role does not have access to this workspace.
          </p>
          <Link href="/" className={buttonVariants({ className: "mt-6" })}>
            Return home
          </Link>
        </section>
      </main>
    )
  }

  return children
}
