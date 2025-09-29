'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Save, Eye, Loader2, RefreshCw, Image as ImageIcon } from 'lucide-react'
import S3ImageUpload from '@/components/s3-image-upload'
import S3Image from '@/components/s3-image'
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

export default function EditPartPage() {
  const router = useRouter()
  const params = useParams()
  const partId = params.id as string
  const { locale } = useLocale()
  const { isAuthenticated, admin } = useAuth()
  
  // Отладочная информация
  console.log('🔐 Auth status:', { isAuthenticated, admin })
  
  const [currentStep, setCurrentStep] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [fetchLoading, setFetchLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [part, setPart] = React.useState<Part | null>(null)
  const [partData, setPartData] = React.useState({
    name: '',
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    category: '',
    condition: '',
    price: '',
    currency: 'EUR',
    negotiable: false,
    city: '',
    description: '',
    photos: [] as string[],
    status: 'draft',
  })

  const steps = [
    { id: 1, title: getUIText('step1', locale), description: getUIText('step1Desc', locale) },
    { id: 2, title: getUIText('step2', locale), description: getUIText('step2Desc', locale) },
    { id: 3, title: getUIText('step3', locale), description: getUIText('step3Desc', locale) },
  ]

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
  const currencies = ['EUR', 'USD', 'RUB']

  // Загружаем данные запчасти
  React.useEffect(() => {
    const fetchPart = async () => {
      if (!partId) return
      setFetchLoading(true)
      try {
        console.log('🔍 Загружаем запчасть с ID:', partId)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/${partId}/`, {
          credentials: 'include' // Важно для Django сессий
        })
        console.log('📥 Response status:', response.status)
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Запчасть не найдена' : `Ошибка: ${response.status}`)
        }
        const data = await response.json()
        console.log('📥 Fetched part data:', data)
        setPart(data)
        
        // Заполняем форму данными запчасти
        setPartData({
          name: data.name || '',
          brand: data.brand || '',
          model: data.model || '',
          yearFrom: data.yearFrom ? data.yearFrom.toString() : '',
          yearTo: data.yearTo ? data.yearTo.toString() : '',
          category: data.category || '',
          condition: data.condition || '',
          price: data.price ? data.price.toString() : '',
          currency: data.currency || 'EUR',
          negotiable: data.negotiable || false,
          city: data.city || '',
          description: data.description || '',
          photos: data.photos || [],
          status: data.status || 'draft'
        })
        setError('')
      } catch (err) {
        console.error('❌ Ошибка при загрузке запчасти:', err)
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      }
      setFetchLoading(false)
    }
    fetchPart()
  }, [partId])

  const uniq = (arr: any[]) => {
    if (!Array.isArray(arr)) return []
    return Array.from(new Set(arr.filter(Boolean)))
  };

  const handleInputChange = React.useCallback((field: string, value: any) => {
    if (field === 'photos') {
      setPartData(prev => ({ ...prev, photos: uniq(Array.isArray(value) ? value.map(String) : []) }));
    } else {
      setPartData(prev => ({ ...prev, [field]: value }));
    }
  }, [])

  const handlePhotosUpdate = React.useCallback((images: string[]) => {
    console.log('📸 handlePhotosUpdate called with:', images)
    setPartData(prev => ({ ...prev, photos: uniq(images) }))
  }, [])

  const nextStep = () => setCurrentStep((s) => Math.min(3, s + 1))
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1))

  const updatePart = async (status: 'draft' | 'published') => {
    setLoading(true)
    setError('')

    // Проверяем аутентификацию
    if (!isAuthenticated) {
      setError('Необходимо войти в систему')
      setLoading(false)
      return
    }

    try {
      const finalPartData = {
        ...partData,
        status,
        yearFrom: partData.yearFrom ? parseInt(partData.yearFrom) : null,
        yearTo: partData.yearTo ? parseInt(partData.yearTo) : null,
        price: parseFloat(partData.price),
      }

      console.log('Обновляем данные запчасти:', finalPartData)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parts/${partId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Важно для Django сессий
        body: JSON.stringify(finalPartData),
      })

      const data = await response.json()
      
      if (response.ok) {
        console.log('Запчасть успешно обновлена:', data)
        router.push('/dealer')
      } else {
        setError(data.error || 'Ошибка при обновлении запчасти')
      }
    } catch (error) {
      console.error('Ошибка при обновлении:', error)
      setError('Ошибка при обновлении запчасти')
    } finally {
      setLoading(false)
    }
  }

  const saveDraft = () => updatePart('draft')
  const publishPart = () => updatePart('published')
  const progress = (currentStep / steps.length) * 100

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">{getUIText('loading', locale)}...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !part) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={() => router.back()}>
            {getUIText('back', locale)}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button variant="outline" onClick={() => router.back()} size="sm" className="text-xs sm:text-sm">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {getUIText('back', locale)}
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{getUIText('editPart', locale)}</h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {part?.name} • {getUIText('step', locale)} {currentStep} {getUIText('of', locale)} 3
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={saveDraft} disabled={loading} size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
              {loading ? (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
              ) : (
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              )}
              {getUIText('saveDraft', locale)}
            </Button>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
              <strong>{getUIText('error', locale)}:</strong> {error}
            </div>
          )}

          {/* Progress */}
          <div className="mb-6 sm:mb-8">
            <Progress value={progress} className="mb-3 sm:mb-4" />
            <div className="hidden sm:flex justify-between text-sm">
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  className={`text-center ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              ))}
            </div>
            {/* Мобильная версия прогресса */}
            <div className="sm:hidden text-center">
              <div className="text-sm font-medium text-blue-600">
                {steps[currentStep - 1].title}
              </div>
              <div className="text-xs text-gray-500">
                {steps[currentStep - 1].description}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {currentStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm sm:text-base">{getUIText('partName', locale)} *</Label>
                    <Input 
                      id="name" 
                      value={partData.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={getUIText('partNamePlaceholder', locale)}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand" className="text-sm sm:text-base">{getUIText('carBrand', locale)} *</Label>
                    <Input 
                      id="brand" 
                      value={partData.brand} 
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      placeholder={getUIText('carBrandPlaceholder', locale)}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model" className="text-sm sm:text-base">{getUIText('carModel', locale)} *</Label>
                    <Input 
                      id="model" 
                      value={partData.model} 
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder={getUIText('carModelPlaceholder', locale)}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-sm sm:text-base">{getUIText('category', locale)} *</Label>
                    <Select value={partData.category || undefined} onValueChange={(v) => handleInputChange('category', v)}>
                      <SelectTrigger className="text-sm sm:text-base"><SelectValue placeholder={getUIText('selectCategory', locale)} /></SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {getCategoryText(category, locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="condition" className="text-sm sm:text-base">{getUIText('condition', locale)} *</Label>
                    <Select value={partData.condition || undefined} onValueChange={(v) => handleInputChange('condition', v)}>
                      <SelectTrigger className="text-sm sm:text-base"><SelectValue placeholder={getUIText('selectCondition', locale)} /></SelectTrigger>
                      <SelectContent>
                        {conditions.map(condition => (
                          <SelectItem key={condition} value={condition}>
                            {getConditionText(condition, locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="yearFrom" className="text-sm sm:text-base">{getUIText('yearFrom', locale)}</Label>
                    <Input 
                      id="yearFrom" 
                      type="number" 
                      value={partData.yearFrom} 
                      onChange={(e) => handleInputChange('yearFrom', e.target.value)}
                      placeholder="2000"
                      min="1900"
                      max="2030"
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearTo" className="text-sm sm:text-base">{getUIText('yearTo', locale)}</Label>
                    <Input 
                      id="yearTo" 
                      type="number" 
                      value={partData.yearTo} 
                      onChange={(e) => handleInputChange('yearTo', e.target.value)}
                      placeholder="2020"
                      min="1900"
                      max="2030"
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-sm sm:text-base">{getUIText('city', locale)} *</Label>
                    <Input 
                      id="city" 
                      value={partData.city} 
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Москва"
                      className="text-sm sm:text-base"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <S3ImageUpload
                    carId={partId}
                    existingImages={partData.photos || []}
                    onUploadComplete={handlePhotosUpdate}
                    maxFiles={10}
                    className="w-full"
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="price" className="text-sm sm:text-base">{getUIText('price', locale)} *</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      value={partData.price} 
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="1000"
                      min="0"
                      step="0.01"
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency" className="text-sm sm:text-base">{getUIText('currency', locale)} *</Label>
                    <Select value={partData.currency || undefined} onValueChange={(v) => handleInputChange('currency', v)}>
                      <SelectTrigger className="text-sm sm:text-base"><SelectValue placeholder={getUIText('selectCurrency', locale)} /></SelectTrigger>
                      <SelectContent>
                        {currencies.map(currency => (
                          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="negotiable" 
                        checked={partData.negotiable} 
                        onCheckedChange={(v) => handleInputChange('negotiable', v)} 
                      />
                      <Label htmlFor="negotiable" className="text-sm sm:text-base">{getUIText('negotiablePrice', locale)}</Label>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="description" className="text-sm sm:text-base">{getUIText('partDescription', locale)} *</Label>
                    <Textarea 
                      id="description" 
                      value={partData.description} 
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder={getUIText('partDescriptionPlaceholder', locale)}
                      rows={4}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-sm sm:text-base">{getUIText('status', locale)} *</Label>
                    <Select value={partData.status || undefined} onValueChange={(v) => handleInputChange('status', v)}>
                      <SelectTrigger className="text-sm sm:text-base"><SelectValue placeholder={getUIText('selectStatus', locale)} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{getUIText('draft', locale)}</SelectItem>
                        <SelectItem value="published">{getUIText('publish', locale)}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {getUIText('back', locale)}
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  {getUIText('next', locale)}
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={saveDraft}
                    disabled={loading}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    {loading ? (
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    )}
                    {getUIText('saveChanges', locale)}
                  </Button>
                  <Button
                    onClick={publishPart}
                    disabled={loading}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    {loading ? (
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                    ) : (
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    )}
                    {partData.status === 'published' ? getUIText('updatePart', locale) : getUIText('publishPart', locale)}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
