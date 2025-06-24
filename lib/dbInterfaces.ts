export interface DatabaseConfig {
  type: "mysql" | "postgresql" | "sqlite" | "mongodb"
  host?: string
  port?: number
  username?: string
  password?: string
  database?: string
  url?: string
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  role: "vendor" | "inventory_manager" | "admin"
  location: string
  status: "active" | "inactive"
  created_at: string
}

export interface Location {
  id: number
  name: string
  description: string
}

export interface Category {
  id: number
  name: string
  description: string
}

export interface Product {
  id: number
  name: string
  category_id: number
  price: number
  stock_quantity: number
  low_stock_threshold: number
  location_id: number
  status: "active" | "inactive"
  created_at: string
}

export interface SaleItem {
  id: number
  sale_id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
}

export interface Sale {
  id: number
  total_amount: number
  payment_method: "cash" | "pos" | "transfer"
  location_id: number
  vendor_id: number
  created_at: string
  items: SaleItem[]
}

export interface InventoryTransaction {
  id: number
  product_id: number
  transaction_type: "in" | "out" | "adjustment"
  quantity: number
  reference_type: "sale" | "restock" | "damage" | "expiry" | "manual"
  reference_id?: number
  notes?: string
  created_at: string
}
