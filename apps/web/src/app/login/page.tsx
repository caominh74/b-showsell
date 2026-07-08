"use client"

import { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, LockKeyhole, Mail } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

function defaultDestination(role: string) {
  if (role === "ADMIN") {
    return "/admin"
  }

  if (role === "STAFF") {
    return "/staff"
  }

  return "/account"
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState("admin@beautyblogger.com")
  const [password, setPassword] = useState("admin123")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const next = useMemo(() => searchParams.get("next"), [searchParams])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const user = await login({ email, password })
      router.replace(next || defaultDestination(user.role))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-stone-50 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-stone-950 text-white lg:block">
        <div className="absolute inset-0 bg-[url('/hero_beauty_store.jpg')] bg-cover bg-center opacity-70" />
        <div className="absolute inset-0 bg-stone-950/45" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <Link href="/" className="absolute left-12 top-10 text-xl font-black tracking-tight">
            B-SHOWSELL
          </Link>
          <p className="max-w-lg text-4xl font-semibold leading-tight">
            Campaign operations, storefront orders, and creator revenue in one workspace.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex text-lg font-black tracking-tight lg:hidden">
            B-SHOWSELL
          </Link>
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-rose-600">Team sign in</p>
              <h1 className="mt-2 text-2xl font-semibold text-stone-950">Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Use your Admin, Staff, or Customer account to continue.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Email</span>
                <span className="mt-1 flex h-11 items-center gap-2 rounded-md border border-stone-300 bg-white px-3 focus-within:border-stone-950">
                  <Mail className="size-4 text-stone-400" aria-hidden="true" />
                  <input
                    className="w-full bg-transparent text-sm outline-none"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-stone-700">Password</span>
                <span className="mt-1 flex h-11 items-center gap-2 rounded-md border border-stone-300 bg-white px-3 focus-within:border-stone-950">
                  <LockKeyhole className="size-4 text-stone-400" aria-hidden="true" />
                  <input
                    className="w-full bg-transparent text-sm outline-none"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="rounded p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <Eye className="size-4" aria-hidden="true" />
                  </button>
                </span>
              </label>

              {error ? (
                <p className="rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>
              ) : null}

              <Button className="h-11 w-full" type="submit" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 text-sm font-medium text-stone-600">
          Loading sign in...
        </main>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}
