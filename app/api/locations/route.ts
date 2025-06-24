import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const locations = await db.getLocations()
    return NextResponse.json({ locations })
  } catch (error) {
    console.error("Get locations error:", error)
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 })
  }
}
