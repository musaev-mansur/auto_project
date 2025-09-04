'use client'

import Link from 'next/link'
import { Car, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export function DealerHeader() {
  const [isClient, setIsClient] = useState(false)

  // Используем useAuth (с fallback значениями для SSR)
  const { admin, logout } = useAuth()

  // Проверяем, что мы на клиенте
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = () => {
    logout()
  }

  // Показываем загрузку пока не загрузимся на клиенте
  if (!isClient) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/dealer" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Панель дилера</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {admin && (
              <span className="text-sm text-gray-600">
                Админ: {admin.first_name} {admin.last_name}
              </span>
            )}
            <Link 
              href="/" 
              className="text-gray-600 hover:text-blue-600 text-sm"
              target="_blank"
            >
              Посмотреть сайт
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
