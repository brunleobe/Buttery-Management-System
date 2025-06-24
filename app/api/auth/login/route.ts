import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, testConnection } from "@/lib/db"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("Login attempt started")

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

    const { email, password } = body

    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("Attempting login for email:", email)

    // Get user from database
    const query = `
      SELECT id, name, email, phone, password_hash, role, location, status 
      FROM users 
      WHERE email = ? AND status = 'active'
    `

    console.log("Executing user query...")
    const results = (await executeQuery(query, [email])) as any[]

    if (results.length === 0) {
      console.log("User not found or inactive")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = results[0]
    console.log("User found, verifying password...")

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      console.log("Invalid password")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("Password verified, generating token...")

    // Generate token
    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      status: user.status,
    })

    console.log("Token generated, creating response...")

    // Set cookie and return response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        status: user.status,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    console.log("Login successful")
    return response
  } catch (error) {
    console.error("Login error:", error)

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
    }

    return NextResponse.json({ error: "Internal server error. Please check the server logs." }, { status: 500 })
  }
}
