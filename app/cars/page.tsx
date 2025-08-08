'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Car, RefreshCw, Plus } from 'lucide-react'
import Link from 'next/link'
import { Car as CarType } from '@/types'

// Функция для преобразования данных из API в формат Car
function transformCarFromAPI(carData: any): CarType {
  return {
    id: carData.id,
    brand: carData.brand,
    model: carData.model,
    generation: carData.generation,
    year: carData.year,
    mileage: carData.mileage,
    transmission: carData.transmission as CarType['transmission'],
    fuel: carData.fuel as CarType['fuel'],
    drive: carData.drive as CarType['drive'],
    bodyType: carData.bodyType as CarType['bodyType'],
    color: carData.color,
    power: carData.power,
    engineVolume: carData.engineVolume,
    euroStandard: carData.euroStandard,
    vin: carData.vin,
    condition: carData.condition as CarType['condition'],
    customs: carData.customs,
    vat: carData.vat,
    owners: carData.owners,
    price: carData.price,
    currency: carData.currency as CarType['currency'],
    negotiable: carData.negotiable,
    city: carData.city,
    description: carData.description,
    photos: typeof carData.photos === 'string' ? JSON.parse(carData.photos) : carData.photos,
    status: carData.status as CarType['status'],
    createdAt: carData.createdAt,
    views: carData.views,
    admin: carData.admin
  }
}

export default function CarsPage() {
  const [cars, setCars] = useState<CarType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCars = async () => {
    setLoading(true)
    try {
      console.log('Загружаем автомобили...')
      const response = await fetch('/api/cars')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Полученные данные:', data)
      
      const transformedCars = (data.cars || []).map(transformCarFromAPI)
      console.log('Преобразованные автомобили:', transformedCars)
      
      setCars(transformedCars)
      setError('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setError(`Ошибка при загрузке автомобилей: ${errorMessage}`)
      console.error('Ошибка fetchCars:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCars()
  }, [])

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ' + currency
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2">Загрузка автомобилей...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Car className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Автомобили</h1>
        </div>
                 <div className="flex gap-4">
           <Button onClick={fetchCars} variant="outline">
             <RefreshCw className="h-4 w-4 mr-2" />
             Обновить
           </Button>
           <Button asChild>
             <Link href="/dealer/add-car">
               <Plus className="h-4 w-4 mr-2" />
               Добавить автомобиль
             </Link>
           </Button>
           <Button asChild variant="outline">
             <Link href="/debug">
               Отладка
             </Link>
           </Button>
         </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {cars.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Автомобили не найдены
              </h3>
              <p className="text-gray-500 mb-4">
                В базе данных пока нет автомобилей
              </p>
              <Button asChild>
                <Link href="/dealer/add-car">
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить первый автомобиль
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {car.brand} {car.model}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{car.year} год</p>
                  </div>
                  <Badge className={getStatusColor(car.status)}>
                    {car.status === 'published' ? 'Опубликован' : 
                     car.status === 'draft' ? 'Черновик' : 
                     car.status === 'sold' ? 'Продан' : car.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Цена:</span>
                    <span className="font-semibold">{formatPrice(car.price, car.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Пробег:</span>
                    <span>{new Intl.NumberFormat('ru-RU').format(car.mileage)} км</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Цвет:</span>
                    <span>{car.color}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Трансмиссия:</span>
                    <span>{car.transmission === 'automatic' ? 'Автомат' : 'Механика'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Топливо:</span>
                    <span>{car.fuel === 'petrol' ? 'Бензин' : 
                           car.fuel === 'diesel' ? 'Дизель' : 
                           car.fuel === 'hybrid' ? 'Гибрид' : 
                           car.fuel === 'electric' ? 'Электро' : car.fuel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Просмотры:</span>
                    <span>{car.views}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Добавлен:</span>
                    <span>{formatDate(car.createdAt)}</span>
                  </div>
                  {car.admin && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Админ:</span>
                      <span>{car.admin.name}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/cars/${car.id}`}>
                      Подробнее
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        Всего автомобилей: {cars.length}
      </div>
    </div>
  )
}
