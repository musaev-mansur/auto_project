'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugPage() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testApi = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/cars')
      const data = await response.json()
      setApiResponse(data)
      console.log('API Response:', data)
    } catch (err) {
      setError('Ошибка при загрузке данных')
      console.error('API Error:', err)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Отладка API</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Тест API /api/cars</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testApi} disabled={loading}>
              {loading ? 'Загрузка...' : 'Тестировать API'}
            </Button>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            {apiResponse && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Ответ API:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
                
                {apiResponse.cars && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Автомобили ({apiResponse.cars.length}):</h4>
                    <div className="space-y-2">
                      {apiResponse.cars.map((car: any, index: number) => (
                        <div key={car.id} className="p-3 border rounded">
                          <p><strong>{index + 1}.</strong> {car.brand} {car.model} ({car.year})</p>
                          <p className="text-sm text-gray-600">ID: {car.id}</p>
                          <p className="text-sm text-gray-600">Цена: {car.price} {car.currency}</p>
                          <p className="text-sm text-gray-600">Статус: {car.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
