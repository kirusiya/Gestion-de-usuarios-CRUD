"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/users")
      } else {
        router.push("/signin")
      }
    }
  }, [isAuthenticated, loading, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-bold mb-4">Welcome to SPS User Management</h1>
      <p className="text-lg text-gray-600">Redirecting...</p>
    </div>
  )
}
