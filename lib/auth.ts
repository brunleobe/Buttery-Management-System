import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { executeQuery } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: "vendor" | "inventory_manager" | "admin"
  location: string
  status: "active" | "inactive"
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
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

export async function getUserByEmail(email: string): Promise<User | null> {
  const query = `
    SELECT u.*, l.name as location_name 
    FROM users u 
    LEFT JOIN locations l ON u.location = l.name 
    WHERE u.email = ? AND u.status = 'active'
  `
  const results = (await executeQuery(query, [email])) as any[]

  if (results.length === 0) return null

  const user = results[0]
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    location: user.location,
    status: user.status,
  }
}

export async function getUserById(id: number): Promise<User | null> {
  const query = `
    SELECT u.*, l.name as location_name 
    FROM users u 
    LEFT JOIN locations l ON u.location = l.name 
    WHERE u.id = ? AND u.status = 'active'
  `
  const results = (await executeQuery(query, [id])) as any[]

  if (results.length === 0) return null

  const user = results[0]
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    location: user.location,
    status: user.status,
  }
}
