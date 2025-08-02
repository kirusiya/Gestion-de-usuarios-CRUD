import type { User } from "./types"
import { v4 as uuidv4 } from "uuid"

// In-memory user storage
const users: User[] = [
  {
    id: uuidv4(),
    name: "admin",
    email: "admin@spsgroup.com.br",
    type: "admin",
    password: "1234", // As per test requirements, no encryption needed
  },
]

export const userStore = {
  findAll: (): User[] => {
    return users.map(({ password, ...user }) => user) // Exclude password
  },
  findById: (id: string): User | undefined => {
    return users.find((user) => user.id === id)
  },
  findByEmail: (email: string): User | undefined => {
    return users.find((user) => user.email === email)
  },
  create: (user: Omit<User, "id">): User => {
    const newUser = { id: uuidv4(), ...user }
    users.push(newUser)
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },
  update: (id: string, updates: Partial<User>): User | undefined => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      const { password, ...updatedUser } = users[index]
      return updatedUser
    }
    return undefined
  },
  delete: (id: string): boolean => {
    const initialLength = users.length
    const updatedUsers = users.filter((user) => user.id !== id)
    users.splice(0, users.length, ...updatedUsers) // Mutate original array
    return users.length < initialLength
  },
}
