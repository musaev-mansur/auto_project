'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PartCard } from '@/components/part-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Grid, List } from 'lucide-react'
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

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCondition, setSelectedCondition] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedModel, setSelectedModel] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const searchParams = useSearchParams()
  const router = useRouter()
  const { t } = useLocale()

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

  useEffect(() => {
    fetchParts()
  }, [searchParams])

  const fetchParts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams(searchParams)
      
      const response = await fetch(`/api/parts?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setParts(data.parts)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch parts:', data.error)
      }
    } catch (error) {
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory)
    if (selectedCondition && selectedCondition !== 'all') params.set('condition', selectedCondition)
    if (selectedBrand && selectedBrand !== 'all') params.set('brand', selectedBrand)
    if (selectedModel) params.set('model', selectedModel)
    if (sortBy) params.set('sort', sortBy)
    
    router.push(`/parts?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
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
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('parts.title')}
          </h1>
          <p className="text-gray-600">
            {t('parts.subtitle')}
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Поиск */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('parts.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Категория */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder={t('parts.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('parts.allCategories')}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {t(`parts.categories.${category}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Состояние */}
            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder={t('parts.allConditions')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('parts.allConditions')}</SelectItem>
                {conditions.map(condition => (
                  <SelectItem key={condition} value={condition}>
                    {t(`parts.conditions.${condition}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Сортировка */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('parts.sort.newest')}</SelectItem>
                <SelectItem value="oldest">{t('parts.sort.oldest')}</SelectItem>
                <SelectItem value="price_asc">{t('parts.sort.priceAsc')}</SelectItem>
                <SelectItem value="price_desc">{t('parts.sort.priceDesc')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Кнопки */}
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                {t('parts.search')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                {t('parts.filters')}
              </Button>
            </div>
          </div>

          {/* Дополнительные фильтры */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('parts.allBrands')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('parts.allBrands')}</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder={t('parts.model')}
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Очистить фильтры */}
          {(searchTerm || (selectedCategory && selectedCategory !== 'all') || (selectedCondition && selectedCondition !== 'all') || (selectedBrand && selectedBrand !== 'all') || selectedModel) && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" onClick={clearFilters} className="text-gray-500">
                {t('parts.clearFilters')}
              </Button>
            </div>
          )}
        </div>

        {/* Результаты */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            {pagination && (
              <>
                {t('parts.showing')} {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {t('parts.of')} {pagination.total} {t('parts.results')}
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Список запчастей */}
        {parts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('parts.noResults')}
            </h3>
            <p className="text-gray-600">
              {t('parts.noResultsDescription')}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {parts.map((part) => (
              <PartCard key={part.id} part={part} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Пагинация */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              {pagination.page > 1 && (
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  {t('parts.previous')}
                </Button>
              )}
              
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                if (
                  page === 1 ||
                  page === pagination.pages ||
                  (page >= pagination.page - 2 && page <= pagination.page + 2)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.page ? 'default' : 'outline'}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                } else if (
                  page === pagination.page - 3 ||
                  page === pagination.page + 3
                ) {
                  return <span key={page} className="px-3 py-2">...</span>
                }
                return null
              })}
              
              {pagination.page < pagination.pages && (
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  {t('parts.next')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
