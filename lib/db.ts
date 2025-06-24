import mysql from "mysql2/promise"
import type {
  DatabaseConfig,
  User,
  ButteryLocation,
  Product,
  Sales,
  UserWithLocation,
  ProductWithDetails,
  SaleWithDetails,
} from "./dbInterfaces"

const dbConfig: DatabaseConfig = {
  type: (process.env.DB_TYPE as any) || "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ButteryDB",
  url: process.env.DATABASE_URL,
}

// Log configuration for debugging (without password)
console.log("Database Configuration:", {
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  database: dbConfig.database,
  hasPassword: !!dbConfig.password,
})

let pool: mysql.Pool | null = null

export function getPool() {
  if (!pool) {
    try {
      // Validate required configuration
      if (!dbConfig.password) {
        console.error("❌ Database password is missing!")
        console.error("Please check your .env.local file and ensure DB_PASSWORD is set")
        throw new Error("Database password is required")
      }

      pool = mysql.createPool({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000,
      })
      console.log("✅ Database pool created successfully")
    } catch (error) {
      console.error("❌ Failed to create database pool:", error)
      throw error
    }
  }
  return pool
}

export async function testConnection() {
  try {
    console.log("🔍 Testing database connection...")
    const connection = await getPool().getConnection()
    await connection.ping()
    connection.release()
    console.log("✅ Database connection test successful")
    return true
  } catch (error) {
    console.error("❌ Database connection test failed:", error)
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
    console.log("📝 Executing query:", query.substring(0, 100) + "...")
    console.log("📋 Query params:", params)
    const [results] = await connection.execute(query, params)
    console.log("✅ Query executed successfully")
    return results
  } catch (error) {
    console.error("❌ Database query error:", error)
    console.error("Query:", query)
    console.error("Params:", params)
    throw error
  }
}

export async function executeTransaction(queries: { query: string; params: any[] }[]) {
  const connection = await getPool().getConnection()
  try {
    await connection.beginTransaction()
    console.log("🔄 Transaction started")

    const results = []
    for (const { query, params } of queries) {
      console.log("📝 Executing transaction query:", query.substring(0, 100) + "...")
      const [result] = await connection.execute(query, params)
      results.push(result)
    }

    await connection.commit()
    console.log("✅ Transaction committed successfully")
    return results
  } catch (error) {
    console.error("❌ Transaction error:", error)
    await connection.rollback()
    console.log("🔄 Transaction rolled back")
    throw error
  } finally {
    connection.release()
  }
}

// Mock data for fallback when database is not available
const mockUsers: User[] = [
  {
    UserID: "U001",
    First_Name: "Mercy",
    Last_Name: "Odediran",
    Email_Address: "mercy@example.com",
    Phone_Number: "08011112222",
    Role: "Admin",
  },
  {
    UserID: "U002",
    First_Name: "Jessica",
    Last_Name: "Ogbonna",
    Email_Address: "jessica@example.com",
    Phone_Number: "08033334444",
    Role: "Vendor",
  },
  {
    UserID: "U003",
    First_Name: "Emmanuel",
    Last_Name: "Ogundele",
    Email_Address: "emmanuel@example.com",
    Phone_Number: "08055556666",
    Role: "InventoryManager",
  },
]

