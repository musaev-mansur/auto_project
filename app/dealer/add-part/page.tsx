'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import S3ImageUpload from '@/components/s3-image-upload'

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
const brands = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Honda',
  'Ford', 'Opel', 'Peugeot', 'Renault', 'Citroen', 'Fiat',
  'Volvo', 'Saab', 'Skoda', 'Seat', 'Alfa Romeo', 'Lancia'
]

export default function AddPartPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [formData, setFormData] = useState({
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
    status: 'published'
  })

  const handlePhotosUpload = (uploadedPhotos: string[]) => {
    console.log('📸 Photos uploaded in add-part:', uploadedPhotos)
    console.log('📸 Photos type:', typeof uploadedPhotos)
    console.log('📸 Photos is array:', Array.isArray(uploadedPhotos))
    
    // Обновляем фотографии только если передан валидный массив
    if (Array.isArray(uploadedPhotos)) {
      console.log('📸 Setting photos state:', uploadedPhotos)
      setPhotos(uploadedPhotos)
    } else {
      console.log('⚠️ Invalid photos data received:', uploadedPhotos)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('📝 Form data before submission:', formData)
    console.log('📸 Photos before submission:', photos)
    
    // Валидация обязательных полей
    if (!formData.name || !formData.brand || !formData.model || !formData.price || !formData.city || !formData.description) {
      alert('Пожалуйста, заполните все обязательные поля')
      return
    }

    setLoading(true)

    try {
      const requestBody = {
        ...formData,
        yearFrom: formData.yearFrom ? parseInt(formData.yearFrom) : null,
        yearTo: formData.yearTo ? parseInt(formData.yearTo) : null,
        price: parseFloat(formData.price),
        photos
      }
      
      console.log('📤 Sending request body:', requestBody)
      
      const response = await fetch('/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('📥 Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Success response:', result)
        alert('Запчасть успешно добавлена!')
        router.push('/dealer')
      } else {
        const error = await response.json()
        console.error('❌ Error response:', error)
        alert(`Ошибка: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating part:', error)
      alert('Ошибка при создании запчасти')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="mb-8">
            <Link href="/dealer" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к панели
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Добавить запчасть</h1>
            <p className="text-gray-600 mt-2">Заполните информацию о запчасти</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Основная информация */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Основная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Название запчасти *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Например: Двигатель BMW N54"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="brand">Марка автомобиля *</Label>
                        <Input
                          id="brand"
                          value={formData.brand}
                          onChange={(e) => handleInputChange('brand', e.target.value)}
                          placeholder="Например: BMW"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="model">Модель автомобиля *</Label>
                        <Input
                          id="model"
                          value={formData.model}
                          onChange={(e) => handleInputChange('model', e.target.value)}
                          placeholder="Например: 335i"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="yearFrom">Год от</Label>
                        <Input
                          id="yearFrom"
                          type="number"
                          value={formData.yearFrom}
                          onChange={(e) => handleInputChange('yearFrom', e.target.value)}
                          placeholder="2000"
                          min="1900"
                          max="2030"
                        />
                      </div>

                      <div>
                        <Label htmlFor="yearTo">Год до</Label>
                        <Input
                          id="yearTo"
                          type="number"
                          value={formData.yearTo}
                          onChange={(e) => handleInputChange('yearTo', e.target.value)}
                          placeholder="2020"
                          min="1900"
                          max="2030"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Категория *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category === 'engine' ? 'Двигатель' :
                                 category === 'transmission' ? 'Трансмиссия' :
                                 category === 'brakes' ? 'Тормоза' :
                                 category === 'suspension' ? 'Подвеска' :
                                 category === 'electrical' ? 'Электрика' :
                                 category === 'body' ? 'Кузов' :
                                 category === 'interior' ? 'Салон' :
                                 category === 'exterior' ? 'Внешний вид' :
                                 category === 'wheels' ? 'Колеса' :
                                 category === 'tires' ? 'Шины' : 'Другое'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="condition">Состояние *</Label>
                        <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите состояние" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map(condition => (
                              <SelectItem key={condition} value={condition}>
                                {condition === 'new' ? 'Новое' :
                                 condition === 'used' ? 'Б/у' : 'Восстановленное'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Описание *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Подробное описание запчасти, состояние, комплектация..."
                        rows={4}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Цена и контакты */}
                <Card>
                  <CardHeader>
                    <CardTitle>Цена и контакты</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Цена *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="1000"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="currency">Валюта</Label>
                        <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map(currency => (
                              <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="city">Город *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Москва"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="negotiable"
                        checked={formData.negotiable}
                        onCheckedChange={(checked) => handleInputChange('negotiable', checked as boolean)}
                      />
                      <Label htmlFor="negotiable">Цена договорная</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Боковая панель */}
              <div className="space-y-6">
                                 {/* Фотографии */}
                 <Card>
                   <CardHeader>
                     <CardTitle>Фотографии</CardTitle>
                   </CardHeader>
                   <CardContent>
                                           <S3ImageUpload
                        carId="new"
                        onUploadComplete={handlePhotosUpload}
                        maxFiles={10}
                        className="w-full"
                        autoNotify={false}
                        data-s3-upload="true"
                      />
                                           <p className="text-xs text-gray-500 mt-2">
                        Выбрано фотографий: {photos.length}
                        {photos.length > 0 && (
                          <span className="ml-2">({photos.length} фото загружено)</span>
                        )}
                      </p>
                      
                      {/* Превью загруженных фотографий */}
                      {photos.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700 mb-2">Загруженные фотографии:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {photos.map((photo, index) => (
                              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img 
                                  src={photo} 
                                  alt={`Фото ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log('🔍 Current photos state:', photos)
                            console.log('🔍 Current form data:', formData)
                          }}
                          className="flex-1 text-xs"
                        >
                          Проверить состояние
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Принудительно обновляем фотографии из компонента
                            const s3Component = document.querySelector('[data-s3-upload]') as any
                            if (s3Component && s3Component.getImages) {
                              const currentImages = s3Component.getImages()
                              console.log('🔄 Force updating photos from component:', currentImages)
                              setPhotos(currentImages)
                            }
                          }}
                          className="flex-1 text-xs"
                        >
                          Обновить фото
                        </Button>
                      </div>
                   </CardContent>
                 </Card>

                {/* Статус публикации */}
                <Card>
                  <CardHeader>
                    <CardTitle>Публикация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="status">Статус</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Опубликовать</SelectItem>
                          <SelectItem value="draft">Черновик</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Сохранить запчасть
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
