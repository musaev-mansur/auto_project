'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Car } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Gauge, Fuel, Settings, MapPin, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Функция для преобразования данных из API в формат Car
function transformCarFromAPI(carData: any): Car {
  return {
    id: carData.id,
    brand: carData.brand,
    model: carData.model,
    generation: carData.generation,
    year: carData.year,
    mileage: carData.mileage,
    transmission: carData.transmission as Car['transmission'],
    fuel: carData.fuel as Car['fuel'],
    drive: carData.drive as Car['drive'],
    bodyType: carData.bodyType as Car['bodyType'],
    color: carData.color,
    power: carData.power,
    engineVolume: carData.engineVolume,
    euroStandard: carData.euroStandard,
    vin: carData.vin,
    condition: carData.condition as Car['condition'],
    customs: carData.customs,
    vat: carData.vat,
    owners: carData.owners,
    price: carData.price,
    currency: carData.currency as Car['currency'],
    negotiable: carData.negotiable,
    city: carData.city,
    description: carData.description,
    photos: typeof carData.photos === 'string' ? JSON.parse(carData.photos) : carData.photos,
    status: carData.status as Car['status'],
    createdAt: carData.createdAt,
    views: carData.views,
    admin: carData.admin
  }
}

export default function CarDetailPage() {
  const params = useParams()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCar = async () => {
      if (!params.id) return
      
      setLoading(true)
      try {
        console.log('Fetching car with ID:', params.id)
        const response = await fetch(`/api/cars/${params.id}`)
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Автомобиль не найден')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Car data:', data)
        
        const transformedCar = transformCarFromAPI(data)
        setCar(transformedCar)
        setError('')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
        setError(`Ошибка при загрузке автомобиля: ${errorMessage}`)
        console.error('Fetch error:', err)
      }
      setLoading(false)
    }

    fetchCar()
  }, [params.id])

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ' + currency
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('ru-RU').format(mileage) + ' км'
  }

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'Отличное'
      case 'good': return 'Хорошее'
      case 'fair': return 'Удовлетворительное'
      case 'poor': return 'Плохое'
      default: return condition
    }
  }

  const getTransmissionText = (transmission: string) => {
    switch (transmission) {
      case 'automatic': return 'Автоматическая'
      case 'manual': return 'Механическая'
      case 'robot': return 'Робот'
      case 'variator': return 'Вариатор'
      default: return transmission
    }
  }

  const getFuelText = (fuel: string) => {
    switch (fuel) {
      case 'petrol': return 'Бензин'
      case 'diesel': return 'Дизель'
      case 'hybrid': return 'Гибрид'
      case 'electric': return 'Электро'
      case 'gas': return 'Газ'
      default: return fuel
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Загрузка автомобиля...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" asChild>
            <Link href="/cars">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку
            </Link>
          </Button>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Ошибка</h2>
              <p className="text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" asChild>
            <Link href="/cars">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Автомобиль не найден</h2>
              <p className="text-gray-500">Запрашиваемый автомобиль не существует или был удален</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link href="/cars">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к списку
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Фотографии */}
        <div>
          <Card>
            <CardContent className="p-0">
              <Image
                src={car.photos[0] || '/placeholder.svg?height=400&width=600&query=car'}
                alt={`${car.brand} ${car.model}`}
                width={600}
                height={400}
                className="w-full h-96 object-cover rounded-t-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Информация об автомобиле */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {car.brand} {car.model} {car.generation}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {car.city}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {car.views} просмотров
              </div>
            </div>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            {formatPrice(car.price, car.currency)}
            {car.negotiable && (
              <Badge className="ml-2 bg-green-600">Торг</Badge>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Основные характеристики</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">Год выпуска:</span>
                  <span className="ml-auto font-medium">{car.year}</span>
                </div>
                <div className="flex items-center">
                  <Gauge className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">Пробег:</span>
                  <span className="ml-auto font-medium">{formatMileage(car.mileage)}</span>
                </div>
                <div className="flex items-center">
                  <Fuel className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">Топливо:</span>
                  <span className="ml-auto font-medium">{getFuelText(car.fuel)}</span>
                </div>
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">Коробка:</span>
                  <span className="ml-auto font-medium">{getTransmissionText(car.transmission)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Цвет:</span>
                  <span className="ml-auto font-medium">{car.color}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Состояние:</span>
                  <span className="ml-auto font-medium">{getConditionText(car.condition)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Мощность:</span>
                  <span className="ml-auto font-medium">{car.power} л.с.</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Объем двигателя:</span>
                  <span className="ml-auto font-medium">{car.engineVolume} л</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Владельцев:</span>
                  <span className="ml-auto font-medium">{car.owners}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Привод:</span>
                  <span className="ml-auto font-medium">
                    {car.drive === 'front' ? 'Передний' : 
                     car.drive === 'rear' ? 'Задний' : 
                     car.drive === 'all' ? 'Полный' : car.drive}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Дополнительная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">VIN:</span>
                  <span className="font-mono text-sm">{car.vin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Евростандарт:</span>
                  <span>{car.euroStandard}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Растаможен:</span>
                  <span>{car.customs ? 'Да' : 'Нет'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">НДС:</span>
                  <span>{car.vat ? 'Да' : 'Нет'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {car.description && (
            <Card>
              <CardHeader>
                <CardTitle>Описание</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{car.description}</p>
              </CardContent>
            </Card>
          )}

          {car.admin && (
            <Card>
              <CardHeader>
                <CardTitle>Продавец</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{car.admin.name}</p>
                    <p className="text-sm text-gray-600">{car.admin.email}</p>
                  </div>
                  <Button variant="outline">Связаться</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
