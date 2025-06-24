import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { authenticateRequest } from "@/lib/auth" // Declare the authenticateRequest variable

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const sales = await db.getSales(limit, offset)
    return NextResponse.json({ sales })
  } catch (error) {
    console.error("Get sales error:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  if (!["admin", "vendor"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  try {
    const saleData = await request.json()
    const newSale = await db.createSale(saleData, auth.user.id)
    return NextResponse.json({ sale: newSale }, { status: 201 })
  } catch (error) {
    console.error("Create sale error:", error)
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
  }
}
