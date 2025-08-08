'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Admin {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  admin: Admin | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  // Проверяем, есть ли сохраненная сессия при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем localStorage на наличие токена сессии
        const sessionToken = localStorage.getItem('admin_session')
        if (sessionToken) {
          // Здесь можно добавить проверку токена на сервере
          // Пока просто проверяем наличие токена
          const adminData = localStorage.getItem('admin_data')
          if (adminData) {
            setAdmin(JSON.parse(adminData))
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке аутентификации:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setAdmin(data.admin)
        // Сохраняем данные в localStorage
        localStorage.setItem('admin_session', 'true')
        localStorage.setItem('admin_data', JSON.stringify(data.admin))
        return true
      } else {
        console.error('Ошибка входа:', data.error)
        return false
      }
    } catch (error) {
      console.error('Ошибка при входе:', error)
      return false
    }
  }

  const logout = () => {
    setAdmin(null)
    // Очищаем данные из localStorage
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_data')
  }

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
