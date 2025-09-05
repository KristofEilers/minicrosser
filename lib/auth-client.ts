"use client"

import { useState, useEffect } from "react"
import type { Session, User } from "./auth"

// Mock authentication client for demonstration
const mockAuthClient = {
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      // Mock sign in - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: "1",
        email,
        name: email.split('@')[0],
        role: "dealer",
        companyName: "Demo Company",
        customerNumber: "DEMO-001",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const mockSession: Session = {
        id: "session-1",
        userId: mockUser.id,
        user: mockUser,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
      
      localStorage.setItem('mock-session', JSON.stringify(mockSession))
      window.location.href = '/dashboard'
      return mockSession
    }
  },
  
  signUp: {
    email: async (userData: any) => {
      // Mock sign up - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name,
        role: userData.role || "dealer",
        companyName: userData.companyName,
        customerNumber: userData.customerNumber,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // For demo, just redirect to login
      window.location.href = '/login'
      return mockUser
    }
  },
  
  signOut: async () => {
    localStorage.removeItem('mock-session')
    window.location.href = '/login'
  }
}

export const signIn = mockAuthClient.signIn
export const signUp = mockAuthClient.signUp
export const signOut = mockAuthClient.signOut

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [isPending, setIsPending] = useState(true)
  
  useEffect(() => {
    const mockSession = localStorage.getItem('mock-session')
    if (mockSession) {
      try {
        const parsedSession = JSON.parse(mockSession)
        if (new Date(parsedSession.expiresAt) > new Date()) {
          setSession(parsedSession)
        } else {
          localStorage.removeItem('mock-session')
        }
      } catch (error) {
        localStorage.removeItem('mock-session')
      }
    }
    setIsPending(false)
  }, [])
  
  return {
    data: session,
    isPending
  }
}

export async function getSession(): Promise<Session | null> {
  const mockSession = localStorage.getItem('mock-session')
  if (mockSession) {
    try {
      const parsedSession = JSON.parse(mockSession)
      if (new Date(parsedSession.expiresAt) > new Date()) {
        return parsedSession
      } else {
        localStorage.removeItem('mock-session')
      }
    } catch (error) {
      localStorage.removeItem('mock-session')
    }
  }
  return null
}

export const user = null
export const session = null

export type { Session, User }