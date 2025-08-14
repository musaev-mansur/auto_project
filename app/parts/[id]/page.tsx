'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ImageGallery } from '@/components/image-gallery'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  MapPin, 
  Calendar, 
  Eye, 
  MessageCircle, 
  Phone, 
  Tag, 
  Euro,
  Clock,
  User,
  Edit
} from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { getConditionText } from '@/lib/translations'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

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

export default function PartDetailPage() {
  const { isAuthenticated } = useAuth()
  const [part, setPart] = useState<Part | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const params = useParams()
  const { locale } = useLocale()

  useEffect(() => {
    fetchPart()
  }, [params.id])

  const fetchPart = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/parts/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setPart(data.part)
      } else {
        setError(data.error || 'Failed to fetch part')
      }
    } catch (error) {
      console.error('Error fetching part:', error)
      setError('Failed to fetch part')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: currency === 'EUR' ? 'EUR' : currency === 'USD' ? 'USD' : 'RUB'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      engine: '🔧',
      transmission: '⚙️',
      brakes: '🛑',
      suspension: '🔄',
      electrical: '⚡',
      body: '🚗',
      interior: '💺',
      exterior: '🎨',
      wheels: '🛞',
      tires: '🛞',
      other: '🔧'
    }
    return icons[category] || '🔧'
  }

  const getConditionColor = (condition: string) => {
    const colors: { [key: string]: string } = {
      new: 'bg-green-100 text-green-800',
      used: 'bg-yellow-100 text-yellow-800',
      refurbished: 'bg-blue-100 text-blue-800'
    }
    return colors[condition] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !part) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🔧</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {locale === 'ru' ? 'Запчасть не найдена' : 'Part not found'}
            </h1>
            <p className="text-gray-600 mb-4">
              {error || (locale === 'ru' ? 'Запрашиваемая запчасть не существует' : 'The requested part does not exist')}
            </p>
            <Button asChild>
              <a href="/parts">
                {locale === 'ru' ? 'Вернуться к списку' : 'Back to list'}
              </a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Хлебные крошки */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <a href="/" className="hover:text-blue-600">
                {locale === 'ru' ? 'Главная' : 'Home'}
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/parts" className="hover:text-blue-600">
                {locale === 'ru' ? 'Запчасти' : 'Parts'}
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-900">{part.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Галерея изображений */}
          <div>
            <ImageGallery images={part.photos && part.photos.length > 0 ? part.photos : []} alt={part.name} />
          </div>

          {/* Информация о запчасти */}
          <div className="space-y-6">
            {/* Заголовок и цена */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {part.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {part.brand} {part.model}
                {part.yearFrom && part.yearTo && (
                  <span className="ml-2">
                    ({part.yearFrom}-{part.yearTo})
                  </span>
                )}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(part.price, part.currency)}
                </div>
                {part.negotiable && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {locale === 'ru' ? 'Торг' : 'Negotiable'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Бейджи */}
            <div className="flex flex-wrap gap-2">
              <Badge className={getConditionColor(part.condition)}>
                {getConditionText(part.condition, locale)}
              </Badge>
              <Badge variant="outline">
                {getCategoryIcon(part.category)} {part.category}
              </Badge>
            </div>

            {/* Кнопки действий */}
            {isAuthenticated && (
              <Button asChild className="w-full text-sm sm:text-base bg-orange-600 hover:bg-orange-700" size="sm">
                <Link href={`/dealer/edit-part/${part.id}`}>
                  <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  {locale === 'ru' ? 'Редактировать' : 'Edit'}
                </Link>
              </Button>
            )}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-5 w-5 mr-2" />
                <a href={`https://wa.me/+32487250651?text=Здравствуйте! Интересует запчасть: ${part.name}`}>
                  {locale === 'ru' ? 'Написать в WhatsApp' : 'WhatsApp'}
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:+32487250651">
                  <Phone className="h-5 w-5 mr-2" />
                  {locale === 'ru' ? 'Позвонить' : 'Call'}
                </a>
              </Button>
            </div>

            <Separator />

            {/* Описание */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {locale === 'ru' ? 'Описание' : 'Description'}
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {part.description}
              </p>
            </div>

            <Separator />

            {/* Характеристики */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === 'ru' ? 'Характеристики' : 'Specifications'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{locale === 'ru' ? 'Бренд' : 'Brand'}</span>
                  <span className="font-medium">{part.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{locale === 'ru' ? 'Модель' : 'Model'}</span>
                  <span className="font-medium">{part.model}</span>
                </div>
                {part.yearFrom && part.yearTo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{locale === 'ru' ? 'Годы' : 'Years'}</span>
                    <span className="font-medium">{part.yearFrom} - {part.yearTo}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">{locale === 'ru' ? 'Категория' : 'Category'}</span>
                  <span className="font-medium">{getCategoryIcon(part.category)} {part.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{locale === 'ru' ? 'Состояние' : 'Condition'}</span>
                  <span className="font-medium">{getConditionText(part.condition, locale)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{locale === 'ru' ? 'Город' : 'City'}</span>
                  <span className="font-medium">{part.city}</span>
                </div>
              </CardContent>
            </Card>

            {/* Дополнительная информация */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(part.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{part.views} {locale === 'ru' ? 'просмотров' : 'views'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
