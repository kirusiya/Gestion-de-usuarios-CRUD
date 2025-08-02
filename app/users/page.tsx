"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { userService } from "@/lib/user-service"
import type { User } from "@/lib/types"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/context/auth-context"

export default function UsersPage() {
  const [users, setUsers] = useState<Omit<User, "password">[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user: currentUser } = useAuth()

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.list()
      if (response.success && response.data) {
        setUsers(response.data)
      } else {
        setError(response.message || "Failed to fetch users.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    try {
      const response = await userService.delete(id)
      if (response.success) {
        fetchUsers() // Refresh the list
      } else {
        setError(response.message || "Failed to delete user.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during deletion.")
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <p>Loading users...</p>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="text-red-500 text-center min-h-[calc(100vh-64px)] flex items-center justify-center">
          <p>Error: {error}</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Users</CardTitle>
          {currentUser?.type === "admin" && <Button onClick={() => router.push("/users/create")}>Add User</Button>}
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center text-gray-500">No users found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {currentUser?.type === "admin" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => router.push(`/users/${user.id}`)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </ProtectedRoute>
  )
}
