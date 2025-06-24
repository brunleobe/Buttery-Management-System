import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { db, type User } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: Omit<User, "created_at">): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await db.getUserByEmail(email)
  if (!user) return null

  // For demo purposes, accept 'admin123' for admin user
  if (user.email === "admin@buttery.com" && password === "admin123") {
    return user
  }

  // TODO: Implement actual password verification when database is connected
  // const isValid = await verifyPassword(password, user.password_hash)
  // return isValid ? user : null

  return null
}
