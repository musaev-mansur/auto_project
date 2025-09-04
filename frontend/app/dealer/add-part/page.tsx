'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Save, Eye, Loader2 } from 'lucide-react'
import S3ImageUpload from '@/components/s3-image-upload'
import S3Image from '@/components/s3-image'
import { useLocale } from '@/contexts/locale-context'
import { getCategoryText, getConditionText, getUIText } from '@/lib/translations'

export default function AddPartPage() {
  const router = useRouter()
  const { locale } = useLocale()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [savedPartId, setSavedPartId] = React.useState<string | null>(null)

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

  const handleInputChange = React.useCallback((field: string, value: any) => {
    if (field === 'photos') {
      const next = Array.isArray(value) ? value : []
      setPartData((prev) => ({ ...prev, photos: next }))
    } else {
      setPartData((prev) => ({ ...prev, [field]: value }))
    }
  }, [])

  const handlePhotosUpdate = React.useCallback((images: string[]) => {
    console.log('📸 handlePhotosUpdate called with:', images)
    setPartData((prev) => ({ ...prev, photos: Array.isArray(images) ? images : [] }))
  }, [])

  const nextStep = () => setCurrentStep((s) => Math.min(3, s + 1))
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1))

  const savePart = async (status: 'draft' | 'published') => {
    setLoading(true)
    setError('')

    try {
      const finalPartData = {
        ...partData,
        status,
        yearFrom: partData.yearFrom ? parseInt(partData.yearFrom) : null,
        yearTo: partData.yearTo ? parseInt(partData.yearTo) : null,
        price: parseFloat(partData.price) || 0,
        // Добавляем значения по умолчанию для обязательных полей
        name: partData.name || 'Запчасть',
        brand: partData.brand || 'Неизвестно',
        model: partData.model || 'Неизвестно',
        category: partData.category || 'Другое',
        condition: partData.condition || 'new',
        currency: partData.currency || 'EUR',
        city: partData.city || 'Москва',
        description: partData.description || 'Описание запчасти',
        photos: partData.photos || [],
        // Не отправляем admin_id - он будет установлен автоматически в perform_create
      }

      const response = await fetch('http://localhost:8000/api/parts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Важно для Django сессий
        body: JSON.stringify(finalPartData),
      })
      const data = await response.json()

      if (response.ok) {
        // Проверяем структуру ответа
        if (data.id) {
          setSavedPartId(data.id)
        } else if (data.part && data.part.id) {
          setSavedPartId(data.part.id)
        }
        router.push('/dealer')
      } else {
        // Обрабатываем ошибки валидации
        if (data.detail) {
          setError(data.detail)
        } else if (typeof data === 'object') {
          const errorMessages = Object.entries(data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ')
          setError(errorMessages)
        } else {
          setError(data.error || 'Ошибка при сохранении запчасти')
        }
      }
    } catch (err) {
      console.error('Ошибка при сохранении:', err)
      setError('Ошибка при сохранении запчасти')
    } finally {
      setLoading(false)
    }
  }

  const saveDraft = () => savePart('draft')
  const publishPart = () => savePart('published')
  const progress = (currentStep / steps.length) * 100

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
                <h1 className="text-xl sm:text-2xl font-bold">{getUIText('addPart', locale)}</h1>
                <p className="text-sm sm:text-base text-gray-600">{getUIText('step', locale)} {currentStep} {getUIText('of', locale)} 3</p>
              </div>
            </div>
            <Button variant="outline" onClick={saveDraft} disabled={loading} size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
              {loading ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" /> : <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
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
                <div key={step.id} className={`text-center ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              ))}
            </div>
            <div className="sm:hidden text-center">
              <div className="text-sm font-medium text-blue-600">{steps[currentStep - 1].title}</div>
              <div className="text-xs text-gray-500">{steps[currentStep - 1].description}</div>
            </div>
          </div>

          {/* Content */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {currentStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="name">{getUIText('partName', locale)} *</Label>
                    <Input 
                      id="name" 
                      value={partData.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={getUIText('partNamePlaceholder', locale)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">{getUIText('carBrand', locale)} *</Label>
                    <Input 
                      id="brand" 
                      value={partData.brand} 
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      placeholder={getUIText('carBrandPlaceholder', locale)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">{getUIText('carModel', locale)} *</Label>
                    <Input 
                      id="model" 
                      value={partData.model} 
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder={getUIText('carModelPlaceholder', locale)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">{getUIText('category', locale)} *</Label>
                    <Select value={partData.category || undefined} onValueChange={(v) => handleInputChange('category', v)}>
                      <SelectTrigger><SelectValue placeholder={getUIText('selectCategory', locale)} /></SelectTrigger>
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
                    <Label htmlFor="condition">{getUIText('condition', locale)} *</Label>
                    <Select value={partData.condition || undefined} onValueChange={(v) => handleInputChange('condition', v)}>
                      <SelectTrigger><SelectValue placeholder={getUIText('selectCondition', locale)} /></SelectTrigger>
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
                    <Label htmlFor="yearFrom">{getUIText('yearFrom', locale)}</Label>
                    <Input 
                      id="yearFrom" 
                      type="number" 
                      value={partData.yearFrom} 
                      onChange={(e) => handleInputChange('yearFrom', e.target.value)}
                      placeholder="2000"
                      min="1900"
                      max="2030"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearTo">{getUIText('yearTo', locale)}</Label>
                    <Input 
                      id="yearTo" 
                      type="number" 
                      value={partData.yearTo} 
                      onChange={(e) => handleInputChange('yearTo', e.target.value)}
                      placeholder="2020"
                      min="1900"
                      max="2030"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">{getUIText('city', locale)} *</Label>
                    <Input 
                      id="city" 
                      value={partData.city} 
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Москва"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <S3ImageUpload
                    carId={savedPartId || 'new'}
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
                    <Label htmlFor="price">{getUIText('price', locale)} *</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      value={partData.price} 
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="1000"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">{getUIText('currency', locale)} *</Label>
                    <Select value={partData.currency || undefined} onValueChange={(v) => handleInputChange('currency', v)}>
                      <SelectTrigger><SelectValue placeholder={getUIText('selectCurrency', locale)} /></SelectTrigger>
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
                      <Label htmlFor="negotiable">{getUIText('negotiablePrice', locale)}</Label>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="description">{getUIText('partDescription', locale)} *</Label>
                    <Textarea 
                      id="description" 
                      value={partData.description} 
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder={getUIText('partDescriptionPlaceholder', locale)}
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-4">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="w-full sm:w-auto text-sm sm:text-base">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {getUIText('back', locale)}
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {currentStep < 3 ? (
                <Button onClick={nextStep} className="w-full sm:w-auto text-sm sm:text-base">
                  {getUIText('next', locale)}
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={saveDraft} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">
                    {loading ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" /> : <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
                    {getUIText('saveDraft', locale)}
                  </Button>
                  <Button onClick={publishPart} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">
                    {loading ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
                    {getUIText('publishPart', locale)}
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
