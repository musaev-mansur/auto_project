'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Car, RefreshCw, Plus, ArrowLeft, Filter, X, Edit, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/contexts/auth-context'
import { useLocale } from '@/contexts/locale-context'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchCars, setFilters, clearFilters } from '@/store/slices/carsSlice'
import { getFuelText, getTransmissionText } from '@/lib/translations'

export default function CarsPage() {
  const [isClient, setIsClient] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Redux hooks
  const dispatch = useAppDispatch()
  const { cars, loading, error, filters } = useAppSelector(state => state.cars)

  // Используем useAuth и useLocale (с fallback значениями для SSR)
  const { isAuthenticated } = useAuth()
  const { t, locale } = useLocale()

  // Проверяем, что мы на клиенте
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    if (isClient) {
      dispatch(fetchCars({ status: 'published' }))
    }
  }, [dispatch, isClient])

  // Получаем уникальные значения для фильтров
  const getUniqueValues = (field: string): string[] => {
    const values: string[] = []
    cars.forEach((car: any) => {
      const value = car[field]
      if (typeof value === 'string' && !values.includes(value)) {
        values.push(value)
      }
    })
    return values.sort()
  }

  const handleRefresh = () => {
    dispatch(fetchCars({ status: 'published' }))
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    dispatch(setFilters(newFilters))
    dispatch(fetchCars({ ...newFilters, status: 'published' }))
  }

  const resetFilters = () => {
    dispatch(clearFilters())
    dispatch(fetchCars({ status: 'published' }))
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ' + currency
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Показываем загрузку пока не загрузимся на клиенте
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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
            <Button onClick={handleRefresh} variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
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
                      value={filters.brand || ''}
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
                        value={filters.price_from || ''}
                        onChange={(e) => handleFilterChange('price_from', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">{t('filters.to')} (EUR)</Label>
                      <Input
                        placeholder="100000"
                        type="number"
                        value={filters.price_to || ''}
                        onChange={(e) => handleFilterChange('price_to', e.target.value)}
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
                        value={filters.year_from || ''}
                        onChange={(e) => handleFilterChange('year_from', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">{t('filters.year')} {t('filters.to')}</Label>
                      <Input
                        placeholder="2024"
                        type="number"
                        value={filters.year_to || ''}
                        onChange={(e) => handleFilterChange('year_to', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm">{locale === 'ru' ? 'Коробка передач' : 'Transmission'}</Label>
                    <Select value={filters.transmission || 'all'} onValueChange={(value) => handleFilterChange('transmission', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder={locale === 'ru' ? 'Все' : 'All'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                                               {getUniqueValues('transmission').map((transmission: string) => (
                         <SelectItem key={transmission} value={transmission}>
                           {getTransmissionText(transmission, locale)}
                         </SelectItem>
                       ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm">{locale === 'ru' ? 'Топливо' : 'Fuel'}</Label>
                    <Select value={filters.fuel || 'all'} onValueChange={(value) => handleFilterChange('fuel', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder={locale === 'ru' ? 'Все' : 'All'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                                               {getUniqueValues('fuel').map((fuel: string) => (
                         <SelectItem key={fuel} value={fuel}>
                           {getFuelText(fuel, locale)}
                         </SelectItem>
                       ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm">{locale === 'ru' ? 'Город' : 'City'}</Label>
                    <Input
                      placeholder={locale === 'ru' ? 'Введите город' : 'Enter city'}
                      value={filters.city || ''}
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
            {cars.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      {t('cars.noCars')}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {t('cars.noCarsDescription')}
                    </p>
                    {isAuthenticated && (
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
                {cars.map((car: any) => (
                  <Card key={car.id} className="hover:shadow-lg transition-shadow h-full">
                    {/* Фото превью */}
                    <div className="relative h-48 sm:h-56">
                      <Image
                        src={car.photos?.[0] && typeof car.photos[0] === 'string' && car.photos[0].trim() !== '' ? car.photos[0] : '/placeholder.svg?height=200&width=300&query=car'}
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
                          <span>{car.engine_volume} {locale === 'ru' ? 'л' : 'L'}</span>
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
                          <span>{car.euro_standard}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{locale === 'ru' ? 'Владельцев:' : 'Owners:'}</span>
                          <span>{car.owners}</span>
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
              {locale === 'ru' ? `Показано: ${cars.length} автомобилей` : `Shown: ${cars.length} cars`}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
