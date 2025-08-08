'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ApiTestPage() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [newCar, setNewCar] = useState({
    brand: 'Toyota',
    model: 'Camry',
    year: 2021,
    mileage: 30000,
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'front',
    bodyType: 'sedan',
    color: 'Серебристый',
    power: 200,
    engineVolume: 2.5,
    euroStandard: 'Euro 6',
    vin: '',
    condition: 'excellent',
    customs: true,
    vat: true,
    owners: 1,
    price: 35000,
    currency: 'EUR',
    negotiable: true,
    city: 'Москва',
    description: 'Отличное состояние, полная комплектация'
  })

  // Тест получения автомобилей
  const testGetCars = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cars')
      const data = await response.json()
      setCars(data.cars || [])
      setMessage(`Получено ${data.cars?.length || 0} автомобилей`)
    } catch (error) {
      setMessage('Ошибка при получении автомобилей')
      console.error(error)
    }
    setLoading(false)
  }

  // Тест входа админа
  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com',
          password: 'admin123'
        })
      })
      const data = await response.json()
      setMessage(data.message || data.error || 'Тест входа завершен')
    } catch (error) {
      setMessage('Ошибка при входе')
      console.error(error)
    }
    setLoading(false)
  }

  // Тест получения админов
  const testGetAdmins = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admins')
      const data = await response.json()
      setMessage(`Получено ${data.admins?.length || 0} админов`)
    } catch (error) {
      setMessage('Ошибка при получении админов')
      console.error(error)
    }
    setLoading(false)
  }

  // Тест создания автомобиля
  const testCreateCar = async () => {
    setLoading(true)
    try {
      // Генерируем уникальный VIN если не указан
      const carData = {
        ...newCar,
        vin: newCar.vin || `TEST${Date.now()}`
      }

      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData)
      })
      const data = await response.json()
      
      if (response.ok) {
        setMessage(`Автомобиль успешно создан: ${data.car.brand} ${data.car.model}`)
        // Обновляем список автомобилей
        testGetCars()
      } else {
        setMessage(`Ошибка: ${data.error}`)
      }
    } catch (error) {
      setMessage('Ошибка при создании автомобиля')
      console.error(error)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Тестирование API</h1>
      
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <Card>
           <CardHeader>
             <CardTitle>Автомобили</CardTitle>
           </CardHeader>
           <CardContent>
             <Button 
               onClick={testGetCars} 
               disabled={loading}
               className="w-full"
             >
               {loading ? 'Загрузка...' : 'Получить автомобили'}
             </Button>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>Создать автомобиль</CardTitle>
           </CardHeader>
           <CardContent>
             <Button 
               onClick={testCreateCar} 
               disabled={loading}
               className="w-full"
             >
               {loading ? 'Создание...' : 'Создать автомобиль'}
             </Button>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>Аутентификация</CardTitle>
           </CardHeader>
           <CardContent>
             <Button 
               onClick={testLogin} 
               disabled={loading}
               className="w-full"
             >
               {loading ? 'Загрузка...' : 'Тест входа админа'}
             </Button>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>Админы</CardTitle>
           </CardHeader>
           <CardContent>
             <Button 
               onClick={testGetAdmins} 
               disabled={loading}
               className="w-full"
             >
               {loading ? 'Загрузка...' : 'Получить админов'}
             </Button>
           </CardContent>
         </Card>
       </div>

      {message && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Результат</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{message}</p>
          </CardContent>
        </Card>
      )}

      {cars.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Автомобили в базе данных</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cars.map((car) => (
                <div key={car.id} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{car.brand} {car.model}</h3>
                  <p className="text-sm text-gray-600">
                    Год: {car.year} | Пробег: {car.mileage} км | Цена: {car.price} {car.currency}
                  </p>
                  <p className="text-sm text-gray-600">
                    Статус: {car.status} | Просмотры: {car.views}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Доступные API endpoints:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Аутентификация</h3>
            <ul className="text-sm space-y-1">
              <li>POST /api/auth/register - Регистрация админа</li>
              <li>POST /api/auth/login - Вход админа</li>
            </ul>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Автомобили</h3>
            <ul className="text-sm space-y-1">
              <li>GET /api/cars - Получить все автомобили</li>
              <li>POST /api/cars - Создать автомобиль</li>
              <li>GET /api/cars/[id] - Получить автомобиль</li>
              <li>PUT /api/cars/[id] - Обновить автомобиль</li>
              <li>DELETE /api/cars/[id] - Удалить автомобиль</li>
            </ul>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Админы</h3>
            <ul className="text-sm space-y-1">
              <li>GET /api/admins - Получить всех админов</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
