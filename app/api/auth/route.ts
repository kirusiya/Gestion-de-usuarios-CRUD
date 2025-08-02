import { NextResponse } from "next/server"
import { userStore } from "@/lib/users"
import { generateToken } from "@/lib/auth"
import type { AuthResponse } from "@/lib/types"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
  }

  const user = userStore.findByEmail(email)

  if (!user || user.password !== password) {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  }

  const { password: _, ...userWithoutPassword } = user
  const token = generateToken(userWithoutPassword)

  return NextResponse.json<AuthResponse>({ token, user: userWithoutPassword }, { status: 200 })
}
