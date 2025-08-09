'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { CarFilters } from '@/components/car-filters'
import { CarCard } from '@/components/car-card'
import { Button } from '@/components/ui/button'
import { ArrowRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/footer'
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

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCars = async () => {
    setLoading(true)
    try {
      console.log('Загружаем автомобили...')
      const response = await fetch('/api/cars?status=published')
      const data = await response.json()
      console.log('Данные из API:', data)
      
      const publishedCars = (data.cars || []).map(transformCarFromAPI)
      console.log('Преобразованные автомобили:', publishedCars)
      
      setCars(publishedCars)
      setFilteredCars(publishedCars)
    } catch (error) {
      console.error('Ошибка при загрузке автомобилей:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCars()
  }, [])

  const handleFiltersChange = (filters: any) => {
    let filtered = cars

    if (filters.brand && filters.brand !== 'all') {
      filtered = filtered.filter(car => car.brand.toLowerCase().includes(filters.brand.toLowerCase()))
    }

    if (filters.priceFrom) {
      filtered = filtered.filter(car => car.price >= parseInt(filters.priceFrom))
    }

    if (filters.priceTo) {
      filtered = filtered.filter(car => car.price <= parseInt(filters.priceTo))
    }

    if (filters.yearFrom) {
      filtered = filtered.filter(car => car.year >= parseInt(filters.yearFrom))
    }

    if (filters.yearTo) {
      filtered = filtered.filter(car => car.year <= parseInt(filters.yearTo))
    }

    setFilteredCars(filtered)
  }

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 md:py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
            Автомобили и запчасти
          </h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8 px-4">
            Качественные автомобили и оригинальные запчасти по лучшим ценам
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 w-full md:w-auto" asChild>
              <Link href="/cars">
                Смотреть автомобили
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 w-full md:w-auto">
              Каталог запчастей
            </Button>
          </div>
        </div>
      </section>

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Filters */}
          <CarFilters onFiltersChange={handleFiltersChange} />

          {/* New Arrivals */}
          <section className="mt-6 md:mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-bold">Новые поступления</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={fetchCars} variant="outline" disabled={loading} className="w-full sm:w-auto">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Обновить
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/cars">
                    Смотреть все
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48 md:h-64">
                <RefreshCw className="h-6 w-6 md:h-8 md:w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-sm md:text-base">Загрузка автомобилей...</span>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 mb-4">Автомобили не найдены</p>
                <Button onClick={fetchCars} variant="outline">
                  Попробовать снова
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredCars.slice(0, 8).map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
