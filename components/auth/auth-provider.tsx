"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import type { Session, User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isPending) {
      setIsLoading(false)
    }
  }, [isPending])

  const value: AuthContextType = {
    user: session?.user || null,
    session: session || null,
    isLoading: isPending || isLoading,
    isAuthenticated: !!session?.user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}