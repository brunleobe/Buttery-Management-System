import mysql from "mysql2/promise"
import type { DatabaseConfig, User, Product, Sale, Location, Category } from "./dbInterfaces"

const dbConfig: DatabaseConfig = {
  type: (process.env.DB_TYPE as any) || "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "buttery_management",
  url: process.env.DATABASE_URL,
}

let pool: mysql.Pool | null = null

export function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })
      console.log("Database pool created successfully")
    } catch (error) {
      console.error("Failed to create database pool:", error)
      throw error
    }
  }
  return pool
}

export async function testConnection() {
  try {
    const connection = await getPool().getConnection()
    await connection.ping()
    connection.release()
    console.log("Database connection test successful")
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

export async function executeQuery(query: string, params: any[] = []) {
  try {
    // Test connection first
    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error("Database connection failed")
    }

    const connection = getPool()
    console.log("Executing query:", query.substring(0, 100) + "...")
    const [results] = await connection.execute(query, params)
    console.log("Query executed successfully")
    return results
  } catch (error) {
    console.error("Database query error:", error)
    console.error("Query:", query)
    console.error("Params:", params)
    throw error
  }
}

export async function executeTransaction(queries: { query: string; params: any[] }[]) {
  const connection = await getPool().getConnection()
  try {
    await connection.beginTransaction()
    console.log("Transaction started")

    const results = []
    for (const { query, params } of queries) {
      console.log("Executing transaction query:", query.substring(0, 100) + "...")
      const [result] = await connection.execute(query, params)
      results.push(result)
    }

    await connection.commit()
    console.log("Transaction committed successfully")
    return results
  } catch (error) {
    console.error("Transaction error:", error)
    await connection.rollback()
    console.log("Transaction rolled back")
    throw error
  } finally {
    connection.release()
  }
}

// Fallback to localStorage when database is not available
export function isDbAvailable() {
  return process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: 1,
    name: "System Administrator",
    email: "admin@buttery.com",
    phone: "+233100000000",
    role: "admin",
    location: "Mary Hall Buttery",
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "John Vendor",
    email: "vendor@buttery.com",
    phone: "+233100000001",
    role: "vendor",
    location: "Mary Hall Buttery",
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Jane Manager",
    email: "manager@buttery.com",
    phone: "+233100000002",
    role: "inventory_manager",
    location: "CST Hall Buttery",
    status: "active",
    created_at: new Date().toISOString(),
  },
]

const mockLocations: Location[] = [
  { id: 1, name: "Mary Hall Buttery", description: "Main buttery at Mary Hall" },
  { id: 2, name: "CST Hall Buttery", description: "Computer Science and Technology Hall buttery" },
  { id: 3, name: "Paul Hall Buttery", description: "Paul Hall residential buttery" },
  { id: 4, name: "Engineering Buttery", description: "Engineering faculty buttery" },
  { id: 5, name: "Medical Buttery", description: "Medical school buttery" },
]

const mockCategories: Category[] = [
  { id: 1, name: "Drinks", description: "Beverages and soft drinks" },
  { id: 2, name: "Pastry", description: "Baked goods and pastries" },
  { id: 3, name: "Snacks", description: "Light snacks and confectionery" },
  { id: 4, name: "Others", description: "Miscellaneous items" },
]

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Coca Cola",
    category_id: 1,
    price: 300.0,
    stock_quantity: 50,
    low_stock_threshold: 10,
    location_id: 1,
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Bread",
    category_id: 2,
    price: 200.0,
    stock_quantity: 30,
    low_stock_threshold: 10,
    location_id: 2,
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Biscuits",
    category_id: 3,
    price: 150.0,
    stock_quantity: 25,
    low_stock_threshold: 15,
    location_id: 3,
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Water",
    category_id: 1,
    price: 100.0,
    stock_quantity: 100,
    low_stock_threshold: 20,
    location_id: 1,
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Meat Pie",
    category_id: 2,
    price: 400.0,
    stock_quantity: 15,
    low_stock_threshold: 10,
    location_id: 4,
    status: "active",
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Juice",
    category_id: 1,
    price: 250.0,
    stock_quantity: 40,
    low_stock_threshold: 15,
    location_id: 2,
    status: "active",
    created_at: new Date().toISOString(),
  },
]

