import Link from 'next/link'
import Image from 'next/image'
import { Car } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Gauge, Fuel, Settings, Camera, Zap, Droplets } from 'lucide-react'
import { getFuelText, getTransmissionText } from '@/lib/translations'
import { useLocale } from '@/contexts/locale-context'

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  const { locale, t } = useLocale()
  
  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`
  }

  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString()} ${t('car.km')}`
  }



  return (
    <Link href={`/cars/${car.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative group">
          <Image
            src={car.photos?.[0] || '/placeholder.svg?height=200&width=300&query=car'}
            alt={`${car.brand} ${car.model}`}
            width={300}
            height={200}
            className="w-full h-40 sm:h-48 object-cover rounded-t-lg transition-transform group-hover:scale-105"
          />
          
          {/* Индикатор количества фото */}
          {car.photos && car.photos.length > 1 && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Camera className="h-3 w-3" />
              {car.photos.length}
            </div>
          )}
          
          {car.negotiable && (
            <Badge className="absolute top-2 right-2 bg-green-600 text-xs">
              {t('car.negotiable')}
            </Badge>
          )}
        </div>
        
        <CardContent className="p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2">
            {car.brand} {car.model} {car.generation}
          </h3>
          
          <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-3">
            {formatPrice(car.price, car.currency)}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">{car.year}</span>
            </div>
            <div className="flex items-center">
              <Gauge className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">{formatMileage(car.mileage)}</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">{car.power} {t('car.hp')}</span>
            </div>
            <div className="flex items-center">
              <Droplets className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">{car.engineVolume} {locale === 'ru' ? 'л' : 'L'}</span>
            </div>
            <div className="flex items-center">
              <Fuel className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">{getFuelText(car.fuel, locale)}</span>
            </div>
            <div className="flex items-center">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">{getTransmissionText(car.transmission, locale)}</span>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              {car.city}
            </div>
            <div className="text-xs text-gray-400">
              {locale === 'ru' ? 'Евро' : 'Euro'} {car.euroStandard}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
