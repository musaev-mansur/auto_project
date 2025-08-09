'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Car, RefreshCw, Plus, ArrowLeft, Filter, X, Edit } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Car as CarType } from '@/types'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/contexts/auth-context'
import { useLocale } from '@/contexts/locale-context'
import { getFuelText, getTransmissionText, getStatusText } from '@/lib/translations'

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
  const { isAuthenticated } = useAuth()
  const { t, locale } = useLocale()
  const [cars, setCars] = useState<CarType[]>([])
  const [filteredCars, setFilteredCars] = useState<CarType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    brand: '',
    priceFrom: '',
    priceTo: '',
    yearFrom: '',
    yearTo: '',
    transmission: 'all',
    fuel: 'all',
    status: 'all',
    city: ''
  })

  // Получаем уникальные значения для фильтров
  const getUniqueValues = (field: keyof CarType) => {
    const values = cars.map(car => car[field]).filter((value): value is string => typeof value === 'string')
    return [...new Set(values)].sort()
  }

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
      setFilteredCars(transformedCars)
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

  // Применяем фильтры
  useEffect(() => {
    let filtered = cars

    if (filters.brand) {
      filtered = filtered.filter(car => 
        car.brand.toLowerCase().includes(filters.brand.toLowerCase())
      )
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

    if (filters.transmission && filters.transmission !== 'all') {
      filtered = filtered.filter(car => car.transmission === filters.transmission)
    }

    if (filters.fuel && filters.fuel !== 'all') {
      filtered = filtered.filter(car => car.fuel === filters.fuel)
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(car => car.status === filters.status)
    }

    if (filters.city) {
      filtered = filtered.filter(car => 
        car.city.toLowerCase().includes(filters.city.toLowerCase())
      )
    }

    setFilteredCars(filtered)
  }, [cars, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      brand: '',
      priceFrom: '',
      priceTo: '',
      yearFrom: '',
      yearTo: '',
      transmission: 'all',
      fuel: 'all',
      status: 'all',
      city: ''
    })
  }

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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">{t('cars.loading')}</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
            <Link href="/">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Назад
            </Link>
          </Button>
          <div className="flex items-center gap-2 sm:gap-4">
            <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <h1 className="text-xl sm:text-3xl font-bold">{t('cars.title')}</h1>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button onClick={fetchCars} variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {t('home.refresh')}
          </Button>
                    <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm w-full sm:w-auto"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {t('filters.title')}
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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Фильтры */}
        {showFilters && (
          <div className="lg:w-80">
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">{t('filters.title')}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">{t('filters.brand')}</Label>
                  <Input
                    placeholder={t('filters.brandPlaceholder')}
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm">{t('filters.from')} (EUR)</Label>
                    <Input
                      placeholder="0"
                      type="number"
                      value={filters.priceFrom}
                      onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">{t('filters.to')} (EUR)</Label>
                    <Input
                      placeholder="100000"
                      type="number"
                      value={filters.priceTo}
                      onChange={(e) => handleFilterChange('priceTo', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm">{t('filters.year')} {t('filters.from')}</Label>
                    <Input
                      placeholder="2000"
                      type="number"
                      value={filters.yearFrom}
                      onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">{t('filters.year')} {t('filters.to')}</Label>
                    <Input
                      placeholder="2024"
                      type="number"
                      value={filters.yearTo}
                      onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm">{locale === 'ru' ? 'Коробка передач' : 'Transmission'}</Label>
                  <Select value={filters.transmission} onValueChange={(value) => handleFilterChange('transmission', value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder={locale === 'ru' ? 'Все' : 'All'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      {getUniqueValues('transmission').map(transmission => (
                        <SelectItem key={transmission} value={transmission}>
                          {getTransmissionText(transmission)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">{locale === 'ru' ? 'Топливо' : 'Fuel'}</Label>
                  <Select value={filters.fuel} onValueChange={(value) => handleFilterChange('fuel', value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder={locale === 'ru' ? 'Все' : 'All'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      {getUniqueValues('fuel').map(fuel => (
                        <SelectItem key={fuel} value={fuel}>
                          {getFuelText(fuel)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">{locale === 'ru' ? 'Статус' : 'Status'}</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder={locale === 'ru' ? 'Все' : 'All'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      {getUniqueValues('status').map(status => (
                        <SelectItem key={status} value={status}>
                          {status === 'published' ? 'Опубликован' : 
                           status === 'draft' ? 'Черновик' : 
                           status === 'sold' ? 'Продан' : status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">{locale === 'ru' ? 'Город' : 'City'}</Label>
                  <Input
                    placeholder={locale === 'ru' ? 'Введите город' : 'Enter city'}
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="text-sm"
                  />
                </div>

                <Button 
                  variant="outline" 
                  onClick={resetFilters} 
                  className="w-full text-sm"
                >
                  {t('filters.reset')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Список автомобилей */}
        <div className="flex-1">
          {filteredCars.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {cars.length === 0 ? t('cars.noCars') : (locale === 'ru' ? 'По фильтрам ничего не найдено' : 'No cars match the filters')}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {cars.length === 0 
                      ? t('cars.noCars')
                      : (locale === 'ru' ? 'Попробуйте изменить параметры фильтрации' : 'Try changing filter parameters')
                    }
                  </p>
                  {cars.length === 0 && (
                    <Button asChild>
                      <Link href="/dealer/add-car">
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить первый автомобиль
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCars.map((car) => (
                <Card key={car.id} className="hover:shadow-lg transition-shadow h-full">
                  {/* Фото превью */}
                  <div className="relative h-48 sm:h-56">
                    <Image
                      src={car.photos?.[0] || '/placeholder.svg?height=200&width=300&query=car'}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    {car.negotiable && <Badge className="absolute top-2 right-2 bg-green-600 text-xs">{t('car.negotiable')}</Badge>}
                    <Badge className={`absolute top-2 left-2 ${getStatusColor(car.status)} text-xs`}>
                      {car.status === 'published' ? 'Опубликован' : 
                       car.status === 'draft' ? 'Черновик' : 
                       car.status === 'sold' ? 'Продан' : car.status}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg line-clamp-2">
                      {car.brand} {car.model} {car.generation}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{car.year} {t('car.year')}</p>
                  </CardHeader>

                                     <CardContent className="pt-0">
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">{locale === 'ru' ? 'Цена:' : 'Price:'}</span>
                         <span className="font-semibold text-blue-600">{formatPrice(car.price, car.currency)}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">{locale === 'ru' ? 'Пробег:' : 'Mileage:'}</span>
                         <span>{new Intl.NumberFormat('ru-RU').format(car.mileage)} {t('car.km')}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">{locale === 'ru' ? 'Мощность:' : 'Power:'}</span>
                         <span>{car.power} {t('car.hp')}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">{locale === 'ru' ? 'Объем:' : 'Volume:'}</span>
                         <span>{car.engineVolume} {locale === 'ru' ? 'л' : 'L'}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">{locale === 'ru' ? 'Цвет:' : 'Color:'}</span>
                         <span>{car.color}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">{locale === 'ru' ? 'Коробка:' : 'Transmission:'}</span>
                         <span>{getTransmissionText(car.transmission, locale)}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">{locale === 'ru' ? 'Топливо:' : 'Fuel:'}</span>
                         <span>{getFuelText(car.fuel, locale)}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">{locale === 'ru' ? 'Евро:' : 'Euro:'}</span>
                         <span>{car.euroStandard}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">{locale === 'ru' ? 'Владельцев:' : 'Owners:'}</span>
                         <span>{car.owners}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-gray-600">{locale === 'ru' ? 'Просмотры:' : 'Views:'}</span>
                         <span>{car.views}</span>
                       </div>
                     </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 text-sm" asChild>
                          <Link href={`/cars/${car.id}`}>
                            {t('car.details')}
                          </Link>
                        </Button>
                        {isAuthenticated && (
                          <Button variant="outline" size="sm" className="text-xs" asChild>
                            <Link href={`/dealer/edit-car/${car.id}`}>
                              <Edit className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 sm:mt-8 text-center text-sm text-gray-500">
{locale === 'ru' ? `Показано: ${filteredCars.length} из ${cars.length} автомобилей` : `Shown: ${filteredCars.length} of ${cars.length} cars`}
          </div>
        </div>
      </div>
      </div>
      
      <Footer />
    </div>
  )
}
