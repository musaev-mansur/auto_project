'use client'

import { useState, useEffect } from 'react'
import { Car } from '@/types'

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

export default function TestCarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true)
      try {
        console.log('Testing cars fetch...')
        const response = await fetch('/api/cars?status=published')
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Raw API data:', data)
        
        const transformedCars = (data.cars || []).map(transformCarFromAPI)
        console.log('Transformed cars:', transformedCars)
        
        setCars(transformedCars)
        setError('')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(`Error loading cars: ${errorMessage}`)
        console.error('Fetch error:', err)
      }
      setLoading(false)
    }

    fetchCars()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Тестирование автомобилей</h1>
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Тестирование автомобилей</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Статистика:</h2>
        <p>Всего автомобилей: {cars.length}</p>
        <p>Опубликованных: {cars.filter(car => car.status === 'published').length}</p>
      </div>

      {cars.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>Внимание:</strong> Автомобили не найдены
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car.id} className="border p-4 rounded">
              <h3 className="font-bold">{car.brand} {car.model}</h3>
              <p>Год: {car.year}</p>
              <p>Цена: {car.price} {car.currency}</p>
              <p>Статус: {car.status}</p>
              <p>Пробег: {car.mileage} км</p>
              <p>Цвет: {car.color}</p>
              <p>Фото: {Array.isArray(car.photos) ? car.photos.length : 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
