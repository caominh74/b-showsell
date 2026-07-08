"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  clearSession,
  getCurrentUser,
  getStoredToken,
  getStoredUser,
  loginRequest,
  registerRequest,
  saveSession,
  type LoginPayload,
  type RegisterPayload,
  type User,
} from "@/lib/api-client"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  refreshProfile: () => Promise<User | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (!getStoredToken()) {
      setUser(null)
      return null
    }

    try {
      const profile = await getCurrentUser()
      setUser(profile)
      localStorage.setItem("user", JSON.stringify(profile))
      return profile
    } catch {
      setUser(null)
      return null
    }
  }

  useEffect(() => {
    const hydrate = async () => {
      const storedUser = getStoredUser()
      if (storedUser) {
        setUser(storedUser)
      }

      await refreshProfile()
      setLoading(false)
    }

    void hydrate()
  }, [])

  const login = async (payload: LoginPayload) => {
    const session = await loginRequest(payload)
    saveSession(session)
    setUser(session.user)
    return session.user
  }

  const register = async (payload: RegisterPayload) => {
    const session = await registerRequest(payload)
    saveSession(session)
    setUser(session.user)
    return session.user
  }

  const logout = () => {
    clearSession()
    setUser(null)
    window.location.href = "/login"
  }

  const value = useMemo(
    () => ({ user, loading, login, register, refreshProfile, logout }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { User }
