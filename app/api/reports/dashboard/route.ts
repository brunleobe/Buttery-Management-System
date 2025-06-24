import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import { authenticateRequest } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "today"

    let dateFilter = ""
    switch (period) {
      case "today":
        dateFilter = "DATE(s.created_at) = CURDATE()"
        break
      case "week":
        dateFilter = "YEARWEEK(s.created_at) = YEARWEEK(NOW())"
        break
      case "month":
        dateFilter = "YEAR(s.created_at) = YEAR(NOW()) AND MONTH(s.created_at) = MONTH(NOW())"
        break
      default:
        dateFilter = "DATE(s.created_at) = CURDATE()"
    }

    // Get sales summary
    const salesQuery = `
      SELECT 
        COUNT(*) as transaction_count,
        SUM(total_amount) as total_revenue,
        SUM(si.quantity) as total_items_sold
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      WHERE ${dateFilter}
    `
    const salesData = (await executeQuery(salesQuery)) as any[]

    // Get low stock products
    const lowStockQuery = `
      SELECT COUNT(*) as low_stock_count
      FROM products p
      WHERE p.stock_quantity <= p.low_stock_threshold AND p.status = 'active'
    `
    const lowStockData = (await executeQuery(lowStockQuery)) as any[]

    // Get total active products
    const productsQuery = `
      SELECT COUNT(*) as total_products
      FROM products
      WHERE status = 'active'
    `
    const productsData = (await executeQuery(productsQuery)) as any[]

    // Get recent activity
    const activityQuery = `
      (SELECT 
        'sale' as type,
        s.created_at,
        CONCAT('Sale recorded - ', COUNT(si.id), ' items') as description,
        l.name as location,
        s.total_amount as amount
      FROM sales s
      LEFT JOIN sale_items si ON s.id = si.sale_id
      LEFT JOIN locations l ON s.location_id = l.id
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT 5)
      UNION ALL
      (SELECT 
        'inventory' as type,
        it.created_at,
        CONCAT(it.transaction_type, ' - ', p.name, ' (', it.quantity, ' units)') as description,
        l.name as location,
        NULL as amount
      FROM inventory_transactions it
      LEFT JOIN products p ON it.product_id = p.id
      LEFT JOIN locations l ON p.location_id = l.id
      ORDER BY it.created_at DESC
      LIMIT 5)
      ORDER BY created_at DESC
      LIMIT 10
    `
    const recentActivity = await executeQuery(activityQuery)

    const dashboardData = {
      sales: {
        revenue: salesData[0]?.total_revenue || 0,
        transactions: salesData[0]?.transaction_count || 0,
        items_sold: salesData[0]?.total_items_sold || 0,
      },
      inventory: {
        low_stock_count: lowStockData[0]?.low_stock_count || 0,
        total_products: productsData[0]?.total_products || 0,
      },
      recent_activity: recentActivity,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
