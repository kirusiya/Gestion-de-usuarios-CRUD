import { NextResponse } from "next/server"
import { userStore } from "@/lib/users"
import { authMiddleware, adminAuthMiddleware } from "@/lib/auth"
import type { User, ApiResponse } from "@/lib/types"

// GET /api/users - List all users (protected)
export const GET = authMiddleware(async (request) => {
  const users = userStore.findAll()
  return NextResponse.json<ApiResponse<Omit<User, "password">[]>>({ success: true, data: users }, { status: 200 })
})

// POST /api/users - Create a new user (admin protected)
export const POST = adminAuthMiddleware(async (request) => {
  const { name, email, type, password } = await request.json()

  if (!name || !email || !type || !password) {
    return NextResponse.json(
      { success: false, message: "Name, email, type, and password are required" },
      { status: 400 },
    )
  }

  if (userStore.findByEmail(email)) {
    return NextResponse.json({ success: false, message: "Email already exists" }, { status: 409 })
  }

  const newUser = userStore.create({ name, email, type, password })
  return NextResponse.json<ApiResponse<Omit<User, "password">>>({ success: true, data: newUser }, { status: 201 })
})
