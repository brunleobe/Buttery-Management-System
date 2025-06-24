import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, role, location } = await request.json()

    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = (await executeQuery("SELECT id FROM users WHERE email = ?", [email])) as any[]

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Insert new user
    const insertQuery = `
      INSERT INTO users (name, email, phone, password_hash, role, location, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `
    const result = (await executeQuery(insertQuery, [name, email, phone, passwordHash, role, location || null])) as any

    // Get the created user
    const newUser = {
      id: result.insertId,
      name,
      email,
      phone,
      role,
      location: location || null,
      status: "active" as const,
    }

    // Generate token
    const token = generateToken(newUser)

    // Set cookie
    const response = NextResponse.json({ user: newUser })
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
