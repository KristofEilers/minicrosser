"use client"

import { ReactNode } from "react"
import { useAuth } from "./auth-provider"
import { UserRole } from "@/lib/auth"

interface RoleGateProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
}

export function RoleGate({ children, allowedRoles, fallback }: RoleGateProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return fallback || (
      <div className="text-center py-8">
        <p className="text-gray-500">Sie müssen angemeldet sein, um auf diesen Bereich zuzugreifen.</p>
      </div>
    )
  }

  if (!allowedRoles.includes(user.role as UserRole)) {
    return fallback || (
      <div className="text-center py-8">
        <p className="text-gray-500">Sie haben nicht die erforderlichen Berechtigungen für diesen Bereich.</p>
        <p className="text-sm text-gray-400">Benötigte Rolle: {allowedRoles.join(', ')}</p>
      </div>
    )
  }

  return <>{children}</>
}