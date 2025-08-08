'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Car, Package, Plus, MessageSquare, Settings, Eye, Edit, Trash2, RefreshCw, Menu, X } from 'lucide-react'
import { AdminQuickActions } from '@/components/admin-quick-actions'
import { Car as CarType } from '@/types'

// Функция для преобразования данных из API в формат Car
function transformCarFromAPI(carData: any): CarType {
  return {
    id: carData.id,
    brand: carData.brand,
    model: carData.model,
    generation: carData.generation,
    year: carData.year,
    mileage: carData.mileage,
    transmission: carData.transmission as CarType['transmission'],
    fuel: carData.fuel as CarType['fuel'],
    drive: carData.drive as CarType['drive'],
    bodyType: carData.bodyType as CarType['bodyType'],
    color: carData.color,
    power: carData.power,
    engineVolume: carData.engineVolume,
    euroStandard: carData.euroStandard,
    vin: carData.vin,
    condition: carData.condition as CarType['condition'],
    customs: carData.customs,
    vat: carData.vat,
    owners: carData.owners,
    price: carData.price,
    currency: carData.currency as CarType['currency'],
    negotiable: carData.negotiable,
    city: carData.city,
    description: carData.description,
    photos: typeof carData.photos === 'string' ? JSON.parse(carData.photos) : carData.photos,
    status: carData.status as CarType['status'],
    createdAt: carData.createdAt,
    views: carData.views,
    admin: carData.admin
  }
}

