import type { User, ApiResponse } from "./types"

const API_BASE_URL = "/api" // Relative path for Next.js API routes

class UserService {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  private async request<T>(method: string, path: string, data?: any): Promise<ApiResponse<T>> {
    const token = this.getToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const config: RequestInit = {
      method,
      headers,
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    const response = await fetch(`${API_BASE_URL}${path}`, config)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || `API Error: ${response.status}`)
    }

    return result
  }

  async list(): Promise<ApiResponse<Omit<User, "password">[]>> {
    return this.request<Omit<User, "password">[]>("GET", "/users")
  }

  async get(id: string): Promise<ApiResponse<Omit<User, "password">>> {
    return this.request<Omit<User, "password">>("GET", `/users/${id}`)
  }

  async create(data: Omit<User, "id">): Promise<ApiResponse<Omit<User, "password">>> {
    return this.request<Omit<User, "password">>("POST", "/users", data)
  }

  async update(id: string, data: Partial<Omit<User, "id" | "password">>): Promise<ApiResponse<Omit<User, "password">>> {
    return this.request<Omit<User, "password">>("PUT", `/users/${id}`, data)
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    return this.request<null>("DELETE", `/users/${id}`)
  }
}

export const userService = new UserService()
