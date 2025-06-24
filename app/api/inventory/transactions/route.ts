import { type NextRequest, NextResponse } from "next/server"
import { executeQuery, executeTransaction } from "@/lib/db"
import { authenticateRequest } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const query = `
      SELECT 
        it.*,
        p.name as product_name,
        u.name as handler_name,
        l.name as location_name
      FROM inventory_transactions it
      LEFT JOIN products p ON it.product_id = p.id
      LEFT JOIN users u ON it.user_id = u.id
      LEFT JOIN locations l ON p.location_id = l.id
      ORDER BY it.created_at DESC
      LIMIT 100
    `
    const transactions = await executeQuery(query)
    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  if (!["admin", "inventory_manager"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
  }

  try {
    const { product_id, transaction_type, quantity, reason } = await request.json()

    const queries = []

    // Record inventory transaction
    queries.push({
      query: `
        INSERT INTO inventory_transactions (product_id, transaction_type, quantity, reason, user_id)
        VALUES (?, ?, ?, ?, ?)
      `,
      params: [product_id, transaction_type, quantity, reason || null, auth.user.id],
    })

    // Update product stock based on transaction type
    if (transaction_type === "IN") {
      queries.push({
        query: `UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?`,
        params: [quantity, product_id],
      })
    } else if (transaction_type === "OUT" || transaction_type === "DAMAGE") {
      queries.push({
        query: `UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - ?) WHERE id = ?`,
        params: [quantity, product_id],
      })
    }

    await executeTransaction(queries)

    return NextResponse.json({ message: "Transaction recorded successfully" })
  } catch (error) {
    console.error("Error recording transaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
