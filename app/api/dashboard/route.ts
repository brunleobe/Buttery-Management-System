import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const stats = await db.getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
