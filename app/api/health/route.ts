import { NextResponse } from "next/server"
import { testConnection, isDbAvailable } from "@/lib/db"
import { LocalStorage } from "@/lib/storage"

export async function GET() {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        configured: isDbAvailable(),
        connected: false,
        fallback: "localStorage",
      },
      environment: process.env.NODE_ENV || "development",
    }

    if (isDbAvailable()) {
      try {
        health.database.connected = await testConnection()
        if (!health.database.connected) {
          health.status = "degraded"
        }
      } catch (error) {
        health.database.connected = false
        health.status = "degraded"
      }
    } else {
      health.status = "degraded"
      health.database.fallback = "localStorage (database not configured)"
    }

    // Initialize localStorage data if needed
    if (typeof window !== "undefined") {
      LocalStorage.initializeDefaultData()
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
