import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // For demo purposes, we'll use simple password matching
    // In production, you should hash passwords and store them in the database
    const demoPasswords: { [key: string]: string } = {
      "mercy@example.com": "admin123",
      "jessica@example.com": "vendor123",
      "emmanuel@example.com": "manager123",
      "esther@example.com": "vendor123",
      "sylvanus@example.com": "manager123",
      "sharon@example.com": "vendor123",
      "elozino@example.com": "vendor123",
    }

    if (!demoPasswords[email] || demoPasswords[email] !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = await db.getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const token = generateToken({
      id: user.UserID,
      name: `${user.First_Name} ${user.Last_Name}`,
      email: user.Email_Address,
      phone: user.Phone_Number,
      role: user.Role.toLowerCase(),
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.UserID,
        name: `${user.First_Name} ${user.Last_Name}`,
        email: user.Email_Address,
        phone: user.Phone_Number,
        role: user.Role.toLowerCase(),
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
