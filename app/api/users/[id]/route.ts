import { NextResponse } from "next/server"
import { userStore } from "@/lib/users"
import { authMiddleware, adminAuthMiddleware } from "@/lib/auth"
import type { User } from "@/lib/types"

// GET /api/users/[id] - Get a single user by ID (protected)
export const GET = authMiddleware(async (request, { params }) => {
  const { id } = params
  const user = userStore.findById(id)

  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
  }

  const { password, ...userWithoutPassword } = user
  return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 200 })
})

// PUT /api/users/[id] - Update a user by ID (admin protected)
export const PUT = adminAuthMiddleware(async (request, { params }) => {
  const { id } = params
  const updates: Partial<User> = await request.json()

  // Prevent changing ID or email to an existing one
  if (updates.email && userStore.findByEmail(updates.email) && userStore.findByEmail(updates.email)?.id !== id) {
    return NextResponse.json({ success: false, message: "Email already exists for another user" }, { status: 409 })
  }

  const updatedUser = userStore.update(id, updates)

  if (!updatedUser) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: updatedUser }, { status: 200 })
})

// DELETE /api/users/[id] - Delete a user by ID (admin protected)
export const DELETE = adminAuthMiddleware(async (request, { params }) => {
  const { id } = params
  const success = userStore.delete(id)

  if (!success) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, message: "User deleted successfully" }, { status: 200 })
})
