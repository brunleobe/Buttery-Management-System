"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign, Package } from "lucide-react"
import Link from "next/link"

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [selectedLocation, setSelectedLocation] = useState("all")

  const locations = ["All Locations", "Mary Hall", "CST Hall", "Paul Hall", "Engineering", "Medical"]

  // Mock data - in real app, this would come from backend
  const salesData = {
    today: { revenue: 45231, items: 156, transactions: 42 },
    week: { revenue: 287450, items: 1024, transactions: 298 },
    month: { revenue: 1250000, items: 4567, transactions: 1234 },
  }

  const topProducts = [
    { name: "Coca Cola", sold: 45, revenue: 13500, location: "Mary Hall" },
    { name: "Bread", sold: 38, revenue: 7600, location: "CST Hall" },
    { name: "Water", sold: 67, revenue: 6700, location: "All" },
    { name: "Meat Pie", sold: 15, revenue: 6000, location: "Engineering" },
    { name: "Biscuits", sold: 32, revenue: 4800, location: "Paul Hall" },
  ]

  const recentTransactions = [
    {
      id: "1",
      date: "2024-01-15 14:30",
      product: "Coca Cola",
      quantity: 5,
      amount: 1500,
      location: "Mary Hall",
      vendor: "John Doe",
    },
    {
      id: "2",
      date: "2024-01-15 14:25",
      product: "Bread",
      quantity: 3,
      amount: 600,
      location: "CST Hall",
      vendor: "Jane Smith",
    },
    {
      id: "3",
      date: "2024-01-15 14:20",
      product: "Water",
      quantity: 10,
      amount: 1000,
      location: "Paul Hall",
      vendor: "Mike Johnson",
    },
    {
      id: "4",
      date: "2024-01-15 14:15",
      product: "Meat Pie",
      quantity: 2,
      amount: 800,
      location: "Engineering",
      vendor: "Sarah Wilson",
    },
    {
      id: "5",
      date: "2024-01-15 14:10",
      product: "Biscuits",
      quantity: 4,
      amount: 600,
      location: "Mary Hall",
      vendor: "John Doe",
    },
  ]

  const inventoryReport = [
    { product: "Coca Cola", category: "Drinks", stock: 50, value: 15000, status: "Good", location: "Mary Hall" },
    { product: "Bread", category: "Pastry", stock: 5, value: 1000, status: "Low", location: "CST Hall" },
    { product: "Water", category: "Drinks", stock: 100, value: 10000, status: "Good", location: "All" },
    { product: "Meat Pie", category: "Pastry", stock: 8, value: 3200, status: "Low", location: "Engineering" },
    { product: "Biscuits", category: "Snacks", stock: 25, value: 3750, status: "Good", location: "Paul Hall" },
  ]

  const getCurrentData = () => {
    return salesData[selectedPeriod as keyof typeof salesData]
  }

  const exportReport = (type: string) => {
    // Mock export functionality
    alert(`Exporting ${type} report for ${selectedPeriod}...`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 ml-4">Reports & Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase().replace(" ", "_")}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{getCurrentData().revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCurrentData().items}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +8% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCurrentData().transactions}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +15% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{Math.round(getCurrentData().revenue / getCurrentData().transactions).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 inline mr-1" />
                -3% from last period
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sales">Sales Report</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
            <TabsTrigger value="products">Product Performance</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Top Performing Products</CardTitle>
                    <CardDescription>Best selling items by revenue</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => exportReport("sales")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₦{product.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{product.sold} sold</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales by Location</CardTitle>
                  <CardDescription>Revenue breakdown by buttery location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Mary Hall Buttery</span>
                      <span className="font-bold">₦18,500</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">CST Hall Buttery</span>
                      <span className="font-bold">₦12,300</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Paul Hall Buttery</span>
                      <span className="font-bold">₦8,900</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Engineering Buttery</span>
                      <span className="font-bold">₦5,531</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Current Inventory Status</CardTitle>
                  <CardDescription>Stock levels and values across all locations</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportReport("inventory")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryReport.map((item) => (
                      <TableRow key={item.product}>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>₦{item.value.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.status === "Good" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product Performance Analysis</CardTitle>
                  <CardDescription>Detailed performance metrics for all products</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportReport("products")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Best Performers</h3>
                    <div className="space-y-3">
                      {topProducts.slice(0, 3).map((product, index) => (
                        <div
                          key={product.name}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {index + 1}
                            </div>
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <span className="text-green-600 font-bold">₦{product.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Category Performance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Drinks</span>
                        <span className="font-bold">₦20,200</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">Pastry</span>
                        <span className="font-bold">₦13,600</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="font-medium">Snacks</span>
                        <span className="font-bold">₦4,800</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest sales transactions across all locations</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => exportReport("transactions")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Vendor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-medium">{transaction.product}</TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>₦{transaction.amount.toLocaleString()}</TableCell>
                        <TableCell>{transaction.location}</TableCell>
                        <TableCell>{transaction.vendor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
