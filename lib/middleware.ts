import type { NextRequest } from "next/server"
import { verifyToken, getUserById } from "./auth"

export async function authenticateRequest(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  if (!token) {
    return { error: "No token provided", status: 401 }
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return { error: "Invalid token", status: 401 }
  }

  const user = await getUserById(decoded.id)
  if (!user) {
    return { error: "User not found", status: 401 }
  }

  return { user }
}

export function requireRole(allowedRoles: string[]) {
  return (user: any) => {
    if (!allowedRoles.includes(user.role)) {
      return { error: "Insufficient permissions", status: 403 }
    }
    return null
  }
}
