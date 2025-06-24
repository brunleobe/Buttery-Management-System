import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request)

  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  return NextResponse.json({ user: auth.user })
}
