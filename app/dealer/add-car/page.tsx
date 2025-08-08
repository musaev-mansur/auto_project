'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Save, Eye, Loader2 } from 'lucide-react'

export default function AddCarPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [carData, setCarData] = useState({
    // Basic info
    brand: '',
    model: '',
    generation: '',
    year: '',
    mileage: '',
    transmission: '',
    fuel: '',
    drive: 'front', // Добавляем недостающее поле
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
    photos: ['/placeholder.jpg'] as string[], // Добавляем placeholder
    
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

  const handleInputChange = (field: string, value: any) => {
    setCarData(prev => ({ ...prev, [field]: value }))
  }

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

  const saveCar = async (status: 'draft' | 'published') => {
    setLoading(true)
    setError('')

    try {
      // Генерируем уникальный VIN если не указан
      const finalCarData = {
        ...carData,
        status,
        vin: carData.vin || `AUTO${Date.now()}`
      }

      console.log('Отправляем данные автомобиля:', finalCarData)

      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalCarData)
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Автомобиль успешно сохранен:', data)
        alert(status === 'published' ? 'Автомобиль успешно опубликован!' : 'Черновик сохранен!')
        router.push('/dealer')
      } else {
        console.error('Ошибка при сохранении:', data)
        setError(data.error || 'Ошибка при сохранении автомобиля')
      }
    } catch (err) {
      console.error('Ошибка при сохранении автомобиля:', err)
      setError('Ошибка при сохранении автомобиля')
    } finally {
      setLoading(false)
    }
  }

  const saveDraft = () => {
    saveCar('draft')
  }

  const publishCar = () => {
    saveCar('published')
  }

  const progress = (currentStep / 5) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Добавить автомобиль</h1>
                <p className="text-gray-600">Шаг {currentStep} из 5</p>
              </div>
            </div>
            <Button variant="outline" onClick={saveDraft} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Сохранить черновик
            </Button>
          </div>

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Ошибка:</strong> {error}
            </div>
          )}

          {/* Progress */}
          <div className="mb-8">
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between text-sm">
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
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="brand">Марка *</Label>
                    <Select value={carData.brand || undefined} onValueChange={(value) => handleInputChange('brand', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите марку" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BMW">BMW</SelectItem>
                        <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                        <SelectItem value="Audi">Audi</SelectItem>
                        <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                        <SelectItem value="Toyota">Toyota</SelectItem>
                        <SelectItem value="Honda">Honda</SelectItem>
                        <SelectItem value="Ford">Ford</SelectItem>
                        <SelectItem value="Opel">Opel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="model">Модель *</Label>
                    <Input
                      id="model"
                      value={carData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="Например: X5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="generation">Поколение</Label>
                    <Input
                      id="generation"
                      value={carData.generation}
                      onChange={(e) => handleInputChange('generation', e.target.value)}
                      placeholder="Например: F15"
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">Год выпуска *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={carData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="2020"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mileage">Пробег, км *</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={carData.mileage}
                      onChange={(e) => handleInputChange('mileage', e.target.value)}
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="transmission">Коробка передач *</Label>
                    <Select value={carData.transmission || undefined} onValueChange={(value) => handleInputChange('transmission', value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="fuel">Тип топлива *</Label>
                    <Select value={carData.fuel || undefined} onValueChange={(value) => handleInputChange('fuel', value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="drive">Привод *</Label>
                    <Select value={carData.drive} onValueChange={(value) => handleInputChange('drive', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="front">Передний</SelectItem>
                        <SelectItem value="rear">Задний</SelectItem>
                        <SelectItem value="all">Полный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bodyType">Тип кузова *</Label>
                    <Select value={carData.bodyType || undefined} onValueChange={(value) => handleInputChange('bodyType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">Седан</SelectItem>
                        <SelectItem value="hatchback">Хэтчбек</SelectItem>
                        <SelectItem value="wagon">Универсал</SelectItem>
                        <SelectItem value="suv">Внедорожник</SelectItem>
                        <SelectItem value="coupe">Купе</SelectItem>
                        <SelectItem value="convertible">Кабриолет</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color">Цвет *</Label>
                    <Input
                      id="color"
                      value={carData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="Черный"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="power">Мощность, л.с. *</Label>
                    <Input
                      id="power"
                      type="number"
                      value={carData.power}
                      onChange={(e) => handleInputChange('power', e.target.value)}
                      placeholder="249"
                    />
                  </div>

                  <div>
                    <Label htmlFor="engineVolume">Объём двигателя, л *</Label>
                    <Input
                      id="engineVolume"
                      type="number"
                      step="0.1"
                      value={carData.engineVolume}
                      onChange={(e) => handleInputChange('engineVolume', e.target.value)}
                      placeholder="3.0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="euroStandard">Экологический класс *</Label>
                    <Select value={carData.euroStandard || undefined} onValueChange={(value) => handleInputChange('euroStandard', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите класс" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Euro 6">Euro 6</SelectItem>
                        <SelectItem value="Euro 5">Euro 5</SelectItem>
                        <SelectItem value="Euro 4">Euro 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="vin">VIN номер *</Label>
                    <Input
                      id="vin"
                      value={carData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value)}
                      placeholder="Введите VIN или оставьте пустым для автогенерации"
                    />
                  </div>

                  <div>
                    <Label htmlFor="condition">Состояние *</Label>
                    <Select value={carData.condition || undefined} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите состояние" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Отличное</SelectItem>
                        <SelectItem value="good">Хорошее</SelectItem>
                        <SelectItem value="fair">Удовлетворительное</SelectItem>
                        <SelectItem value="poor">Требует ремонта</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="owners">Количество владельцев</Label>
                    <Input
                      id="owners"
                      type="number"
                      value={carData.owners}
                      onChange={(e) => handleInputChange('owners', e.target.value)}
                      placeholder="1"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="customs"
                        checked={carData.customs}
                        onCheckedChange={(checked) => handleInputChange('customs', checked)}
                      />
                      <Label htmlFor="customs">Растаможен</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vat"
                        checked={carData.vat}
                        onCheckedChange={(checked) => handleInputChange('vat', checked)}
                      />
                      <Label htmlFor="vat">НДС включен</Label>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>Фотографии автомобиля</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="space-y-2">
                        <div className="text-gray-500">
                          Перетащите фотографии сюда или нажмите для выбора
                        </div>
                        <Button variant="outline">Выбрать файлы</Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Рекомендуется загрузить 5-10 качественных фотографий. Первая фотография будет использована как главная.
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                      ⚠️ Функция загрузки фотографий будет добавлена в следующем обновлении. Сейчас используется placeholder.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price">Цена *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={carData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="45000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Валюта</Label>
                    <Select value={carData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="RUB">RUB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="city">Город *</Label>
                    <Input
                      id="city"
                      value={carData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Москва"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="negotiable"
                      checked={carData.negotiable}
                      onCheckedChange={(checked) => handleInputChange('negotiable', checked)}
                    />
                    <Label htmlFor="negotiable">Торг уместен</Label>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Описание *</Label>
                    <Textarea
                      id="description"
                      value={carData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Подробное описание автомобиля, его особенностей, комплектации..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Предпросмотр объявления</h3>
                    <div className="space-y-2">
                      <p><strong>Автомобиль:</strong> {carData.brand} {carData.model} {carData.generation}</p>
                      <p><strong>Год:</strong> {carData.year}</p>
                      <p><strong>Пробег:</strong> {carData.mileage} км</p>
                      <p><strong>Цена:</strong> {carData.price} {carData.currency}</p>
                      <p><strong>Город:</strong> {carData.city}</p>
                      <p><strong>VIN:</strong> {carData.vin || 'Будет сгенерирован автоматически'}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={publishCar} size="lg" disabled={loading}>
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="mr-2 h-4 w-4" />
                      )}
                      Опубликовать
                    </Button>
                    <Button variant="outline" onClick={saveDraft} size="lg" disabled={loading}>
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Сохранить как черновик
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
            
            {currentStep < 5 && (
              <Button onClick={nextStep}>
                Далее
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
