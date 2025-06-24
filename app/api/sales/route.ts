import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeTransaction } from "@/lib/db"
import { authenticateRequest } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const query = `
      SELECT 
        s.*,
        l.name as location_name,
        u.name as vendor_name,
        COUNT(si.id) as item_count
      FROM sales s
      LEFT JOIN locations l ON s.location_id = l.id
      LEFT JOIN users u ON s.vendor_id = u.id
      LEFT JOIN sale_items si ON s.id = si.sale_id
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `
    const sales = await executeQuery(query, [limit, offset])
    return NextResponse.json({ sales })
  } catch (error) {
    console.error("Error fetching sales:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
    const { items, payment_method, location_id, total_amount } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in sale" }, { status: 400 })
    }

    // Prepare transaction queries
    const queries = []

    // Insert sale
    queries.push({
      query: `
        INSERT INTO sales (total_amount, payment_method, location_id, vendor_id)
        VALUES (?, ?, ?, ?)
      `,
      params: [total_amount, payment_method, location_id, auth.user.id],
    })

    // We'll need to get the sale ID after insertion, so we'll handle this differently
    const saleResult = (await executeQuery(
      "INSERT INTO sales (total_amount, payment_method, location_id, vendor_id) VALUES (?, ?, ?, ?)",
      [total_amount, payment_method, location_id, auth.user.id],
    )) as any

    const saleId = saleResult.insertId

    // Prepare sale items and stock updates
    const saleItemQueries = []
    const stockUpdateQueries = []

    for (const item of items) {
      // Insert sale item
      saleItemQueries.push({
        query: `
          INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price)
          VALUES (?, ?, ?, ?, ?)
        `,
        params: [saleId, item.product_id, item.quantity, item.unit_price, item.total_price],
      })

      // Update product stock
      stockUpdateQueries.push({
        query: `UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?`,
        params: [item.quantity, item.product_id],
      })

      // Record inventory transaction
      stockUpdateQueries.push({
        query: `
          INSERT INTO inventory_transactions (product_id, transaction_type, quantity, reason, user_id)
          VALUES (?, 'OUT', ?, 'Sale', ?)
        `,
        params: [item.product_id, item.quantity, auth.user.id],
      })
    }

    // Execute all queries in transaction
    await executeTransaction([...saleItemQueries, ...stockUpdateQueries])

    return NextResponse.json({
      message: "Sale recorded successfully",
      saleId,
    })
  } catch (error) {
    console.error("Error recording sale:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
