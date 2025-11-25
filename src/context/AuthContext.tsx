"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi, type User } from "@/lib/api"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, isAdmin: boolean) => Promise<{ success: boolean; message: string }>
  register: (userData: {
    name: string
    email: string
    password: string
    phone: string
    address: string
  }) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("ecosmart_token")
      const savedUser = localStorage.getItem("ecosmart_user")

      if (savedToken && savedUser) {
        try {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))

          // Verify token is still valid
          const response = await authApi.getMe()
          if (response.success) {
            setUser(response.data)
            localStorage.setItem("ecosmart_user", JSON.stringify(response.data))
          }
        } catch {
          // Token invalid, clear storage
          localStorage.removeItem("ecosmart_token")
          localStorage.removeItem("ecosmart_user")
          setToken(null)
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string, isAdmin: boolean) => {
    try {
      const response = isAdmin ? await authApi.adminLogin(email, password) : await authApi.citizenLogin(email, password)

      if (response.success && response.data) {
        setToken(response.data.token)
        setUser(response.data.user)
        localStorage.setItem("ecosmart_token", response.data.token)
        localStorage.setItem("ecosmart_user", JSON.stringify(response.data.user))
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message || "Login failed" }
    } catch (error: any) {
      return { success: false, message: error.message || "Login failed" }
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    phone: string
    address: string
  }) => {
    try {
      const response = await authApi.register(userData)

      if (response.success && response.data) {
        setToken(response.data.token)
        setUser(response.data.user)
        localStorage.setItem("ecosmart_token", response.data.token)
        localStorage.setItem("ecosmart_user", JSON.stringify(response.data.user))
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message || "Registration failed" }
    } catch (error: any) {
      return { success: false, message: error.message || "Registration failed" }
    }
  }

  const logout = () => {
    authApi.logout()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
