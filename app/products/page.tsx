"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Filter } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  location: string
  lowStockThreshold: number
  lastUpdated: string
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

  const products: Product[] = [
    {
      id: "1",
      name: "Coca Cola",
      category: "Drinks",
      price: 300,
      stock: 50,
      location: "Mary Hall",
      lowStockThreshold: 10,
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      name: "Bread",
      category: "Pastry",
      price: 200,
      stock: 5,
      location: "CST Hall",
      lowStockThreshold: 10,
      lastUpdated: "2024-01-15",
    },
    {
      id: "3",
      name: "Biscuits",
      category: "Snacks",
      price: 150,
      stock: 25,
      location: "Paul Hall",
      lowStockThreshold: 15,
      lastUpdated: "2024-01-14",
    },
    {
      id: "4",
      name: "Water",
      category: "Drinks",
      price: 100,
      stock: 100,
      location: "Mary Hall",
      lowStockThreshold: 20,
      lastUpdated: "2024-01-15",
    },
    {
      id: "5",
      name: "Meat Pie",
      category: "Pastry",
      price: 400,
      stock: 8,
      location: "Engineering",
      lowStockThreshold: 10,
      lastUpdated: "2024-01-14",
    },
    {
      id: "6",
      name: "Juice",
      category: "Drinks",
      price: 250,
      stock: 40,
      location: "CST Hall",
      lowStockThreshold: 15,
      lastUpdated: "2024-01-15",
    },
    {
      id: "7",
      name: "Cookies",
      category: "Snacks",
      price: 180,
      stock: 30,
      location: "Paul Hall",
      lowStockThreshold: 12,
      lastUpdated: "2024-01-13",
    },
    {
      id: "8",
      name: "Sausage Roll",
      category: "Pastry",
      price: 350,
      stock: 12,
      location: "Medical",
      lowStockThreshold: 8,
      lastUpdated: "2024-01-15",
    },
  ]

  const categories = ["All Categories", "Drinks", "Pastry", "Snacks"]
  const locations = ["All Locations", "Mary Hall", "CST Hall", "Paul Hall", "Engineering", "Medical"]

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (product.stock <= product.lowStockThreshold)
      return { label: "Low Stock", color: "bg-orange-100 text-orange-800" }
    return { label: "In Stock", color: "bg-green-100 text-green-800" }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesLocation = locationFilter === "all" || product.location === locationFilter
    return matchesSearch && matchesCategory && matchesLocation
  })

  const getTotalValue = () => {
    return filteredProducts.reduce((sum, product) => sum + product.price * product.stock, 0)
  }

  const getLowStockCount = () => {
    return filteredProducts.filter((product) => product.stock <= product.lowStockThreshold).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Product Catalog</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredProducts.length}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{getTotalValue().toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Current inventory value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{getLowStockCount()}</div>
              <p className="text-xs text-muted-foreground">Need restocking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <p className="text-xs text-muted-foreground">Product categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category === "All Categories" ? "all" : category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location === "All Locations" ? "all" : location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                  setLocationFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>
              Showing {filteredProducts.length} of {products.length} products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Stock Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product)
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>{product.location}</TableCell>
                      <TableCell>₦{product.price.toLocaleString()}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>₦{(product.price * product.stock).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{product.lastUpdated}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found matching your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
