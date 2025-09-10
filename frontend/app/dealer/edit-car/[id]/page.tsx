'use client'

import { useState, useEffect, useCallback } from 'react'
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
import Image from 'next/image'
import { Car } from '@/types/types'

// Функция для преобразования данных из API в формат Car
function transformCarFromAPI(carData: any): Car {
  return {
    id: carData.id,
    brand: carData.brand,
    model: carData.model,
    generation: carData.generation,
    year: carData.year,
    mileage: carData.mileage,
    transmission: carData.transmission as Car['transmission'],
    fuel: carData.fuel as Car['fuel'],
    drive: carData.drive as Car['drive'],
    body_type: carData.body_type as Car['body_type'],
    color: carData.color,
    power: carData.power,
    engine_volume: carData.engine_volume,
    euro_standard: carData.euro_standard,
    vin: carData.vin,
    condition: carData.condition as Car['condition'],
    customs: carData.customs,
    vat: carData.vat,
    owners: carData.owners,
    price: carData.price,
    currency: carData.currency as Car['currency'],
    negotiable: carData.negotiable,
    city: carData.city,
    description: carData.description,
    photos: typeof carData.photos === 'string' ? JSON.parse(carData.photos) : carData.photos,
    status: carData.status as Car['status'],
    created_at: carData.created_at,
    updated_at: carData.updated_at,
    views: carData.views,
    admin: carData.admin
  }
}

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [car, setCar] = useState<Car | null>(null)
  const [carData, setCarData] = useState({
    // Basic info
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
    
    // Details
    power: '',
    engineVolume: '',
    euroStandard: '',
    vin: '',
    condition: '',
    customs: false,
    vat: false,
    owners: '1',
    
    // Media
    photos: [] as string[],
    
    // Price
    price: '',
    currency: 'EUR',
    negotiable: false,
    
    // Location & Description
    city: '',
    description: '',
    status: 'draft'
  })

  const steps = [
    { id: 1, title: 'Базовая информация', description: 'Марка, модель, год, пробег' },
    { id: 2, title: 'Детали', description: 'Мощность, объём, VIN, состояние' },
    { id: 3, title: 'Медиа', description: 'Загрузка фотографий' },
    { id: 4, title: 'Цена и статус', description: 'Цена, валюта, статус' },
    { id: 5, title: 'Публикация', description: 'Предпросмотр и публикация' }
  ]

  // Загружаем данные автомобиля
  useEffect(() => {
    const fetchCar = async () => {
      if (!params.id) return
      setFetchLoading(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${params.id}/`, {
        credentials: 'include'
      })
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Автомобиль не найден' : `Ошибка: ${response.status}`)
        }
        const data = await response.json()
        const transformedCar = transformCarFromAPI(data)
        setCar(transformedCar)
        
        // Заполняем форму данными автомобиля
        setCarData({
          brand: transformedCar.brand,
          model: transformedCar.model,
          generation: transformedCar.generation || '',
          year: transformedCar.year.toString(),
          mileage: transformedCar.mileage.toString(),
          transmission: transformedCar.transmission,
          fuel: transformedCar.fuel,
          drive: transformedCar.drive,
          color: transformedCar.color,
          bodyType: transformedCar.body_type,
          power: transformedCar.power.toString(),
          engineVolume: transformedCar.engine_volume.toString(),
          euroStandard: transformedCar.euro_standard,
          vin: transformedCar.vin,
          condition: transformedCar.condition,
          customs: transformedCar.customs,
          vat: transformedCar.vat,
          owners: transformedCar.owners.toString(),
          photos: transformedCar.photos || [],
          price: transformedCar.price.toString(),
          currency: transformedCar.currency,
          negotiable: transformedCar.negotiable,
          city: transformedCar.city,
          description: transformedCar.description,
          status: transformedCar.status
        })
        setError('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      }
      setFetchLoading(false)
    }
    fetchCar()
  }, [params.id])

  const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

  const handleInputChange = (field: string, value: any) => {
    if (field === 'photos') {
      setCarData(prev => ({ ...prev, photos: uniq(Array.isArray(value) ? value.map(String) : []) }));
    } else {
      setCarData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePhotosFromChild = useCallback(
    (images: string[]) => {
      setCarData(prev => ({ ...prev, photos: uniq(images) }));
    },
    []
  );

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateCar = async (status: 'draft' | 'published') => {
    setLoading(true)
    setError('')

    try {
      const finalCarData = {
        ...carData,
        status,
        year: parseInt(carData.year),
        mileage: parseInt(carData.mileage),
        power: parseInt(carData.power),
        engine_volume: parseFloat(carData.engineVolume),
        owners: parseInt(carData.owners),
        price: parseInt(carData.price),
        body_type: carData.bodyType,
        euro_standard: carData.euroStandard
      }

      console.log('Обновляем данные автомобиля:', finalCarData)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${params.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(finalCarData)
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Автомобиль успешно обновлен:', data)
        router.push('/dealer')
      } else {
        setError(data.error || 'Ошибка при обновлении автомобиля')
      }
    } catch (error) {
      console.error('Ошибка при обновлении:', error)
      setError('Ошибка при обновлении автомобиля')
    } finally {
      setLoading(false)
    }
  }

  const saveDraft = () => updateCar('draft')
  const publishCar = () => updateCar('published')

  const progress = (currentStep / steps.length) * 100

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Загрузка данных автомобиля...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={() => router.back()}>
            Назад
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
                Назад
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Редактировать автомобиль</h1>
                <p className="text-sm sm:text-base text-gray-600">
                  {car?.brand} {car?.model} • Шаг {currentStep} из 5
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={saveDraft} disabled={loading} size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
              {loading ? (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
              ) : (
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              )}
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
                    <Label htmlFor="brand" className="text-sm sm:text-base">Марка *</Label>
                    <Input
                      id="brand"
                      value={carData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      placeholder="Например: BMW, Mercedes-Benz, Audi"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="model" className="text-sm sm:text-base">Модель *</Label>
                    <Input
                      id="model"
                      value={carData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="Например: X5"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="generation" className="text-sm sm:text-base">Поколение</Label>
                    <Input
                      id="generation"
                      value={carData.generation}
                      onChange={(e) => handleInputChange('generation', e.target.value)}
                      placeholder="Например: F15"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="year" className="text-sm sm:text-base">Год выпуска *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={carData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="2020"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mileage" className="text-sm sm:text-base">Пробег, км *</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={carData.mileage}
                      onChange={(e) => handleInputChange('mileage', e.target.value)}
                      placeholder="50000"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="transmission" className="text-sm sm:text-base">Коробка передач *</Label>
                    <Select value={carData.transmission || undefined} onValueChange={(value) => handleInputChange('transmission', value)}>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Механическая</SelectItem>
                        <SelectItem value="automatic">Автоматическая</SelectItem>
                        <SelectItem value="robot">Робот</SelectItem>
                        <SelectItem value="variator">Вариатор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fuel" className="text-sm sm:text-base">Тип топлива *</Label>
                    <Select value={carData.fuel || undefined} onValueChange={(value) => handleInputChange('fuel', value)}>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
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
                    <Label htmlFor="drive" className="text-sm sm:text-base">Привод *</Label>
                    <Select value={carData.drive || undefined} onValueChange={(value) => handleInputChange('drive', value)}>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="front">Передний</SelectItem>
                        <SelectItem value="rear">Задний</SelectItem>
                        <SelectItem value="all">Полный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bodyType" className="text-sm sm:text-base">Тип кузова *</Label>
                    <Select value={carData.bodyType || undefined} onValueChange={(value) => handleInputChange('bodyType', value)}>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
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
                    <Label htmlFor="color" className="text-sm sm:text-base">Цвет *</Label>
                    <Input
                      id="color"
                      value={carData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="Например: Черный"
                      className="text-sm sm:text-base"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="power" className="text-sm sm:text-base">Мощность, л.с. *</Label>
                    <Input
                      id="power"
                      type="number"
                      value={carData.power}
                      onChange={(e) => handleInputChange('power', e.target.value)}
                      placeholder="150"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="engineVolume" className="text-sm sm:text-base">Объем двигателя, л *</Label>
                    <Input
                      id="engineVolume"
                      type="number"
                      step="0.1"
                      value={carData.engineVolume}
                      onChange={(e) => handleInputChange('engineVolume', e.target.value)}
                      placeholder="2.0"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="euroStandard" className="text-sm sm:text-base">Экологический стандарт</Label>
                    <Input
                      id="euroStandard"
                      value={carData.euroStandard}
                      onChange={(e) => handleInputChange('euroStandard', e.target.value)}
                      placeholder="Euro 6"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="vin" className="text-sm sm:text-base">VIN номер</Label>
                    <Input
                      id="vin"
                      value={carData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value)}
                      placeholder="VIN номер"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="condition" className="text-sm sm:text-base">Состояние *</Label>
                    <Select value={carData.condition || undefined} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Выберите состояние" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Отличное</SelectItem>
                        <SelectItem value="good">Хорошее</SelectItem>
                        <SelectItem value="fair">Удовлетворительное</SelectItem>
                        <SelectItem value="poor">Плохое</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="owners" className="text-sm sm:text-base">Количество владельцев *</Label>
                    <Input
                      id="owners"
                      type="number"
                      value={carData.owners}
                      onChange={(e) => handleInputChange('owners', e.target.value)}
                      placeholder="1"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="customs"
                          checked={carData.customs}
                          onCheckedChange={(checked) => handleInputChange('customs', checked)}
                        />
                        <Label htmlFor="customs" className="text-sm sm:text-base">Растаможен</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vat"
                          checked={carData.vat}
                          onCheckedChange={(checked) => handleInputChange('vat', checked)}
                        />
                        <Label htmlFor="vat" className="text-sm sm:text-base">НДС</Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <S3ImageUpload
                    carId={params.id as string}
                    onUploadComplete={handlePhotosFromChild}
                    maxFiles={10}
                    className="w-full"
                    existingImages={carData.photos || []}
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="price" className="text-sm sm:text-base">Цена *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={carData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="35000"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency" className="text-sm sm:text-base">Валюта *</Label>
                    <Select value={carData.currency || undefined} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Выберите валюту" />
                      </SelectTrigger>
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
                      <Checkbox
                        id="negotiable"
                        checked={carData.negotiable}
                        onCheckedChange={(checked) => handleInputChange('negotiable', checked)}
                      />
                      <Label htmlFor="negotiable" className="text-sm sm:text-base">Торг</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-sm sm:text-base">Город *</Label>
                    <Input
                      id="city"
                      value={carData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Москва"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="description" className="text-sm sm:text-base">Описание</Label>
                    <Textarea
                      id="description"
                      value={carData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Подробное описание автомобиля..."
                      rows={4}
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-sm sm:text-base">Статус *</Label>
                    <Select value={carData.status || undefined} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Черновик</SelectItem>
                        <SelectItem value="published">Опубликовано</SelectItem>
                        <SelectItem value="sold">Продано</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4">Предпросмотр изменений</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
                      <div>
                        <strong>Марка:</strong> {carData.brand || 'Не указана'}
                      </div>
                      <div>
                        <strong>Модель:</strong> {carData.model || 'Не указана'}
                      </div>
                      <div>
                        <strong>Год:</strong> {carData.year || 'Не указан'}
                      </div>
                      <div>
                        <strong>Пробег:</strong> {carData.mileage ? `${carData.mileage} км` : 'Не указан'}
                      </div>
                      <div>
                        <strong>Цена:</strong> {carData.price ? `${carData.price} ${carData.currency}` : 'Не указана'}
                      </div>
                      <div>
                        <strong>Город:</strong> {carData.city || 'Не указан'}
                      </div>
                      <div>
                        <strong>Статус:</strong> {carData.status === 'published' ? 'Опубликовано' : carData.status === 'draft' ? 'Черновик' : 'Продано'}
                      </div>
                    </div>
                  </div>

                  {/* Предпросмотр изображений */}
                  {carData.photos.length > 0 && (
                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                      <h3 className="text-lg sm:text-xl font-semibold mb-4">Фотографии ({carData.photos.length})</h3>
                                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                         {carData.photos.map((photo, index) => (
                           <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                                           {photo && typeof photo === 'string' && photo.trim() !== '' ? (
                                <Image
                                  src={photo}
                                  alt={`Фото ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <ImageIcon className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                             {index === 0 && (
                               <Badge className="absolute top-1 left-1 text-xs bg-blue-600">
                                 Главное
                               </Badge>
                             )}
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
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Назад
            </Button>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {currentStep < 5 ? (
                <Button
                  onClick={nextStep}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  Далее
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
                    Сохранить изменения
                  </Button>
                  <Button
                    onClick={publishCar}
                    disabled={loading}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    {loading ? (
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                    ) : (
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    )}
                    {carData.status === 'published' ? 'Обновить' : 'Опубликовать'}
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
