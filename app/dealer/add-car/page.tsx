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

export default function AddCarPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [savedCarId, setSavedCarId] = React.useState<string | null>(null)

  const [carData, setCarData] = React.useState({
    brand: '',
    model: '',
    generation: '',
    year: '',
    mileage: '',
    transmission: '',
    fuel: '',
    drive: 'front',
    color: '',
    bodyType: '',

    power: '',
    engineVolume: '',
    euroStandard: '',
    vin: '',
    condition: '',
    customs: false,
    vat: false,
    owners: '1',

    photos: [] as string[],

    price: '',
    currency: 'EUR',
    negotiable: false,

    city: '',
    description: '',
    status: 'draft',
  })

  const steps = [
    { id: 1, title: 'Базовая информация', description: 'Марка, модель, год, пробег' },
    { id: 2, title: 'Детали', description: 'Мощность, объём, VIN, состояние' },
    { id: 3, title: 'Медиа', description: 'Загрузка фотографий' },
    { id: 4, title: 'Цена и статус', description: 'Цена, валюта, статус' },
    { id: 5, title: 'Публикация', description: 'Предпросмотр и публикация' },
  ]

  const handleInputChange = React.useCallback((field: string, value: any) => {
    if (field === 'photos') {
      const next = Array.isArray(value) ? value : []
      setCarData((prev) => ({ ...prev, photos: next }))
    } else {
      setCarData((prev) => ({ ...prev, [field]: value }))
    }
  }, [])

  const handlePhotosUpdate = React.useCallback((images: string[]) => {
    console.log('📸 handlePhotosUpdate called with:', images)
    setCarData((prev) => ({ ...prev, photos: Array.isArray(images) ? images : [] }))
  }, [])

  const nextStep = () => setCurrentStep((s) => Math.min(5, s + 1))
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1))

  const saveCar = async (status: 'draft' | 'published') => {
    async function commitImages(carId: string, images: string[]) {
      try {
        console.log('🔄 Starting commit images for carId:', carId)
        console.log('🔄 Images to commit:', images)
        
        // Фильтруем только временные изображения (содержащие /temp_)
        const tempImages = images.filter(img => img.includes('/temp_'))
        console.log('🔄 Temp images found:', tempImages)
        
        if (tempImages.length === 0) {
          console.log('🔄 No temp images to commit, returning original images')
          return images
        }

        console.log('🔄 Sending commit request...')
        const res = await fetch('/api/images/commit', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ carId, images: tempImages })
        })
        
        console.log('🔄 Commit response status:', res.status)
        
        if (!res.ok) {
          console.error('Commit images failed:', res.status, await res.text())
          return images
        }
        
        const data = await res.json()
        console.log('🔄 Commit response data:', data)
        
        if (data?.success && Array.isArray(data.images)) {
          // Заменяем временные URL на постоянные
          const permanentImages = images.map(img => {
            if (img.includes('/temp_')) {
              const tempKey = img.split('/').pop()
              const permanentImg = data.images.find((permImg: string) => permImg.includes(tempKey || '')) || img
              console.log('🔄 Replacing temp image:', img, 'with:', permanentImg)
              return permanentImg
            }
            return img
          })
          console.log('🔄 Final permanent images:', permanentImages)
          setCarData(prev => ({ ...prev, photos: permanentImages }))
          return permanentImages
        }
      } catch (error) {
        console.error('Error committing images:', error)
      }
      return images
    }

    setLoading(true)
    setError('')

    try {
      const finalCarData = {
        ...carData,
        status,
        vin: carData.vin || `AUTO${Date.now()}`,
      }

      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalCarData),
      })
      const data = await response.json()

      if (response.ok) {
        setSavedCarId(data.car.id)

        if (carData.photos.length > 0) {
          // Коммитим временные изображения в постоянные
          const committedImages = await commitImages(data.car.id, carData.photos)
          
          // Обновляем только поле photos
          const updateResponse = await fetch(`/api/cars/${data.car.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photos: committedImages }),
          })
          if (!updateResponse.ok) {
            const updateError = await updateResponse.json().catch(() => ({}))
            console.error('Ошибка при обновлении изображений:', updateResponse.status, updateError)
          }
        }

        router.push('/dealer')
      } else {
        setError(data.error || 'Ошибка при сохранении автомобиля')
      }
    } catch (err) {
      console.error('Ошибка при сохранении:', err)
      setError('Ошибка при сохранении автомобиля')
    } finally {
      setLoading(false)
    }
  }

  const saveDraft = () => saveCar('draft')
  const publishCar = () => saveCar('published')
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
                Назад
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Добавить автомобиль</h1>
                <p className="text-sm sm:text-base text-gray-600">Шаг {currentStep} из 5</p>
              </div>
            </div>
            <Button variant="outline" onClick={saveDraft} disabled={loading} size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
              {loading ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" /> : <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
              Сохранить черновик
            </Button>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
              <strong>Ошибка:</strong> {error}
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
                    <Label htmlFor="brand">Марка *</Label>
                    <Input id="brand" value={carData.brand} onChange={(e) => handleInputChange('brand', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="model">Модель *</Label>
                    <Input id="model" value={carData.model} onChange={(e) => handleInputChange('model', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="generation">Поколение</Label>
                    <Input id="generation" value={carData.generation} onChange={(e) => handleInputChange('generation', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="year">Год выпуска *</Label>
                    <Input id="year" type="number" value={carData.year} onChange={(e) => handleInputChange('year', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="mileage">Пробег, км *</Label>
                    <Input id="mileage" type="number" value={carData.mileage} onChange={(e) => handleInputChange('mileage', e.target.value)} />
                  </div>
                  <div>
                    <Label>Коробка передач *</Label>
                    <Select value={carData.transmission || undefined} onValueChange={(v) => handleInputChange('transmission', v)}>
                      <SelectTrigger><SelectValue placeholder="Выберите тип" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Механическая</SelectItem>
                        <SelectItem value="automatic">Автоматическая</SelectItem>
                        <SelectItem value="robot">Робот</SelectItem>
                        <SelectItem value="variator">Вариатор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Тип топлива *</Label>
                    <Select value={carData.fuel || undefined} onValueChange={(v) => handleInputChange('fuel', v)}>
                      <SelectTrigger><SelectValue placeholder="Выберите тип" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Бензин</SelectItem>
                        <SelectItem value="diesel">Дизель</SelectItem>
                        <SelectItem value="hybrid">Гибрид</SelectItem>
                        <SelectItem value="electric">Электро</SelectItem>
                        <SelectItem value="gas">Газ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Привод *</Label>
                    <Select value={carData.drive || undefined} onValueChange={(v) => handleInputChange('drive', v)}>
                      <SelectTrigger><SelectValue placeholder="Выберите тип" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="front">Передний</SelectItem>
                        <SelectItem value="rear">Задний</SelectItem>
                        <SelectItem value="all">Полный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bodyType">Тип кузова *</Label>
                    <Select value={carData.bodyType || undefined} onValueChange={(v) => handleInputChange('bodyType', v)}>
                      <SelectTrigger><SelectValue placeholder="Выберите тип" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Седан</SelectItem>
                        <SelectItem value="hatchback">Хэтчбек</SelectItem>
                        <SelectItem value="wagon">Универсал</SelectItem>
                        <SelectItem value="suv">Внедорожник</SelectItem>
                        <SelectItem value="coupe">Купе</SelectItem>
                        <SelectItem value="convertible">Кабриолет</SelectItem>
                        <SelectItem value="minivan">Минивэн</SelectItem>
                        <SelectItem value="pickup">Пикап</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="color">Цвет *</Label>
                    <Input id="color" value={carData.color} onChange={(e) => handleInputChange('color', e.target.value)} />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="power">Мощность, л.с. *</Label>
                    <Input id="power" type="number" value={carData.power} onChange={(e) => handleInputChange('power', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="engineVolume">Объем двигателя, л *</Label>
                    <Input id="engineVolume" type="number" step="0.1" value={carData.engineVolume} onChange={(e) => handleInputChange('engineVolume', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="euroStandard">Экологический стандарт</Label>
                    <Input id="euroStandard" value={carData.euroStandard} onChange={(e) => handleInputChange('euroStandard', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="vin">VIN номер</Label>
                    <Input id="vin" value={carData.vin} onChange={(e) => handleInputChange('vin', e.target.value)} placeholder="Автоматически сгенерируется" />
                  </div>
                  <div>
                    <Label>Состояние *</Label>
                    <Select value={carData.condition || undefined} onValueChange={(v) => handleInputChange('condition', v)}>
                      <SelectTrigger><SelectValue placeholder="Выберите состояние" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Отличное</SelectItem>
                        <SelectItem value="good">Хорошее</SelectItem>
                        <SelectItem value="fair">Удовлетворительное</SelectItem>
                        <SelectItem value="poor">Плохое</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="owners">Количество владельцев *</Label>
                    <Input id="owners" type="number" value={carData.owners} onChange={(e) => handleInputChange('owners', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="customs" checked={carData.customs} onCheckedChange={(v) => handleInputChange('customs', v)} />
                        <Label htmlFor="customs">Растаможен</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="vat" checked={carData.vat} onCheckedChange={(v) => handleInputChange('vat', v)} />
                        <Label htmlFor="vat">НДС</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <S3ImageUpload
                    carId={savedCarId || 'new'}
                    existingImages={carData.photos}   // ← ВАЖНО: даём текущий список
                    onUploadComplete={handlePhotosUpdate}
                    maxFiles={10}
                    className="w-full"
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="price">Цена *</Label>
                    <Input id="price" type="number" value={carData.price} onChange={(e) => handleInputChange('price', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="currency">Валюта *</Label>
                    <Select value={carData.currency || undefined} onValueChange={(v) => handleInputChange('currency', v)}>
                      <SelectTrigger><SelectValue placeholder="Выберите валюту" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="RUB">RUB</SelectItem>
                        <SelectItem value="BYN">BYN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="negotiable" checked={carData.negotiable} onCheckedChange={(v) => handleInputChange('negotiable', v)} />
                      <Label htmlFor="negotiable">Торг</Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="city">Город *</Label>
                    <Input id="city" value={carData.city} onChange={(e) => handleInputChange('city', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea id="description" value={carData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4">Предпросмотр</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
                      <div><strong>Марка:</strong> {carData.brand || 'Не указана'}</div>
                      <div><strong>Модель:</strong> {carData.model || 'Не указана'}</div>
                      <div><strong>Год:</strong> {carData.year || 'Не указан'}</div>
                      <div><strong>Пробег:</strong> {carData.mileage ? `${carData.mileage} км` : 'Не указан'}</div>
                      <div><strong>Цена:</strong> {carData.price ? `${carData.price} ${carData.currency}` : 'Не указана'}</div>
                      <div><strong>Город:</strong> {carData.city || 'Не указан'}</div>
                    </div>
                  </div>

                  {carData.photos.length > 0 && (
                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4">Фотографии ({carData.photos.length})</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {carData.photos.map((photo, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                            <S3Image
                              src={photo && typeof photo === 'string' && photo.trim() !== '' ? photo : '/placeholder.svg?height=200&width=200&query=car'}
                              alt={`Фото ${idx + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                            {idx === 0 && <Badge className="absolute top-1 left-1 text-xs bg-blue-600">Главное</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-4">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="w-full sm:w-auto text-sm sm:text-base">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Назад
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {currentStep < 5 ? (
                <Button onClick={nextStep} className="w-full sm:w-auto text-sm sm:text-base">
                  Далее
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={saveDraft} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">
                    {loading ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" /> : <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
                    Сохранить черновик
                  </Button>
                  <Button onClick={publishCar} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">
                    {loading ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
                    Опубликовать
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
