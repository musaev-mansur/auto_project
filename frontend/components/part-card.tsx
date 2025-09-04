'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import S3Image from '@/components/s3-image'
import { Camera, MapPin, Calendar, Tag, Package } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'

interface Part {
  id: string
  name: string
  brand: string
  model: string
  yearFrom?: number
  yearTo?: number
  category: string
  condition: string
  price: number
  currency: string
  negotiable: boolean
  city: string
  description: string
  photos: string[]
  status: string
  views: number
  createdAt: string
  admin: {
    id: string
    name: string
    email: string
  }
}

interface PartCardProps {
  part: Part
  viewMode?: 'grid' | 'list'
}

export function PartCard({ part, viewMode = 'grid' }: PartCardProps) {
  const { locale, t } = useLocale()
  
  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`
  }

  const getCategoryText = (category: string) => {
    const categories: { [key: string]: string } = {
      engine: locale === 'ru' ? 'Двигатель' : 'Engine',
      transmission: locale === 'ru' ? 'Трансмиссия' : 'Transmission',
      brakes: locale === 'ru' ? 'Тормоза' : 'Brakes',
      suspension: locale === 'ru' ? 'Подвеска' : 'Suspension',
      electrical: locale === 'ru' ? 'Электрика' : 'Electrical',
      body: locale === 'ru' ? 'Кузов' : 'Body',
      interior: locale === 'ru' ? 'Салон' : 'Interior',
      exterior: locale === 'ru' ? 'Внешний вид' : 'Exterior',
      wheels: locale === 'ru' ? 'Колеса' : 'Wheels',
      tires: locale === 'ru' ? 'Шины' : 'Tires',
      other: locale === 'ru' ? 'Другое' : 'Other'
    }
    return categories[category] || category
  }

  const getConditionText = (condition: string) => {
    const conditions: { [key: string]: string } = {
      new: locale === 'ru' ? 'Новое' : 'New',
      used: locale === 'ru' ? 'Б/у' : 'Used',
      refurbished: locale === 'ru' ? 'Восстановленное' : 'Refurbished'
    }
    return conditions[condition] || condition
  }

  return (
    <Link href={`/parts/${part.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative group">
          {part.photos?.[0] && typeof part.photos[0] === 'string' && part.photos[0].trim() !== '' ? (
            <S3Image
              src={part.photos[0]}
              alt={part.name}
              width={300}
              height={200}
              className="w-full h-40 sm:h-48 object-cover rounded-t-lg transition-transform group-hover:scale-105"
              fallback="/placeholder.svg?height=200&width=300&query=part"
            />
          ) : (
            <div className="w-full h-40 sm:h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Индикатор количества фото */}
          {part.photos && part.photos.length > 1 && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Camera className="h-3 w-3" />
              {part.photos.length}
            </div>
          )}
          
          {part.negotiable && (
            <Badge className="absolute top-2 right-2 bg-green-600 text-xs">
              {t('car.negotiable')}
            </Badge>
          )}
        </div>
        
        <CardContent className="p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2">
            {part.name}
          </h3>
          
          <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-3">
            {formatPrice(part.price, part.currency)}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">{getCategoryText(part.category)}</span>
            </div>
            <div className="flex items-center">
              <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">{getConditionText(part.condition)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">{part.brand} {part.model}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">
                {part.yearFrom && part.yearTo ? `${part.yearFrom}-${part.yearTo}` : 'Любой год'}
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              {part.city}
            </div>
            <div className="text-xs text-gray-400">
              {part.views} {t('car.views')}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
