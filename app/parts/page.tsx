'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PartCard } from '@/components/part-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Grid, List } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
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
  const { locale } = useLocale()

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
        console.error('Error fetching parts:', data.error)
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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/parts?${params.toString()}`)
  }

  if (loading) {
    return (
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getUIText('parts', locale)}
          </h1>
          <p className="text-gray-600">
            {pagination?.total || 0} {getUIText('parts', locale).toLowerCase()}
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Поиск */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={getUIText('search', locale)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {getUIText('filters', locale)}
              </Button>
            </div>
          </div>

          {/* Расширенные фильтры */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getUIText('category', locale)}
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{getUIText('allCategories', locale)}</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {getCategoryText(category, locale)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getUIText('condition', locale)}
                  </label>
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{getUIText('allConditions', locale)}</SelectItem>
                      {conditions.map(condition => (
                        <SelectItem key={condition} value={condition}>
                          {getConditionText(condition, locale)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getUIText('brand', locale)}
                  </label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{getUIText('allBrands', locale)}</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getUIText('model', locale)}
                  </label>
                  <Input
                    type="text"
                    placeholder={getUIText('modelPlaceholder', locale)}
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button onClick={handleSearch}>
                  {getUIText('search', locale)}
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  {getUIText('clearFilters', locale)}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Результаты */}
        {parts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {getUIText('noPartsFound', locale)}
            </h2>
            <p className="text-gray-600 mb-4">
              {getUIText('noPartsDescription', locale)}
            </p>
            <Button onClick={clearFilters}>
              {getUIText('clearFilters', locale)}
            </Button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {parts.map((part) => (
                <PartCard key={part.id} part={part} viewMode={viewMode} />
              ))}
            </div>

            {/* Пагинация */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  {pagination.page > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      {getUIText('previous', locale)}
                    </Button>
                  )}
                  
                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= pagination.page - 1 && page <= pagination.page + 1)
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
                      page === pagination.page - 2 ||
                      page === pagination.page + 2
                    ) {
                      return <span key={page} className="px-2 py-2">...</span>
                    }
                    return null
                  })}
                  
                  {pagination.page < pagination.pages && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      {getUIText('next', locale)}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
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
