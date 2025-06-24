"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, AlertTriangle, Package, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  location: string
  lowStockThreshold: number
}

interface Transaction {
  id: string
  type: "IN" | "OUT" | "DAMAGE"
  productName: string
  quantity: number
  date: string
  location: string
  handler: string
  reason?: string
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Coca Cola",
      category: "Drinks",
      price: 300,
      stock: 50,
      location: "Mary Hall",
      lowStockThreshold: 10,
    },
    { id: "2", name: "Bread", category: "Pastry", price: 200, stock: 5, location: "CST Hall", lowStockThreshold: 10 },
    {
      id: "3",
      name: "Biscuits",
      category: "Snacks",
      price: 150,
      stock: 25,
      location: "Paul Hall",
      lowStockThreshold: 15,
    },
    {
      id: "4",
      name: "Water",
      category: "Drinks",
      price: 100,
      stock: 100,
      location: "Mary Hall",
      lowStockThreshold: 20,
    },
    {
      id: "5",
      name: "Meat Pie",
      category: "Pastry",
      price: 400,
      stock: 8,
      location: "Engineering",
      lowStockThreshold: 10,
    },
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    location: "",
    lowStockThreshold: 10,
  })
  const [stockUpdate, setStockUpdate] = useState({
    productId: "",
    type: "IN" as "IN" | "OUT" | "DAMAGE",
    quantity: 0,
    reason: "",
  })

  const categories = ["Drinks", "Pastry", "Snacks", "Others"]
  const locations = ["Mary Hall", "CST Hall", "Paul Hall", "Engineering", "Medical"]

  const addProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.location) return

    const product: Product = {
      id: Date.now().toString(),
      ...newProduct,
    }

    setProducts([...products, product])
    setNewProduct({ name: "", category: "", price: 0, stock: 0, location: "", lowStockThreshold: 10 })
  }

  const updateStock = () => {
    if (!stockUpdate.productId || stockUpdate.quantity <= 0) return

    const product = products.find((p) => p.id === stockUpdate.productId)
    if (!product) return

    let newStock = product.stock
    if (stockUpdate.type === "IN") {
      newStock += stockUpdate.quantity
    } else {
      newStock -= stockUpdate.quantity
    }

    setProducts(products.map((p) => (p.id === stockUpdate.productId ? { ...p, stock: Math.max(0, newStock) } : p)))

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: stockUpdate.type,
      productName: product.name,
      quantity: stockUpdate.quantity,
      date: new Date().toLocaleString(),
      location: product.location,
      handler: "Current User",
      reason: stockUpdate.reason || undefined,
    }

    setTransactions([transaction, ...transactions])
    setStockUpdate({ productId: "", type: "IN", quantity: 0, reason: "" })
  }

  const getLowStockProducts = () => {
    return products.filter((p) => p.stock <= p.lowStockThreshold)
  }

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (product.stock <= product.lowStockThreshold)
      return { label: "Low Stock", color: "bg-orange-100 text-orange-800" }
    return { label: "In Stock", color: "bg-green-100 text-green-800" }
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
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Inventory Management</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{getLowStockProducts().length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="stock-update">Stock Update</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product Inventory</CardTitle>
                  <CardDescription>Manage all products across locations</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>Enter product details to add to inventory</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Select
                            value={newProduct.location}
                            onValueChange={(value) => setNewProduct({ ...newProduct, location: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((loc) => (
                                <SelectItem key={loc} value={loc}>
                                  {loc}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Price (₦)</Label>
                          <Input
                            type="number"
                            value={newProduct.price}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, price: Number.parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Initial Stock</Label>
                          <Input
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) || 0 })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Low Stock Alert</Label>
                          <Input
                            type="number"
                            value={newProduct.lowStockThreshold}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, lowStockThreshold: Number.parseInt(e.target.value) || 10 })
                            }
                          />
                        </div>
                      </div>
                      <Button onClick={addProduct} className="w-full">
                        Add Product
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const status = getStockStatus(product)
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.location}</TableCell>
                          <TableCell>₦{product.price}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge className={status.color}>{status.label}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock-update">
            <Card>
              <CardHeader>
                <CardTitle>Update Stock Levels</CardTitle>
                <CardDescription>Record stock movements and adjustments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select
                      value={stockUpdate.productId}
                      onValueChange={(value) => setStockUpdate({ ...stockUpdate, productId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {product.location} (Current: {product.stock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Transaction Type</Label>
                    <Select
                      value={stockUpdate.type}
                      onValueChange={(value: "IN" | "OUT" | "DAMAGE") =>
                        setStockUpdate({ ...stockUpdate, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IN">Stock In (Restock)</SelectItem>
                        <SelectItem value="OUT">Stock Out (Sale/Transfer)</SelectItem>
                        <SelectItem value="DAMAGE">Damage/Expiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={stockUpdate.quantity}
                      onChange={(e) =>
                        setStockUpdate({ ...stockUpdate, quantity: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reason (Optional)</Label>
                    <Input
                      value={stockUpdate.reason}
                      onChange={(e) => setStockUpdate({ ...stockUpdate, reason: e.target.value })}
                      placeholder="Enter reason for stock change"
                    />
                  </div>
                </div>
                <Button onClick={updateStock} disabled={!stockUpdate.productId || stockUpdate.quantity <= 0}>
                  Update Stock
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Stock Transactions</CardTitle>
                <CardDescription>History of all stock movements</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No transactions recorded yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Handler</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.type === "IN"
                                  ? "default"
                                  : transaction.type === "OUT"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.productName}</TableCell>
                          <TableCell>{transaction.quantity}</TableCell>
                          <TableCell>{transaction.location}</TableCell>
                          <TableCell>{transaction.handler}</TableCell>
                          <TableCell>{transaction.reason || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>Products that need restocking</CardDescription>
              </CardHeader>
              <CardContent>
                {getLowStockProducts().length === 0 ? (
                  <p className="text-green-600 text-center py-8">All products are well stocked!</p>
                ) : (
                  <div className="space-y-4">
                    {getLowStockProducts().map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200"
                      >
                        <div>
                          <h3 className="font-medium text-orange-900">{product.name}</h3>
                          <p className="text-sm text-orange-700">
                            {product.location} • Only {product.stock} left (Alert threshold: {product.lowStockThreshold}
                            )
                          </p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">
                          {product.stock === 0 ? "Out of Stock" : "Low Stock"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
