"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        SPS App
      </Link>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <Link href="/users" className="hover:text-gray-300">
              Users
            </Link>
            <span className="text-sm">
              Welcome, {user?.name} ({user?.type})
            </span>
            <Button onClick={logout} variant="secondary" size="sm">
              Logout
            </Button>
          </>
        ) : (
          <Link href="/signin">
            <Button variant="secondary" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
