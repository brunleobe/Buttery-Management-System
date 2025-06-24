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
  UserID: string
  First_Name: string
  Last_Name: string
  Email_Address: string
  Phone_Number: string
  Role: "Admin" | "Vendor" | "InventoryManager"
}

export interface ButteryLocation {
  LocationID: string
  Hall_Name: string
  Floor: string
  UserID: string
}

export interface Product {
  ProductID: string
  Product_Name: string
  Category: string
  Unit_Price: number
}

export interface Sales {
  SaleID: string
  Date: string
  Total_Amount: number
  Payment_Method: string
  UserID: string
}

export interface SaleItem {
  SaleID: string
  ProductID: string
  Quantity_Sold: number
}

export interface InventoryTransaction {
  TransactionID: string
  Transaction_Type: "IN" | "OUT"
  Date: string
  Quantity: number
  UserID: string
}

export interface ProductTransaction {
  ProductID: string
  TransactionID: string
}

export interface ProductLocation {
  ProductID: string
  LocationID: string
}

// Extended interfaces for API responses
export interface UserWithLocation extends User {
  Hall_Name?: string
  Floor?: string
}

export interface ProductWithDetails extends Product {
  Hall_Name?: string
  Floor?: string
  Stock_Quantity?: number
}

export interface SaleWithDetails extends Sales {
  Vendor_Name?: string
  Items?: SaleItemWithProduct[]
}

export interface SaleItemWithProduct extends SaleItem {
  Product_Name?: string
  Unit_Price?: number
  Subtotal?: number
}
