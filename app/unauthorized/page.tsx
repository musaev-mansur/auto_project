'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Home, LogIn } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Доступ запрещен
          </h2>
          <p className="text-gray-600">
            Для доступа к этой странице требуется авторизация
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Требуется вход в систему</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Вы должны войти в систему как администратор для доступа к панели управления.
            </p>
            
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Войти в систему
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Вернуться на главную
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
