import jwt from "jsonwebtoken"
import type { User } from "./types"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key" // Fallback for local dev

export const generateToken = (user: Omit<User, "password">): string => {
  return jwt.sign({ id: user.id, email: user.email, type: user.type }, JWT_SECRET, { expiresIn: "1h" })
}

export const verifyToken = (request: Request): { user?: Omit<User, "password">; error?: string } => {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) {
    return { error: "No token provided" }
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
    return { error: "Token format is invalid" }
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Omit<User, "password">
    return { user: decoded }
  } catch (error) {
    return { error: "Invalid or expired token" }
  }
}

export const authMiddleware = (
  handler: (req: Request, context: { params?: any; user?: Omit<User, "password"> }) => Promise<NextResponse>,
) => {
  return async (req: Request, context: { params?: any }) => {
    const { user, error } = verifyToken(req)

    if (error) {
      return NextResponse.json({ success: false, message: error }, { status: 401 })
    }

    // Attach user to context for the handler
    return handler(req, { ...context, user })
  }
}

export const adminAuthMiddleware = (
  handler: (req: Request, context: { params?: any; user?: Omit<User, "password"> }) => Promise<NextResponse>,
) => {
  return async (req: Request, context: { params?: any }) => {
    const { user, error } = verifyToken(req)

    if (error) {
      return NextResponse.json({ success: false, message: error }, { status: 401 })
    }

    if (user?.type !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied: Admin required" }, { status: 403 })
    }

    // Attach user to context for the handler
    return handler(req, { ...context, user })
  }
}
