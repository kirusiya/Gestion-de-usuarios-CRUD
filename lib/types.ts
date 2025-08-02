export interface User {
  id: string
  name: string
  email: string
  type: "admin" | "user"
  password?: string // Password is optional for fetching, but required for creation/update
}

export interface AuthResponse {
  token: string
  user: Omit<User, "password">
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}
