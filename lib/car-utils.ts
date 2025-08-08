import { Car } from '@/types'

// Преобразование данных из базы в формат для фронтенда
export function transformCarFromDB(car: any): Car {
  return {
    id: car.id,
    brand: car.brand,
    model: car.model,
    generation: car.generation,
    year: car.year,
    mileage: car.mileage,
    transmission: car.transmission as Car['transmission'],
    fuel: car.fuel as Car['fuel'],
    drive: car.drive as Car['drive'],
    bodyType: car.bodyType as Car['bodyType'],
    color: car.color,
    power: car.power,
    engineVolume: car.engineVolume,
    euroStandard: car.euroStandard,
    vin: car.vin,
    condition: car.condition as Car['condition'],
    customs: car.customs,
    vat: car.vat,
    owners: car.owners,
    price: car.price,
    currency: car.currency as Car['currency'],
    negotiable: car.negotiable,
    city: car.city,
    description: car.description,
    photos: typeof car.photos === 'string' ? JSON.parse(car.photos) : car.photos,
    status: car.status as Car['status'],
    createdAt: car.createdAt.toISOString(),
    views: car.views
  }
}

// Преобразование данных для сохранения в базу
export function transformCarForDB(car: Partial<Car>): any {
  return {
    ...car,
    photos: Array.isArray(car.photos) ? JSON.stringify(car.photos) : car.photos
  }
}

// Валидация данных автомобиля
export function validateCarData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.brand) errors.push('Марка обязательна')
  if (!data.model) errors.push('Модель обязательна')
  if (!data.year || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
    errors.push('Некорректный год')
  }
  if (!data.mileage || data.mileage < 0) errors.push('Некорректный пробег')
  if (!data.price || data.price < 0) errors.push('Некорректная цена')
  if (!data.vin) errors.push('VIN обязателен')
  if (!data.city) errors.push('Город обязателен')

  return {
    isValid: errors.length === 0,
    errors
  }
}
