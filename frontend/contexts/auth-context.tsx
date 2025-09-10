'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Admin {
  id: number
  email: string
  first_name: string
  last_name: string
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

  // Проверяем, есть ли активная сессия при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Проверяем аутентификацию...')
        
        // Проверяем сессию на сервере
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        console.log('🔍 API URL:', apiUrl)
        console.log('🔍 Все env переменные:', process.env)
        
        if (!apiUrl) {
          console.error('❌ NEXT_PUBLIC_API_URL не определен!')
          return
        }
        
        const response = await fetch(`${apiUrl}/profile/`, {
          credentials: 'include'
        })
        
        console.log('📥 Статус проверки:', response.status)
        
        if (response.ok) {
          const userData = await response.json()
          console.log('✅ Найдена активная сессия:', userData)
          setAdmin(userData)
        } else {
          console.log('❌ Нет активной сессии')
        }
      } catch (error) {
        console.error('❌ Ошибка при проверке аутентификации:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Попытка входа с:', { email, password: '***' })
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${apiUrl}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Важно для Django сессий
        body: JSON.stringify({ email, password })
      })

      console.log('📥 Статус ответа:', response.status)
      console.log('📥 Заголовки:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('📥 Данные ответа:', data)

      if (response.ok) {
        console.log('✅ Успешный вход, устанавливаем админа:', data.user)
        setAdmin(data.user)
        return true
      } else {
        console.error('❌ Ошибка входа:', data.error)
        return false
      }
    } catch (error) {
      console.error('❌ Ошибка при входе:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      await fetch(`${apiUrl}/logout/`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    } finally {
      setAdmin(null)
    }
  }

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  }

  console.log('🔍 AuthContext состояние:', {
    admin,
    loading,
    isAuthenticated: !!admin
  })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Возвращаем fallback значения вместо выброса ошибки
    return {
      admin: null,
      loading: false,
      login: async () => false,
      logout: () => {},
      isAuthenticated: false
    }
  }
  return context
}
