import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { authenticateRequest } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const locations = await executeQuery("SELECT * FROM locations ORDER BY name")
    return NextResponse.json({ locations })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
