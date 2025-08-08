import Link from 'next/link'
import Image from 'next/image'
import { Car } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Gauge, Fuel, Settings } from 'lucide-react'

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`
  }

  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString()} км`
  }

  return (
    <Link href={`/cars/${car.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative">
          <Image
            src={car.photos[0] || '/placeholder.svg?height=200&width=300&query=car'}
            alt={`${car.brand} ${car.model}`}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {car.negotiable && (
            <Badge className="absolute top-2 right-2 bg-green-600">
              Торг
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            {car.brand} {car.model} {car.generation}
          </h3>
          
          <div className="text-2xl font-bold text-blue-600 mb-3">
            {formatPrice(car.price, car.currency)}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {car.year}
            </div>
            <div className="flex items-center">
              <Gauge className="h-4 w-4 mr-1" />
              {formatMileage(car.mileage)}
            </div>
            <div className="flex items-center">
              <Fuel className="h-4 w-4 mr-1" />
              {car.fuel}
            </div>
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-1" />
              {car.transmission}
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            {car.city}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
