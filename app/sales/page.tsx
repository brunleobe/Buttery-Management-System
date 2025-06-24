"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface SaleItem {
  id: string
  product: string
  quantity: number
  price: number
  total: number
}

interface Sale {
  id: string
  items: SaleItem[]
  total: number
  paymentMethod: string
  location: string
  date: string
  vendor: string
}

export default function SalesPage() {
  const [currentSale, setCurrentSale] = useState<SaleItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [location, setLocation] = useState("")
  const [recentSales, setRecentSales] = useState<Sale[]>([])

  const products = [
    { name: "Coca Cola", price: 300, stock: 50 },
    { name: "Bread", price: 200, stock: 30 },
    { name: "Biscuits", price: 150, stock: 25 },
    { name: "Water", price: 100, stock: 100 },
    { name: "Meat Pie", price: 400, stock: 15 },
    { name: "Juice", price: 250, stock: 40 },
  ]

  const locations = [
    "Mary Hall Buttery",
    "CST Hall Buttery",
    "Paul Hall Buttery",
    "Engineering Buttery",
    "Medical Buttery",
  ]

  useEffect(() => {
    // Load recent sales from localStorage
    const savedSales = localStorage.getItem("recentSales")
    if (savedSales) {
      setRecentSales(JSON.parse(savedSales))
    }
  }, [])

  const addToSale = () => {
    if (!selectedProduct || quantity <= 0) return

    const product = products.find((p) => p.name === selectedProduct)
    if (!product) return

    const newItem: SaleItem = {
      id: Date.now().toString(),
      product: selectedProduct,
      quantity,
      price: product.price,
      total: product.price * quantity,
    }

    setCurrentSale([...currentSale, newItem])
    setSelectedProduct("")
    setQuantity(1)
  }

  const removeFromSale = (id: string) => {
    setCurrentSale(currentSale.filter((item) => item.id !== id))
  }

  const getTotalAmount = () => {
    return currentSale.reduce((sum, item) => sum + item.total, 0)
  }

  const completeSale = () => {
    if (currentSale.length === 0 || !paymentMethod || !location) return

    const newSale: Sale = {
      id: Date.now().toString(),
      items: currentSale,
      total: getTotalAmount(),
      paymentMethod,
      location,
      date: new Date().toLocaleString(),
      vendor: "Current User", // In real app, get from auth
    }

    const updatedSales = [newSale, ...recentSales.slice(0, 9)]
    setRecentSales(updatedSales)
    localStorage.setItem("recentSales", JSON.stringify(updatedSales))

    // Reset form
    setCurrentSale([])
    setPaymentMethod("")
    setLocation("")

    alert("Sale completed successfully!")
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
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Sales Management</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* New Sale Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Record New Sale</CardTitle>
                <CardDescription>Add products to create a new sale transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.name} value={product.name}>
                            {product.name} - ₦{product.price} ({product.stock} in stock)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
                <Button onClick={addToSale} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Sale
                </Button>
              </CardContent>
            </Card>

            {/* Sale Details */}
            <Card>
              <CardHeader>
                <CardTitle>Sale Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="pos">POS</SelectItem>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select buttery location" />
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
              </CardContent>
            </Card>
          </div>

          {/* Current Sale */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Sale</CardTitle>
                <CardDescription>Items in current transaction</CardDescription>
              </CardHeader>
              <CardContent>
                {currentSale.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No items added yet</p>
                ) : (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentSale.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>₦{item.price}</TableCell>
                            <TableCell>₦{item.total}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => removeFromSale(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total Amount:</span>
                        <span>₦{getTotalAmount()}</span>
                      </div>
                    </div>

                    <Button onClick={completeSale} className="w-full" disabled={!paymentMethod || !location}>
                      Complete Sale
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Sales */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest sales transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSales.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent sales</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.location}</TableCell>
                      <TableCell>{sale.items.length} items</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sale.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">₦{sale.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
