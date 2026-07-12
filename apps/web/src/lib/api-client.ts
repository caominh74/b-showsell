export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export type Role = "ADMIN" | "STAFF" | "CUSTOMER"

export interface User {
  id: string
  email: string
  fullName: string
  phone?: string | null
  role: Role
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED"
  avatarUrl?: string | null
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  fullName: string
  phone?: string
}

const TOKEN_KEY = "access_token"
const USER_KEY = "user"

export function getStoredToken() {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
}

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null
  }

  const storedUser = localStorage.getItem(USER_KEY)
  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as User
  } catch {
    clearSession()
    return null
  }
}

export function saveSession(session: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, session.access_token)
  localStorage.setItem(USER_KEY, JSON.stringify(session.user))
}

export function clearSession() {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}) {
  const token = getStoredToken()
  const headers = new Headers(options.headers || {})

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      clearSession()
    }

    const error = await response.json().catch(() => ({ message: response.statusText }))
    const message = Array.isArray(error.message) ? error.message.join(", ") : error.message
    throw new Error(message || "API request failed")
  }

  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("text/csv") || contentType.includes("text/plain")) {
    return response.text() as Promise<T>
  }

  return response.json().catch(() => null) as Promise<T>
}

export function loginRequest(payload: LoginPayload) {
  return fetchApi<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function registerRequest(payload: RegisterPayload) {
  return fetchApi<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getCurrentUser() {
  return fetchApi<User>("/auth/me")
}

export function assetUrl(url?: string | null) {
  if (!url) {
    return ""
  }
  if (url.startsWith("http")) {
    return url
  }
  return `${API_URL}${url}`
}
