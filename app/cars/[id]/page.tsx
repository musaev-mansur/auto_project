'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Car } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Gauge, Fuel, Settings, MapPin, Eye, Phone, MessageCircle, Mail, Edit } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageGallery } from '@/components/image-gallery'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/contexts/auth-context'
import { useLocale } from '@/contexts/locale-context'
import { getFuelText, getTransmissionText, getDriveText, getBodyTypeText, getConditionText } from '@/lib/translations'

// API → Car
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
    admin: carData.admin,
  }
}

export default function CarDetailPage() {
  const params = useParams()
  const { isAuthenticated } = useAuth()
  const { t, locale } = useLocale()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCar = async () => {
      if (!params.id) return
      setLoading(true)
      try {
        const response = await fetch(`/api/cars/${params.id}`)
        if (!response.ok) {
          throw new Error(response.status === 404 ? (locale === 'ru' ? 'Автомобиль не найден' : 'Car not found') : `${locale === 'ru' ? 'Ошибка' : 'Error'}: ${response.status}`)
        }
        const data = await response.json()
        setCar(transformCarFromAPI(data))
        setError('')
      } catch (err) {
        setError(err instanceof Error ? err.message : (locale === 'ru' ? 'Неизвестная ошибка' : 'Unknown error'))
      }
      setLoading(false)
    }
    fetchCar()
  }, [params.id])

  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat('ru-RU').format(price) + ' ' + currency



  const ContactForm = ({ type }: { type: 'question' | 'viewing' }) => (
    <div className="space-y-4">
      <Input placeholder={locale === 'ru' ? 'Ваше имя' : 'Your name'} />
      <Input placeholder={locale === 'ru' ? 'Телефон' : 'Phone'} />
      <Input placeholder={locale === 'ru' ? 'Email (необязательно)' : 'Email (optional)'} />
      <Textarea placeholder={type === 'question' ? (locale === 'ru' ? 'Ваш вопрос' : 'Your question') : (locale === 'ru' ? 'Удобное время для показа' : 'Convenient viewing time')} rows={3} />
      <Button className="w-full">{type === 'question' ? (locale === 'ru' ? 'Отправить вопрос' : 'Send question') : (locale === 'ru' ? 'Записаться на показ' : 'Schedule viewing')}</Button>
    </div>
  )

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">{locale === 'ru' ? 'Загрузка...' : 'Loading...'}</span>
      </div>
    </div>
  )
  
  if (error || !car) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="text-red-500">{error || (locale === 'ru' ? 'Автомобиль не найден' : 'Car not found')}</div>
      <Button asChild className="mt-4">
        <Link href="/cars">{t('carDetail.backToList')}</Link>
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
            <Link href="/cars">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
              {t('carDetail.backToList')}
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Фото */}
            <div className="lg:col-span-2">
              <ImageGallery 
                images={(car.photos || []).filter((photo: string) => photo && typeof photo === 'string' && photo.trim() !== '')} 
                alt={`${car.brand} ${car.model}`}
                className="w-full"
              />
            </div>

            {/* Инфо */}
            <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl leading-tight">
                  {car.brand} {car.model} {car.generation}
                </CardTitle>
                {car.negotiable && <Badge className="bg-green-600 text-xs flex-shrink-0">{t('car.negotiable')}</Badge>}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {formatPrice(car.price, car.currency)}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                  {car.year} год
                </div>
                <div className="flex items-center">
                  <Gauge className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                  {car.mileage.toLocaleString()} км
                </div>
                <div className="flex items-center">
                  <Fuel className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                  {getFuelText(car.fuel, locale)}
                </div>
                <div className="flex items-center">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                  {getTransmissionText(car.transmission, locale)}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                  {car.city}
                </div>
                <div className="flex items-center">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                  {car.views} {t('car.views')}
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">{t('carDetail.characteristics')}</h4>
                <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>{t('carDetail.power')}:</span>
                    <span>{car.power} {t('car.hp')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('carDetail.engineVolume')}:</span>
                    <span>{car.engineVolume} {locale === 'ru' ? 'л' : 'L'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('carDetail.drive')}:</span>
                    <span>{getDriveText(car.drive, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('carDetail.bodyType')}:</span>
                    <span>{getBodyTypeText(car.bodyType, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('carDetail.color')}:</span>
                    <span>{car.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('carDetail.euroStandard')}:</span>
                    <span>Евро {car.euroStandard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('carDetail.vin')}:</span>
                    <span className="font-mono text-xs">{car.vin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('carDetail.owners')}:</span>
                    <span>{car.owners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('carDetail.customs')}:</span>
                    <span>{car.customs ? t('carDetail.yes') : t('carDetail.no')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('carDetail.vat')}:</span>
                    <span>{car.vat ? t('carDetail.yes') : t('carDetail.no')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('carDetail.condition')}:</span>
                    <span>{getConditionText(car.condition, locale)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Кнопки */}
          <div className="space-y-2 sm:space-y-3">
            {/* Кнопка редактирования для админов */}
            {isAuthenticated && (
              <Button asChild className="w-full text-sm sm:text-base bg-orange-600 hover:bg-orange-700" size="sm">
                <Link href={`/dealer/edit-car/${car.id}`}>
                  <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  {locale === 'ru' ? 'Редактировать' : 'Edit'}
                </Link>
              </Button>
            )}
            
            <Button className="w-full text-sm sm:text-base" size="sm" asChild>
              <a href="tel:+32487250651">
                <Phone className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
                {t('car.call')}
              </a>
            </Button>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base" size="sm">
              <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
              <Link href="https://wa.me/+32487250651">{t('car.whatsapp')}</Link>
            </Button>

          </div>
            </div>
          </div>
        </div>

        {/* Описание */}
        {car.description && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t('carDetail.description')}</h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {car.description}
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
