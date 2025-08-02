"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/signin")
      } else if (adminOnly && user?.type !== "admin") {
        router.push("/users") // Redirect non-admins from admin-only pages
      }
    }
  }, [isAuthenticated, loading, router, adminOnly, user])

  if (loading || !isAuthenticated || (adminOnly && user?.type !== "admin")) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p>Loading or redirecting...</p>
      </div>
    )
  }

  return <>{children}</>
}
