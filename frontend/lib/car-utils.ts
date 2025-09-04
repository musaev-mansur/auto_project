import { Car } from '@/frontend/types/types'

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
    body_type: car.body_type as Car['body_type'],
    color: car.color,
    power: car.power,
    engine_volume: car.engine_volume,
    euro_standard: car.euro_standard,
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
    created_at: car.created_at,
    updated_at: car.updated_at,
    views: car.views,
    admin: car.admin
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
