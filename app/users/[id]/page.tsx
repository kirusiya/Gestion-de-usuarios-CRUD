"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { userService } from "@/lib/user-service"
import type { User } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth-context"

interface UserEditPageProps {
  params: { id: string }
}

export default function UserEditPage({ params }: UserEditPageProps) {
  const { id } = params
  const router = useRouter()
  const { user: currentUser } = useAuth()

  const [user, setUser] = useState<Omit<User, "password"> | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [type, setType] = useState<"admin" | "user">("user")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await userService.get(id)
        if (response.success && response.data) {
          setUser(response.data)
          setName(response.data.name)
          setEmail(response.data.email)
          setType(response.data.type)
        } else {
          setError(response.message || "Failed to fetch user.")
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    if (currentUser?.type !== "admin") {
      setError("You do not have permission to edit users.")
      setSubmitting(false)
      return
    }

    try {
      const response = await userService.update(id, { name, email, type })
      if (response.success) {
        setSuccess("User updated successfully!")
        router.push("/users") // Redirect back to user list
      } else {
        setError(response.message || "Failed to update user.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during update.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <p>Loading user data...</p>
        </div>
      </ProtectedRoute>
    )
  }

  if (error && !user) {
    // Only show error if user data couldn't be loaded at all
    return (
      <ProtectedRoute adminOnly>
        <div className="text-red-500 text-center min-h-[calc(100vh-64px)] flex items-center justify-center">
          <p>Error: {error}</p>
        </div>
      </ProtectedRoute>
    )
  }

  if (!user) {
    return (
      <ProtectedRoute adminOnly>
        <div className="text-center min-h-[calc(100vh-64px)] flex items-center justify-center">
          <p>User not found.</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute adminOnly>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value: "admin" | "user") => setType(value)} disabled={submitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => router.push("/users")}
              disabled={submitting}
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </ProtectedRoute>
  )
}
