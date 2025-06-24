"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Users, AlertTriangle, DollarSign, BarChart3, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  role: string
  location: string
}

interface DashboardData {
  sales: {
    revenue: number
    transactions: number
    items_sold: number
  }
  inventory: {
    low_stock_count: number
    total_products: number
  }
  recent_activity: any[]
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const userData = localStorage.getItem("user")
        if (!userData) {
          router.push("/")
          return
        }

        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Fetch dashboard data
        const response = await fetch("/api/reports/dashboard?period=today")
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      localStorage.removeItem("user")
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      // Still redirect even if API call fails
      localStorage.removeItem("user")
      router.push("/")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "inventory_manager":
        return "bg-blue-100 text-blue-800"
      case "vendor":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "inventory_manager":
        return "Inventory Manager"
      case "vendor":
        return "Vendor"
      case "admin":
        return "Admin"
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Buttery Management System</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getRoleColor(user.role)}>{getRoleDisplay(user.role)}</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{dashboardData?.sales.revenue?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">{dashboardData?.sales.transactions || 0} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.sales.items_sold || 0}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dashboardData?.inventory.low_stock_count || 0}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.inventory.total_products || 0}</div>
              <p className="text-xs text-muted-foreground">Across all locations</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {(user.role === "vendor" || user.role === "admin") && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href="/sales">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
                    Record Sale
                  </CardTitle>
                  <CardDescription>Process new sales transactions</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          )}

          {(user.role === "inventory_manager" || user.role === "admin") && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href="/inventory">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-green-600" />
                    Manage Inventory
                  </CardTitle>
                  <CardDescription>Update stock levels and products</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          )}

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/reports">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  View Reports
                </CardTitle>
                <CardDescription>Generate sales and inventory reports</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          {user.role === "admin" && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href="/users">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-orange-600" />
                    Manage Users
                  </CardTitle>
                  <CardDescription>Add and manage system users</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          )}

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/products">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-indigo-600" />
                  View Products
                </CardTitle>
                <CardDescription>Browse all products and stock levels</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          {user.role === "admin" && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href="/settings">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-600" />
                    System Settings
                  </CardTitle>
                  <CardDescription>Configure system preferences</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.recent_activity && dashboardData.recent_activity.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recent_activity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-3 ${
                          activity.type === "sale" ? "bg-green-500" : "bg-blue-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-600">
                          {activity.location} • {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {activity.amount && (
                      <span className="text-green-600 font-medium">₦{activity.amount.toLocaleString()}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
