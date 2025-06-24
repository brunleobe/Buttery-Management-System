import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { authenticateRequest } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        l.name as location_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN locations l ON p.location_id = l.id
      WHERE p.status = 'active'
      ORDER BY p.name
    `
    const products = await executeQuery(query)
    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  // Check if user has permission to add products
  if (!["admin", "inventory_manager"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  try {
    const { name, category_id, price, stock_quantity, low_stock_threshold, location_id } = await request.json()

    const insertQuery = `
      INSERT INTO products (name, category_id, price, stock_quantity, low_stock_threshold, location_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const result = (await executeQuery(insertQuery, [
      name,
      category_id,
      price,
      stock_quantity || 0,
      low_stock_threshold || 10,
      location_id,
    ])) as any

    return NextResponse.json({
      message: "Product created successfully",
      productId: result.insertId,
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
