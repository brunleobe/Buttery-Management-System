import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, testConnection } from "@/lib/db"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("Registration attempt started")

    // Test database connection first
    const dbConnected = await testConnection()
    if (!dbConnected) {
      console.error("Database connection failed")
      return NextResponse.json(
        { error: "Database connection failed. Please check your database configuration." },
        { status: 500 },
      )
    }

    const body = await request.json()
    console.log("Request body received")

    const { name, email, phone, password, role, location } = body

    if (!name || !email || !phone || !password || !role) {
      console.log("Missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    console.log("Attempting registration for email:", email)

    // Check if user already exists
    console.log("Checking if user exists...")
    const existingUser = (await executeQuery("SELECT id FROM users WHERE email = ?", [email])) as any[]

    if (existingUser.length > 0) {
      console.log("User already exists")
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    console.log("User doesn't exist, hashing password...")

    // Hash password
    const passwordHash = await hashPassword(password)

    console.log("Password hashed, inserting user...")

    // Insert new user
    const insertQuery = `
      INSERT INTO users (name, email, phone, password_hash, role, location, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', NOW())
    `
    const result = (await executeQuery(insertQuery, [name, email, phone, passwordHash, role, location || null])) as any

    console.log("User inserted successfully, ID:", result.insertId)

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

    console.log("Generating token...")

    // Generate token
    const token = generateToken(newUser)

    console.log("Token generated, creating response...")

    // Set cookie and return response
    const response = NextResponse.json({
      success: true,
      user: newUser,
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    console.log("Registration successful")
    return response
  } catch (error) {
    console.error("Registration error:", error)

    // Return more specific error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        return NextResponse.json(
          { error: "Cannot connect to database. Please check if MySQL is running." },
          { status: 500 },
        )
      }
      if (error.message.includes("ER_ACCESS_DENIED_ERROR")) {
        return NextResponse.json({ error: "Database access denied. Please check your credentials." }, { status: 500 })
      }
      if (error.message.includes("ER_BAD_DB_ERROR")) {
        return NextResponse.json(
          { error: "Database does not exist. Please create the database first." },
          { status: 500 },
        )
      }
      if (error.message.includes("ER_DUP_ENTRY")) {
        return NextResponse.json({ error: "User with this email already exists." }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Internal server error. Please check the server logs." }, { status: 500 })
  }
}
