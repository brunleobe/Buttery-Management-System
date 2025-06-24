import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { executeQuery } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: "vendor" | "inventory_manager" | "admin"
  location: string | null
  status: "active" | "inactive"
}

export async function hashPassword(password: string): Promise<string> {
  try {
    console.log("Hashing password...")
    const hash = await bcrypt.hash(password, 10)
    console.log("Password hashed successfully")
    return hash
  } catch (error) {
    console.error("Password hashing error:", error)
    throw new Error("Failed to hash password")
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    console.log("Verifying password...")
    const isValid = await bcrypt.compare(password, hash)
    console.log("Password verification result:", isValid)
    return isValid
  } catch (error) {
    console.error("Password verification error:", error)
    throw new Error("Failed to verify password")
  }
}

export function generateToken(user: User): string {
  try {
    console.log("Generating token for user:", user.email)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )
    console.log("Token generated successfully")
    return token
  } catch (error) {
    console.error("Token generation error:", error)
    throw new Error("Failed to generate token")
  }
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    console.log("Getting user by email:", email)
    const query = `
      SELECT id, name, email, phone, password_hash, role, location, status 
      FROM users 
      WHERE email = ? AND status = 'active'
    `
    const results = (await executeQuery(query, [email])) as any[]

    if (results.length === 0) {
      console.log("User not found")
      return null
    }

    const user = results[0]
    console.log("User found:", user.email)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      status: user.status,
    }
  } catch (error) {
    console.error("Get user by email error:", error)
    throw error
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    console.log("Getting user by ID:", id)
    const query = `
      SELECT id, name, email, phone, role, location, status 
      FROM users 
      WHERE id = ? AND status = 'active'
    `
    const results = (await executeQuery(query, [id])) as any[]

    if (results.length === 0) {
      console.log("User not found")
      return null
    }

    const user = results[0]
    console.log("User found:", user.email)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      status: user.status,
    }
  } catch (error) {
    console.error("Get user by ID error:", error)
    throw error
  }
}
