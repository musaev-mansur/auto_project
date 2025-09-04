'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchCars, setFilters, clearFilters } from '@/store/slices/carsSlice'
import { fetchParts } from '@/store/slices/partsSlice'
import { Header } from '@/components/header'
import { CarFilters } from '@/components/car-filters'
import { CarCard } from '@/components/car-card'
import { PartCard } from '@/components/part-card'
import { Button } from '@/components/ui/button'
import { ArrowRight, RefreshCw, Car, Package, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/footer'
import { Car as CarType, Part as PartType } from '@/types/types'
import { useLocale } from '@/contexts/locale-context'

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
    body_type: carData.body_type as CarType['body_type'],
    color: carData.color,
    power: carData.power,
    engine_volume: carData.engine_volume,
    euro_standard: carData.euro_standard,
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
    created_at: carData.created_at,
    updated_at: carData.updated_at,
    views: carData.views,
    admin: carData.admin
  }
}

// Функция для преобразования данных из API в формат Part
function transformPartFromAPI(partData: any): PartType {
  return {
    id: partData.id,
    name: partData.name,
    brand: partData.brand,
    model: partData.model,
    year_from: partData.year_from,
    year_to: partData.year_to,
    category: partData.category,
    condition: partData.condition as PartType['condition'],
    price: partData.price,
    currency: partData.currency as PartType['currency'],
    negotiable: partData.negotiable,
    city: partData.city,
    description: partData.description,
    photos: typeof partData.photos === 'string' ? JSON.parse(partData.photos) : partData.photos,
    status: partData.status as PartType['status'],
    created_at: partData.created_at,
    updated_at: partData.updated_at,
    views: partData.views,
    admin: partData.admin
  }
}

export default function HomePage() {
  const [isClient, setIsClient] = useState(false)
  const { t } = useLocale()
  const dispatch = useAppDispatch()
  const { cars, loading, error } = useAppSelector(state => state.cars)
  const { parts, loading: partsLoading } = useAppSelector(state => state.parts)
  
  const [filteredCars, setFilteredCars] = useState<CarType[]>([])

  // Проверяем, что мы на клиенте
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    if (isClient) {
      dispatch(fetchCars({ status: 'published' }))
      dispatch(fetchParts({ status: 'published' }))
    }
  }, [dispatch, isClient])

  // Обновляем отфильтрованные автомобили при изменении данных
  useEffect(() => {
    setFilteredCars(cars)
  }, [cars])

  const handleRefresh = () => {
    dispatch(fetchCars({ status: 'published' }))
    dispatch(fetchParts({ status: 'published' }))
  }

  const handleFilterChange = (filters: any) => {
    dispatch(setFilters(filters))
    dispatch(fetchCars({ ...filters, status: 'published' }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    dispatch(fetchCars({ status: 'published' }))
  }

  // Показываем только опубликованные автомобили и запчасти
  const publishedCars = cars.filter((car: any) => car.status === 'published')
  const publishedParts = parts.filter((part: any) => part.status === 'published')
  
  // Отладочная информация
  console.log('🚗 Автомобили:', publishedCars)
  console.log('🔧 Запчасти:', publishedParts)
  if (publishedCars.length > 0) {
    console.log('📸 Первый автомобиль photos:', publishedCars[0].photos)
  }
  if (publishedParts.length > 0) {
    console.log('📸 Первая запчасть photos:', publishedParts[0].photos)
  }

  // Показываем загрузку пока не загрузимся на клиенте
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Link href="#cars" className="w-full sm:w-auto">
              <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                <Car className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">{t('hero.viewCars')}</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
            <Link href="#parts" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">{t('hero.viewParts')}</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Cars Section */}
        <section id="cars" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('cars.title')}
            </h2>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
          </div>

                      <CarFilters
              onFiltersChange={handleFilterChange}
            />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : publishedCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedCars.map((car: any) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('cars.noCars')}
              </h3>
              <p className="text-gray-600">
                {t('cars.noCarsDescription')}
              </p>
            </div>
          )}
        </section>

        {/* Parts Section */}
        <section id="parts" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('parts.title')}
            </h2>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={partsLoading}
            >
              <RefreshCw className={`h-4 w-4 ${partsLoading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
          </div>

          {partsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : publishedParts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedParts.map((part: any) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('parts.noParts')}
              </h3>
              <p className="text-gray-600">
                {t('parts.noPartsDescription')}
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
