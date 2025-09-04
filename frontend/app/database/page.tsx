'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, Users, Car, Settings } from 'lucide-react'
import Link from 'next/link'

export default function DatabasePage() {
  const [stats, setStats] = useState({
    cars: 0,
    admins: 0
  })

  const loadStats = async () => {
    try {
      const [carsResponse, adminsResponse] = await Promise.all([
            fetch('http://localhost:8000/api/cars/', {
      credentials: 'include'
    }),
          fetch('http://localhost:8000/api/admins/', {
        credentials: 'include'
      })
      ])
      
      const carsData = await carsResponse.json()
      const adminsData = await adminsResponse.json()
      
      setStats({
        cars: carsData.pagination?.total || 0,
        admins: adminsData.pagination?.total || 0
      })
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Database className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Управление базой данных</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Автомобили</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cars}</div>
            <p className="text-xs text-muted-foreground">
              в базе данных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Админы</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">
              пользователей
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Управление данными
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={loadStats} className="w-full">
              Обновить статистику
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/api-test">
                Тестировать API
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dealer">
                Панель дилера
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Информация о базе данных</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Технологии:</h4>
              <div className="space-y-2">
                <Badge variant="secondary">SQLite</Badge>
                <Badge variant="secondary">Prisma ORM</Badge>
                <Badge variant="secondary">Next.js 15</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Файл базы:</h4>
              <p className="text-sm text-muted-foreground">prisma/dev.db</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Аутентификация</h4>
              <div className="text-sm space-y-1">
                <p>Email:</p>
                <p>Пароль:</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Команды</h4>
              <div className="text-sm space-y-1">
                <p><code>npm run db:seed</code> - Заполнить тестовыми данными</p>
                <p><code>npx prisma studio</code> - Открыть Prisma Studio</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">API Endpoints</h4>
              <div className="text-sm space-y-1">
                <p>GET /api/cars - Автомобили</p>
                <p>POST /api/auth/login - Вход</p>
                <p>GET /api/admins - Админы</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
