'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Part } from '@/types/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Tag, MapPin, Eye, Phone, MessageCircle, Mail, Edit, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageGallery } from '@/components/image-gallery'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useAuth } from '@/contexts/auth-context'
import { useLocale } from '@/contexts/locale-context'
import { getConditionText, getCategoryText, getStatusText } from '@/lib/translations'

// API → Part
function transformPartFromAPI(partData: any): Part {
  return {
    id: partData.id,
    name: partData.name,
    brand: partData.brand,
    model: partData.model,
    year_from: partData.year_from,
    year_to: partData.year_to,
    category: partData.category,
    condition: partData.condition as Part['condition'],
    price: parseFloat(partData.price), // Преобразуем строку в число
    currency: partData.currency as Part['currency'],
    negotiable: partData.negotiable,
    city: partData.city,
    description: partData.description,
    photos: partData.photos || [], // Уже массив строк
    status: partData.status as Part['status'],
    views: partData.views,
    created_at: partData.created_at,
    updated_at: partData.updated_at || partData.created_at, // Если updated_at нет, используем created_at
    admin: {
      id: 0, // В API нет admin.id
      email: '', // В API нет admin.email
      first_name: partData.admin_name || 'Admin',
      last_name: '',
      role: 'admin',
      date_joined: partData.created_at
    }
  }
}

export default function PartDetailPage() {
  const params = useParams()
  const [isClient, setIsClient] = useState(false)
  const [part, setPart] = useState<Part | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Используем useAuth и useLocale (с fallback значениями для SSR)
  const { isAuthenticated } = useAuth()
  const { t, locale } = useLocale()

  // Проверяем, что мы на клиенте
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const fetchPart = async () => {
      if (!params.id) return
      setLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/${params.id}/`, {
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error(response.status === 404 ? (locale === 'ru' ? 'Запчасть не найдена' : 'Part not found') : `${locale === 'ru' ? 'Ошибка' : 'Error'}: ${response.status}`)
        }
        const data = await response.json()
        setPart(transformPartFromAPI(data))
        setError('')
      } catch (err) {
        setError(err instanceof Error ? err.message : (locale === 'ru' ? 'Неизвестная ошибка' : 'Unknown error'))
      }
      setLoading(false)
    }
    fetchPart()
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

  // Показываем загрузку пока не загрузимся на клиенте
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (loading) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">{locale === 'ru' ? 'Загрузка...' : 'Loading...'}</span>
      </div>
    </div>
  )
  
  if (error || !part) return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="text-red-500">{error || (locale === 'ru' ? 'Запчасть не найдена' : 'Part not found')}</div>
      <Button asChild className="mt-4">
        <Link href="/parts">{t('partDetail.backToList')}</Link>
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
            <Link href="/parts">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
              {t('partDetail.backToList')}
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Фото */}
            <div className="lg:col-span-2">
              <ImageGallery 
                images={(part.photos || []).filter((photo: string) => photo && typeof photo === 'string' && photo.trim() !== '')} 
                alt={`${part.name}`}
                className="w-full"
              />
            </div>

            {/* Инфо */}
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl leading-tight">
                      {part.name}
                    </CardTitle>
                    {part.negotiable && <Badge className="bg-green-600 text-xs flex-shrink-0">{t('part.negotiable')}</Badge>}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {formatPrice(part.price, part.currency)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                      {part.brand} {part.model}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                      {part.year_from && part.year_to ? `${part.year_from}-${part.year_to}` : 'N/A'}
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                      {getCategoryText(part.category, locale)}
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                      {getConditionText(part.condition, locale)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                      {part.city}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
                      {part.views} {t('part.views')}
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">{t('partDetail.characteristics')}</h4>
                    <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span>{t('partDetail.brand')}:</span>
                        <span>{part.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('partDetail.model')}:</span>
                        <span>{part.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('partDetail.category')}:</span>
                        <span>{getCategoryText(part.category, locale)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('partDetail.condition')}:</span>
                        <span>{getConditionText(part.condition, locale)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('partDetail.city')}:</span>
                        <span>{part.city}</span>
                      </div>
                      {(part.year_from || part.year_to) && (
                        <div className="flex justify-between">
                          <span>{t('partDetail.year')}:</span>
                          <span>
                            {part.year_from && part.year_to 
                              ? `${part.year_from} - ${part.year_to}`
                              : part.year_from 
                                ? `от ${part.year_from}`
                                : `до ${part.year_to}`
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Кнопки */}
              <div className="space-y-2 sm:space-y-3">
                {/* Кнопка редактирования для админов */}
                {isAuthenticated && (
                  <Button asChild className="w-full text-sm sm:text-base bg-orange-600 hover:bg-orange-700" size="sm">
                    <Link href={`/dealer/edit-part/${part.id}`}>
                      <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      {locale === 'ru' ? 'Редактировать' : 'Edit'}
                    </Link>
                  </Button>
                )}
                
                <Button className="w-full text-sm sm:text-base" size="sm" asChild>
                  <a href="tel:+32487250651">
                    <Phone className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
                    {t('part.call')}
                  </a>
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base" size="sm">
                  <MessageCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
                  <Link href="https://wa.me/+32487250651">{t('part.whatsapp')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Описание */}
        {part.description && (
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{t('partDetail.description')}</h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {part.description}
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