// Database service class
export class DatabaseService {
  private static instance: DatabaseService
  private config: DatabaseConfig
  private useFallback = false

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
    try {
      return await testConnection()
    } catch (error) {
      console.log("🔄 Switching to fallback mode due to database connection issues")
      this.useFallback = true
      return false
    }
  }

  // User operations with fallback
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (this.useFallback || !(await this.isConnected())) {
        console.log("📦 Using fallback data for getUserByEmail")
        return mockUsers.find((user) => user.Email_Address === email) || null
      }

      const query = `SELECT * FROM User WHERE Email_Address = ?`
      const results = (await executeQuery(query, [email])) as User[]
      return results[0] || null
    } catch (error) {
      console.error("❌ Database query failed, using fallback:", error)
      this.useFallback = true
      return mockUsers.find((user) => user.Email_Address === email) || null
    }
  }

  async getUsers(): Promise<UserWithLocation[]> {
    try {
      if (this.useFallback || !(await this.isConnected())) {
        console.log("📦 Using fallback data for getUsers")
        return mockUsers.map((user) => ({
          ...user,
          Hall_Name: "Mock Hall",
          Floor: "Ground Floor",
        }))
      }

      const query = `
        SELECT 
          u.UserID,
          u.First_Name,
          u.Last_Name,
          u.Email_Address,
          u.Phone_Number,
          u.Role,
          b.Hall_Name,
          b.Floor
        FROM User u
        LEFT JOIN ButteryLocation b ON u.UserID = b.UserID
        ORDER BY u.First_Name, u.Last_Name
      `
      const results = (await executeQuery(query)) as UserWithLocation[]
      return results
    } catch (error) {
      console.error("❌ Database query failed, using fallback:", error)
      this.useFallback = true
      return mockUsers.map((user) => ({
        ...user,
        Hall_Name: "Mock Hall",
        Floor: "Ground Floor",
      }))
    }
  }

  async getUserById(id: string): Promise<UserWithLocation | null> {
    try {
      if (this.useFallback || !(await this.isConnected())) {
        console.log("📦 Using fallback data for getUserById")
        const user = mockUsers.find((user) => user.UserID === id)
        return user
          ? {
              ...user,
              Hall_Name: "Mock Hall",
              Floor: "Ground Floor",
            }
          : null
      }

      const query = `
        SELECT 
          u.UserID,
          u.First_Name,
          u.Last_Name,
          u.Email_Address,
          u.Phone_Number,
          u.Role,
          b.Hall_Name,
          b.Floor
        FROM User u
        LEFT JOIN ButteryLocation b ON u.UserID = b.UserID
        WHERE u.UserID = ?
      `
      const results = (await executeQuery(query, [id])) as UserWithLocation[]
      return results[0] || null
    } catch (error) {
      console.error("❌ Database query failed, using fallback:", error)
      this.useFallback = true
      const user = mockUsers.find((user) => user.UserID === id)
      return user
        ? {
            ...user,
            Hall_Name: "Mock Hall",
            Floor: "Ground Floor",
          }
        : null
    }
  }

  async createUser(userData: Omit<User, "UserID">): Promise<User> {
    // Generate new UserID
    const lastUserQuery = `SELECT UserID FROM User ORDER BY UserID DESC LIMIT 1`
    const lastUsers = (await executeQuery(lastUserQuery)) as User[]
    const lastId = lastUsers[0]?.UserID || "U000"
    const newIdNumber = Number.parseInt(lastId.substring(1)) + 1
    const newUserID = `U${newIdNumber.toString().padStart(3, "0")}`

    const insertQuery = `
      INSERT INTO User (UserID, First_Name, Last_Name, Email_Address, Phone_Number, Role)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    await executeQuery(insertQuery, [
      newUserID,
      userData.First_Name,
      userData.Last_Name,
      userData.Email_Address,
      userData.Phone_Number,
      userData.Role,
    ])

    return { UserID: newUserID, ...userData }
  }

  // Product operations
  async getProducts(): Promise<ProductWithDetails[]> {
    const query = `
      SELECT 
        p.ProductID,
        p.Product_Name,
        p.Category,
        p.Unit_Price,
        bl.Hall_Name,
        bl.Floor,
        COALESCE(stock.Stock_Quantity, 0) as Stock_Quantity
      FROM Product p
      LEFT JOIN Product_Location pl ON p.ProductID = pl.ProductID
      LEFT JOIN ButteryLocation bl ON pl.LocationID = bl.LocationID
      LEFT JOIN (
        SELECT 
          pt.ProductID,
          SUM(CASE WHEN it.Transaction_Type = 'IN' THEN it.Quantity ELSE -it.Quantity END) as Stock_Quantity
        FROM ProductTransaction pt
        JOIN InventoryTransaction it ON pt.TransactionID = it.TransactionID
        GROUP BY pt.ProductID
      ) stock ON p.ProductID = stock.ProductID
      ORDER BY p.Product_Name
    `
    const results = (await executeQuery(query)) as ProductWithDetails[]
    return results
  }

  async getProductById(id: string): Promise<ProductWithDetails | null> {
    const query = `
      SELECT 
        p.ProductID,
        p.Product_Name,
        p.Category,
        p.Unit_Price,
        bl.Hall_Name,
        bl.Floor,
        COALESCE(stock.Stock_Quantity, 0) as Stock_Quantity
      FROM Product p
      LEFT JOIN Product_Location pl ON p.ProductID = pl.ProductID
      LEFT JOIN ButteryLocation bl ON pl.LocationID = bl.LocationID
      LEFT JOIN (
        SELECT 
          pt.ProductID,
          SUM(CASE WHEN it.Transaction_Type = 'IN' THEN it.Quantity ELSE -it.Quantity END) as Stock_Quantity
        FROM ProductTransaction pt
        JOIN InventoryTransaction it ON pt.TransactionID = it.TransactionID
        GROUP BY pt.ProductID
      ) stock ON p.ProductID = stock.ProductID
      WHERE p.ProductID = ?
    `
    const results = (await executeQuery(query, [id])) as ProductWithDetails[]
    return results[0] || null
  }

  async createProduct(productData: Omit<Product, "ProductID">): Promise<Product> {
    // Generate new ProductID
    const lastProductQuery = `SELECT ProductID FROM Product ORDER BY ProductID DESC LIMIT 1`
    const lastProducts = (await executeQuery(lastProductQuery)) as Product[]
    const lastId = lastProducts[0]?.ProductID || "P000"
    const newIdNumber = Number.parseInt(lastId.substring(1)) + 1
    const newProductID = `P${newIdNumber.toString().padStart(3, "0")}`

    const insertQuery = `
      INSERT INTO Product (ProductID, Product_Name, Category, Unit_Price)
      VALUES (?, ?, ?, ?)
    `
    await executeQuery(insertQuery, [
      newProductID,
      productData.Product_Name,
      productData.Category,
      productData.Unit_Price,
    ])

    return { ProductID: newProductID, ...productData }
  }

  // Sales operations
  async getSales(limit = 50, offset = 0): Promise<SaleWithDetails[]> {
    const query = `
      SELECT 
        s.SaleID,
        s.Date,
        s.Total_Amount,
        s.Payment_Method,
        s.UserID,
        CONCAT(u.First_Name, ' ', u.Last_Name) as Vendor_Name
      FROM Sales s
      JOIN User u ON s.UserID = u.UserID
      ORDER BY s.Date DESC, s.SaleID DESC
      LIMIT ? OFFSET ?
    `
    const results = (await executeQuery(query, [limit, offset])) as SaleWithDetails[]

    // Get sale items for each sale
    for (const sale of results) {
      const itemsQuery = `
        SELECT 
          si.SaleID,
          si.ProductID,
          si.Quantity_Sold,
          p.Product_Name,
          p.Unit_Price,
          (si.Quantity_Sold * p.Unit_Price) as Subtotal
        FROM SaleItem si
        JOIN Product p ON si.ProductID = p.ProductID
        WHERE si.SaleID = ?
      `
      const items = (await executeQuery(itemsQuery, [sale.SaleID])) as any[]
      sale.Items = items
    }

    return results
  }

  async createSale(
    saleData: {
      items: { ProductID: string; Quantity_Sold: number }[]
      Payment_Method: string
      Total_Amount: number
    },
    userID: string,
  ): Promise<Sales> {
    // Generate new SaleID
    const lastSaleQuery = `SELECT SaleID FROM Sales ORDER BY SaleID DESC LIMIT 1`
    const lastSales = (await executeQuery(lastSaleQuery)) as Sales[]
    const lastId = lastSales[0]?.SaleID || "S000"
    const newIdNumber = Number.parseInt(lastId.substring(1)) + 1
    const newSaleID = `S${newIdNumber.toString().padStart(3, "0")}`

    const queries = []

    // Insert sale
    queries.push({
      query: `
        INSERT INTO Sales (SaleID, Date, Total_Amount, Payment_Method, UserID)
        VALUES (?, CURDATE(), ?, ?, ?)
      `,
      params: [newSaleID, saleData.Total_Amount, saleData.Payment_Method, userID],
    })

    // Insert sale items
    for (const item of saleData.items) {
      queries.push({
        query: `
          INSERT INTO SaleItem (SaleID, ProductID, Quantity_Sold)
          VALUES (?, ?, ?)
        `,
        params: [newSaleID, item.ProductID, item.Quantity_Sold],
      })
    }

    await executeTransaction(queries)

    return {
      SaleID: newSaleID,
      Date: new Date().toISOString().split("T")[0],
      Total_Amount: saleData.Total_Amount,
      Payment_Method: saleData.Payment_Method,
      UserID: userID,
    }
  }

  // Location operations
  async getLocations(): Promise<ButteryLocation[]> {
    const query = `
      SELECT 
        bl.LocationID,
        bl.Hall_Name,
        bl.Floor,
        bl.UserID,
        CONCAT(u.First_Name, ' ', u.Last_Name) as Manager_Name
      FROM ButteryLocation bl
      LEFT JOIN User u ON bl.UserID = u.UserID
      ORDER BY bl.Hall_Name
    `
    const results = (await executeQuery(query)) as any[]
    return results
  }

  // Category operations (derived from products)
  async getCategories(): Promise<{ name: string; count: number }[]> {
    const query = `
      SELECT 
        Category as name,
        COUNT(*) as count
      FROM Product
      GROUP BY Category
      ORDER BY Category
    `
    const results = (await executeQuery(query)) as any[]
    return results
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<any> {
    try {
      if (this.useFallback || !(await this.isConnected())) {
        console.log("📦 Using fallback data for dashboard stats")
        return {
          totalSales: 1950.0,
          totalProducts: 5,
          lowStockProducts: 2,
          totalUsers: 7,
          recentSales: [
            {
              SaleID: "S001",
              Date: "2025-06-24",
              Total_Amount: 500.0,
              Payment_Method: "Cash",
              Vendor_Name: "Jessica Ogbonna",
            },
          ],
          topProducts: [
            {
              Product_Name: "Coke Bottle",
              total_sold: 2,
              total_revenue: 300.0,
            },
          ],
        }
      }

      // Total sales today
      const todaySalesQuery = `
        SELECT COALESCE(SUM(Total_Amount), 0) as total_sales
        FROM Sales 
        WHERE Date = CURDATE()
      `
      const todaySales = (await executeQuery(todaySalesQuery)) as any[]

      // Total products
      const productsQuery = `SELECT COUNT(*) as total_products FROM Product`
      const products = (await executeQuery(productsQuery)) as any[]

      // Low stock products (assuming threshold of 10)
      const lowStockQuery = `
        SELECT COUNT(*) as low_stock_count
        FROM (
          SELECT 
            pt.ProductID,
            SUM(CASE WHEN it.Transaction_Type = 'IN' THEN it.Quantity ELSE -it.Quantity END) as stock
          FROM ProductTransaction pt
          JOIN InventoryTransaction it ON pt.TransactionID = it.TransactionID
          GROUP BY pt.ProductID
          HAVING stock <= 10
        ) low_stock
      `
      const lowStock = (await executeQuery(lowStockQuery)) as any[]

      // Total users
      const usersQuery = `SELECT COUNT(*) as total_users FROM User`
      const users = (await executeQuery(usersQuery)) as any[]

      // Recent sales
      const recentSalesQuery = `
        SELECT 
          s.SaleID,
          s.Date,
          s.Total_Amount,
          s.Payment_Method,
          CONCAT(u.First_Name, ' ', u.Last_Name) as Vendor_Name
        FROM Sales s
        JOIN User u ON s.UserID = u.UserID
        ORDER BY s.Date DESC, s.SaleID DESC
        LIMIT 5
      `
      const recentSales = (await executeQuery(recentSalesQuery)) as any[]

      // Top products
      const topProductsQuery = `
        SELECT 
          p.Product_Name,
          SUM(si.Quantity_Sold) as total_sold,
          SUM(si.Quantity_Sold * p.Unit_Price) as total_revenue
        FROM SaleItem si
        JOIN Product p ON si.ProductID = p.ProductID
        GROUP BY p.ProductID, p.Product_Name
        ORDER BY total_sold DESC
        LIMIT 5
      `
      const topProducts = (await executeQuery(topProductsQuery)) as any[]

      return {
        totalSales: todaySales[0]?.total_sales || 0,
        totalProducts: products[0]?.total_products || 0,
        lowStockProducts: lowStock[0]?.low_stock_count || 0,
        totalUsers: users[0]?.total_users || 0,
        recentSales,
        topProducts,
      }
    } catch (error) {
      console.error("❌ Dashboard stats query failed, using fallback:", error)
      this.useFallback = true
      return {
        totalSales: 1950.0,
        totalProducts: 5,
        lowStockProducts: 2,
        totalUsers: 7,
        recentSales: [],
        topProducts: [],
      }
    }
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance()
