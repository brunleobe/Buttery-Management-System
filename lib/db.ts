import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "buttery_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
}

let pool: mysql.Pool | null = null

export function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool(dbConfig)
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
  const connection = getPool()
  try {
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