export default function DealerDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [cars, setCars] = useState<CarType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchCars = async () => {
    setLoading(true)
    try {
      console.log('Загружаем автомобили для панели дилера...')
      const response = await fetch('/api/cars')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Данные автомобилей:', data)
      
      const transformedCars = (data.cars || []).map(transformCarFromAPI)
      console.log('Преобразованные автомобили:', transformedCars)
      
      setCars(transformedCars)
      setError('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setError(`Ошибка при загрузке автомобилей: ${errorMessage}`)
      console.error('Ошибка fetchCars:', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCars()
  }, [])

  // Фильтрация автомобилей по статусу
  const publishedCars = cars.filter(car => car.status === 'published')
  const draftCars = cars.filter(car => car.status === 'draft')
  const soldCars = cars.filter(car => car.status === 'sold')

  // Временные данные для запчастей и заявок (пока используем моковые)
  const availableParts = [] // TODO: подключить API для запчастей
  const newLeads = [] // TODO: подключить API для заявок

  const menuItems = [
    { id: 'overview', label: 'Обзор', icon: Eye },
    { id: 'add-car', label: 'Добавить авто', icon: Plus },
    { id: 'my-cars', label: 'Мои авто', icon: Car },
    { id: 'add-part', label: 'Добавить запчасть', icon: Plus },
    { id: 'my-parts', label: 'Мои запчасти', icon: Package },
    { id: 'leads', label: 'Заявки', icon: MessageSquare },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ]

  const handleDeleteCar = async (carId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      return
    }

    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        console.log('Автомобиль успешно удален')
        fetchCars() // Обновляем список
      } else {
        const errorData = await response.json()
        alert(`Ошибка при удалении: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Ошибка при удалении автомобиля:', error)
      alert('Ошибка при удалении автомобиля')
    }
  }

  const handleStatusChange = async (carId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        console.log('Статус автомобиля обновлен')
        fetchCars() // Обновляем список
      } else {
        const errorData = await response.json()
        alert(`Ошибка при обновлении: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error)
      alert('Ошибка при обновлении статуса')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2">Загрузка данных...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Мобильное меню */}
      <div className="lg:hidden bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Панель дилера</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r min-h-screen transition-transform duration-300 ease-in-out`}>
          <div className="p-4 lg:p-6 border-b">
            <h1 className="text-lg lg:text-xl font-bold hidden lg:block">Панель дилера</h1>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false) // Закрываем мобильное меню при клике
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors text-sm lg:text-base ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 lg:h-5 lg:w-5 mr-3" />
                    {item.label}
                    {item.id === 'leads' && newLeads.length > 0 && (
                      <Badge className="ml-auto bg-red-500 text-xs">{newLeads.length}</Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Overlay для мобильного меню */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {error && (
            <div className="mb-4 lg:mb-6 bg-red-100 border border-red-400 text-red-700 px-3 lg:px-4 py-2 lg:py-3 rounded text-sm">
              <strong>Ошибка:</strong> {error}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl lg:text-2xl font-bold">Обзор</h2>
                <Button onClick={fetchCars} variant="outline" disabled={loading} size="sm" className="text-xs lg:text-sm">
                  <RefreshCw className={`h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Обновить
                </Button>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                <Card>
                  <CardContent className="p-3 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs lg:text-sm text-gray-600">Опубликованные авто</p>
                        <p className="text-lg lg:text-2xl font-bold">{publishedCars.length}</p>
                      </div>
                      <Car className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs lg:text-sm text-gray-600">Черновики</p>
                        <p className="text-lg lg:text-2xl font-bold">{draftCars.length}</p>
                      </div>
                      <Edit className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs lg:text-sm text-gray-600">Продано</p>
                        <p className="text-lg lg:text-2xl font-bold">{soldCars.length}</p>
                      </div>
                      <Package className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs lg:text-sm text-gray-600">Всего авто</p>
                        <p className="text-lg lg:text-2xl font-bold">{cars.length}</p>
                      </div>
                      <MessageSquare className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <AdminQuickActions />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card>
                  <CardHeader className="pb-3 lg:pb-6">
                    <CardTitle className="text-base lg:text-lg">Последние автомобили</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 lg:space-y-3">
                      {publishedCars.slice(0, 3).map((car) => (
                        <div key={car.id} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm lg:text-base">{car.brand} {car.model}</p>
                            <p className="text-xs lg:text-sm text-gray-600">{car.price.toLocaleString()} {car.currency}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">{car.views} просмотров</Badge>
                        </div>
                      ))}
                      {publishedCars.length === 0 && (
                        <p className="text-gray-500 text-center py-4 text-sm lg:text-base">Нет опубликованных автомобилей</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 lg:pb-6">
                    <CardTitle className="text-base lg:text-lg">Статистика</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 lg:space-y-3 text-sm lg:text-base">
                      <div className="flex justify-between">
                        <span>Средняя цена:</span>
                        <span className="font-medium">
                          {cars.length > 0 
                            ? Math.round(cars.reduce((sum, car) => sum + car.price, 0) / cars.length).toLocaleString() + ' EUR'
                            : '0 EUR'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Общий пробег:</span>
                        <span className="font-medium">
                          {cars.length > 0 
                            ? cars.reduce((sum, car) => sum + car.mileage, 0).toLocaleString() + ' км'
                            : '0 км'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Средний год:</span>
                        <span className="font-medium">
                          {cars.length > 0 
                            ? Math.round(cars.reduce((sum, car) => sum + car.year, 0) / cars.length)
                            : '0'
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'add-car' && (
            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold">Добавить автомобиль</h2>
              <Link href="/dealer/add-car">
                <Button size="lg" className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Начать добавление автомобиля
                </Button>
              </Link>
            </div>
          )}

          {activeTab === 'my-cars' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl lg:text-2xl font-bold">Мои автомобили</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={fetchCars} variant="outline" disabled={loading} size="sm" className="text-xs lg:text-sm">
                    <RefreshCw className={`h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Обновить
                  </Button>
                  <Link href="/dealer/add-car">
                    <Button size="sm" className="text-xs lg:text-sm w-full sm:w-auto">
                      <Plus className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                      Добавить авто
                    </Button>
                  </Link>
                </div>
              </div>

              {cars.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        Автомобили не найдены
                      </h3>
                      <p className="text-gray-500 mb-4">
                        У вас пока нет добавленных автомобилей
                      </p>
                      <Link href="/dealer/add-car">
                        <Button size="sm" className="text-xs lg:text-sm">
                          <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                          Добавить первый автомобиль
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {cars.map((car) => (
                    <Card key={car.id}>
                      <CardContent className="p-3 lg:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm lg:text-base">{car.brand} {car.model}</h3>
                          <Badge 
                            variant={car.status === 'published' ? 'default' : 
                                    car.status === 'draft' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {car.status === 'published' ? 'Опубликовано' :
                             car.status === 'draft' ? 'Черновик' : 'Продано'}
                          </Badge>
                        </div>
                        <p className="text-base lg:text-lg font-bold text-blue-600 mb-2">
                          {car.price.toLocaleString()} {car.currency}
                        </p>
                        <p className="text-xs lg:text-sm text-gray-600 mb-3">
                          {car.views} просмотров • {car.year} год • {car.mileage.toLocaleString()} км
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(car.id, car.status === 'published' ? 'draft' : 'published')}
                            className="text-xs"
                          >
                            {car.status === 'published' ? 'Снять с публикации' : 'Опубликовать'}
                          </Button>
                          <div className="flex gap-2">
                            <Link href={`/cars/${car.id}`}>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteCar(car.id)}
                              className="text-red-600 hover:text-red-700 flex-1"
                            >
                              <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold">Заявки</h2>
              <p className="text-gray-600 text-sm lg:text-base">Функция заявок будет добавлена в следующем обновлении.</p>
            </div>
          )}

          {activeTab === 'add-part' && (
            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold">Добавить запчасть</h2>
              <p className="text-gray-600 text-sm lg:text-base">Функция управления запчастями будет добавлена в следующем обновлении.</p>
            </div>
          )}

          {activeTab === 'my-parts' && (
            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold">Мои запчасти</h2>
              <p className="text-gray-600 text-sm lg:text-base">Функция управления запчастями будет добавлена в следующем обновлении.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold">Настройки</h2>
              <p className="text-gray-600 text-sm lg:text-base">Настройки будут добавлены в следующем обновлении.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