const mockSales: Sale[] = [
  {
    id: 1,
    total_amount: 750.0,
    payment_method: "cash",
    location_id: 1,
    vendor_id: 2,
    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    items: [
      { id: 1, sale_id: 1, product_id: 1, quantity: 2, unit_price: 300.0, total_price: 600.0 },
      { id: 2, sale_id: 1, product_id: 4, quantity: 1, unit_price: 100.0, total_price: 100.0 },
    ],
  },
  {
    id: 2,
    total_amount: 550.0,
    payment_method: "pos",
    location_id: 2,
    vendor_id: 3,
    created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    items: [
      { id: 3, sale_id: 2, product_id: 2, quantity: 1, unit_price: 200.0, total_price: 200.0 },
      { id: 4, sale_id: 2, product_id: 3, quantity: 2, unit_price: 150.0, total_price: 300.0 },
    ],
  },
]

// Database service class - replace with actual database implementation
export class DatabaseService {
  private static instance: DatabaseService
  private config: DatabaseConfig

  private constructor() {
    this.config = dbConfig
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  // Connection status
  async isConnected(): Promise<boolean> {
    // TODO: Implement actual database connection check
    console.log("Database config:", this.config)
    return false // Return false for now since we're using mock data
  }

  // User operations
  async getUsers(): Promise<User[]> {
    // TODO: Replace with actual database query
    return mockUsers
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // TODO: Replace with actual database query
    return mockUsers.find((user) => user.email === email) || null
  }

  async getUserById(id: number): Promise<User | null> {
    // TODO: Replace with actual database query
    return mockUsers.find((user) => user.id === id) || null
  }

  async createUser(userData: Omit<User, "id" | "created_at">): Promise<User> {
    // TODO: Replace with actual database query
    const newUser: User = {
      ...userData,
      id: Math.max(...mockUsers.map((u) => u.id)) + 1,
      created_at: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    return newUser
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    // TODO: Replace with actual database query
    return mockProducts
  }

  async getProductById(id: number): Promise<Product | null> {
    // TODO: Replace with actual database query
    return mockProducts.find((product) => product.id === id) || null
  }

  async createProduct(productData: Omit<Product, "id" | "created_at">): Promise<Product> {
    // TODO: Replace with actual database query
    const newProduct: Product = {
      ...productData,
      id: Math.max(...mockProducts.map((p) => p.id)) + 1,
      created_at: new Date().toISOString(),
    }
    mockProducts.push(newProduct)
    return newProduct
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    // TODO: Replace with actual database query
    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) return null

    mockProducts[index] = { ...mockProducts[index], ...updates }
    return mockProducts[index]
  }

  // Sales operations
  async getSales(): Promise<Sale[]> {
    // TODO: Replace with actual database query
    return mockSales
  }

  async createSale(saleData: Omit<Sale, "id" | "created_at">): Promise<Sale> {
    // TODO: Replace with actual database query
    const newSale: Sale = {
      ...saleData,
      id: Math.max(...mockSales.map((s) => s.id)) + 1,
      created_at: new Date().toISOString(),
    }
    mockSales.push(newSale)
    return newSale
  }

  // Location operations
  async getLocations(): Promise<Location[]> {
    // TODO: Replace with actual database query
    return mockLocations
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    // TODO: Replace with actual database query
    return mockCategories
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<any> {
    // TODO: Replace with actual database queries
    const totalSales = mockSales.reduce((sum, sale) => sum + sale.total_amount, 0)
    const totalProducts = mockProducts.length
    const lowStockProducts = mockProducts.filter((p) => p.stock_quantity <= p.low_stock_threshold).length
    const totalUsers = mockUsers.length

    return {
      totalSales,
      totalProducts,
      lowStockProducts,
      totalUsers,
      recentSales: mockSales.slice(-5),
      topProducts: mockProducts.slice(0, 5),
    }
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance()
