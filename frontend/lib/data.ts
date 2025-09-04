import { Car, Part } from '@/frontend/types/types'

// Mock data for demonstration
export const mockCars: Car[] = [
  {
    id: 1,
    brand: 'BMW',
    model: 'X5',
    generation: 'F15',
    year: 2018,
    mileage: 85000,
    transmission: 'automatic',
    fuel: 'diesel',
    drive: 'all',
    body_type: 'suv',
    color: 'Черный',
    power: 249,
    engine_volume: 3.0,
    euro_standard: 'Euro 6',
    vin: '****1234',
    condition: 'excellent',
    customs: true,
    vat: false,
    owners: 1,
    price: 45000,
    currency: 'EUR',
    negotiable: true,
    city: 'Минск',
    description: 'Автомобиль в отличном состоянии, полная комплектация, один владелец.',
    photos: ['/placeholder.svg?height=400&width=600'],
    status: 'published',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    views: 156,
    admin: {
      id: 1,
      email: 'admin@carspark.be',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      date_joined: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: 2,
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2020,
    mileage: 45000,
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'rear',
    body_type: 'sedan',
    color: 'Белый',
    power: 184,
    engine_volume: 1.5,
    euro_standard: 'Euro 6',
    vin: '****5678',
    condition: 'excellent',
    customs: true,
    vat: true,
    owners: 1,
    price: 38000,
    currency: 'EUR',
    negotiable: false,
    city: 'Минск',
    description: 'Новый автомобиль, гарантия, полная комплектация.',
    photos: ['/placeholder.svg?height=400&width=600'],
    status: 'published',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    views: 89,
    admin: {
      id: 1,
      email: 'admin@carspark.be',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      date_joined: '2024-01-01T00:00:00Z'
    }
  }
]

export const mockParts: Part[] = [
  {
    id: 1,
    name: 'Фара передняя левая',
    brand: 'Mercedes-Benz',
    model: 'S-Class',
    category: 'Оптика',
    condition: 'used',
    price: 350,
    currency: 'EUR',
    negotiable: true,
    city: 'Минск',
    description: 'Оригинальная фара в хорошем состоянии',
    photos: ['/placeholder.svg?height=300&width=400'],
    status: 'published',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    views: 45,
    admin: {
      id: 1,
      email: 'admin@carspark.be',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      date_joined: '2024-01-01T00:00:00Z'
    }
  }
]
