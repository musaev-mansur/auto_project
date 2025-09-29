'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Grid, List, ArrowLeft, RefreshCw, Plus, X, Edit, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from '@/contexts/locale-context'
import { useAuth } from '@/contexts/auth-context'
import { getCategoryText, getConditionText, getUIText } from '@/lib/translations'

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

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

function PartsContent() {
  const [isClient, setIsClient] = useState(false)
  const [parts, setParts] = useState<Part[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCondition, setSelectedCondition] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedModel, setSelectedModel] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const searchParams = useSearchParams()
  const router = useRouter()
  const { locale, t } = useLocale()
  const { isAuthenticated } = useAuth()

  // Проверяем, что мы на клиенте
  useEffect(() => {
    setIsClient(true)
  }, [])

  const categories = [
    'engine',
    'transmission',
    'brakes',
    'suspension',
    'electrical',
    'body',
    'interior',
    'exterior',
    'wheels',
    'tires',
    'other'
  ]

  const conditions = ['new', 'used', 'refurbished']

  const brands = [
    'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Honda',
    'Ford', 'Opel', 'Peugeot', 'Renault', 'Citroen', 'Fiat',
    'Volvo', 'Saab', 'Skoda', 'Seat', 'Alfa Romeo', 'Lancia'
  ]

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    if (isClient) {
      fetchParts()
    }
  }, [isClient, searchParams])

  const fetchParts = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams(searchParams)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setParts(data.results || [])
        setPagination(data.pagination || {})
      } else {
        setError(data.error || 'Ошибка загрузки запчастей')
        console.error('Error fetching parts:', data.error)
      }
    } catch (error) {
      setError('Ошибка подключения к серверу')
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchParts()
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (selectedCondition !== 'all') params.set('condition', selectedCondition)
    if (selectedBrand !== 'all') params.set('brand', selectedBrand)
    if (selectedModel) params.set('model', selectedModel)
    if (sortBy) params.set('sort', sortBy)
    
    router.push(`/parts?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedCondition('all')
    setSelectedBrand('all')
    setSelectedModel('')
    setSortBy('newest')
    router.push('/parts')
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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/parts?${params.toString()}`)
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
            <span className="ml-2">{t('parts.loading')}</span>
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
                {t('parts.back')}
              </Link>
            </Button>
            <div className="flex items-center gap-2 sm:gap-4">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-xl sm:text-3xl font-bold">{t('parts.title')}</h1>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button onClick={handleRefresh} variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {t('parts.refresh')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {t('parts.filters')}
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
                    <CardTitle className="text-base sm:text-lg">{t('parts.filters')}</CardTitle>
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
                    <Label className="text-sm">{t('parts.search')}</Label>
                    <Input
                      placeholder={t('parts.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">{t('parts.category')}</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder={t('parts.allCategories')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('parts.allCategories')}</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {getCategoryText(category, locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm">{t('parts.condition')}</Label>
                    <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder={t('parts.allConditions')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('parts.allConditions')}</SelectItem>
                        {conditions.map(condition => (
                          <SelectItem key={condition} value={condition}>
                            {getConditionText(condition, locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm">{t('parts.brand')}</Label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder={t('parts.allBrands')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('parts.allBrands')}</SelectItem>
                        {brands.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm">{t('parts.model')}</Label>
                    <Input
                      placeholder={t('parts.modelPlaceholder')}
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={clearFilters} 
                    className="w-full text-sm"
                  >
                    {t('parts.clearFilters')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Список запчастей */}
          <div className="flex-1">
            {parts.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      {t('parts.noParts')}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {t('parts.noPartsDescription')}
                    </p>
                    {isAuthenticated && (
                      <Button asChild>
                        <Link href="/dealer/add-part">
                          <Plus className="h-4 w-4 mr-2" />
                          {t('parts.addFirst')}
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {parts.map((part: any) => (
                  <Card key={part.id} className="hover:shadow-lg transition-shadow h-full">
                    {/* Фото превью */}
                    <div className="relative h-48 sm:h-56">
                      <Image
                        src={part.photos?.[0] && typeof part.photos[0] === 'string' && part.photos[0].trim() !== '' ? part.photos[0] : '/placeholder.svg?height=200&width=300&query=part'}
                        alt={part.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      {part.negotiable && <Badge className="absolute top-2 right-2 bg-green-600 text-xs">{t('parts.negotiable')}</Badge>}
                      <Badge className={`absolute top-2 left-2 ${getStatusColor(part.status)} text-xs`}>
                        {part.status === 'published' ? t('parts.published') : 
                         part.status === 'draft' ? t('parts.draft') : 
                         part.status === 'sold' ? t('parts.sold') : part.status}
                      </Badge>
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg line-clamp-2">
                        {part.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{part.brand} {part.model}</p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t('parts.price')}:</span>
                          <span className="font-semibold text-blue-600">{formatPrice(part.price, part.currency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t('parts.category')}:</span>
                          <span>{getCategoryText(part.category, locale)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t('parts.condition')}:</span>
                          <span>{getConditionText(part.condition, locale)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t('partDetail.city')}:</span>
                          <span>{part.city}</span>
                        </div>
                      </div>
                     
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 text-sm" asChild>
                            <Link href={`/parts/${part.id}`}>
                              {t('parts.details')}
                            </Link>
                          </Button>
                          {isAuthenticated && (
                            <Button variant="outline" size="sm" className="text-xs" asChild>
                              <Link href={`/dealer/edit-part/${part.id}`}>
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
              {t('parts.showing')}: {parts.length} {t('parts.parts')}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function PartsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <PartsContent />
    </Suspense>
  )
}
