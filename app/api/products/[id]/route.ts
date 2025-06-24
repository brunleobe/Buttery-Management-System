import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { authenticateRequest } from "@/lib/middleware"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateRequest(request)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  if (!["admin", "inventory_manager"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  try {
    const { name, category_id, price, low_stock_threshold, location_id } = await request.json()

    const updateQuery = `
      UPDATE products 
      SET name = ?, category_id = ?, price = ?, low_stock_threshold = ?, location_id = ?, updated_at = NOW()
      WHERE id = ?
    `
    await executeQuery(updateQuery, [name, category_id, price, low_stock_threshold, location_id, params.id])

    return NextResponse.json({ message: "Product updated successfully" })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authenticateRequest(request)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  if (auth.user.role !== "admin") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  try {
    const updateQuery = `UPDATE products SET status = 'inactive' WHERE id = ?`
    await executeQuery(updateQuery, [params.id])

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
