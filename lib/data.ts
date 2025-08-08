import { Car, Part, Lead } from '@/types'

// Mock data for demonstration
export const mockCars: Car[] = [
  {
    id: '1',
    brand: 'BMW',
    model: 'X5',
    generation: 'F15',
    year: 2018,
    mileage: 85000,
    transmission: 'automatic',
    fuel: 'diesel',
    drive: 'all',
    bodyType: 'suv',
    color: 'Черный',
    power: 249,
    engineVolume: 3.0,
    euroStandard: 'Euro 6',
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
    createdAt: '2024-01-15',
    views: 156
  },
  {
    id: '2',
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2020,
    mileage: 45000,
    transmission: 'automatic',
    fuel: 'petrol',
    drive: 'rear',
    bodyType: 'sedan',
    color: 'Белый',
    power: 184,
    engineVolume: 1.5,
    euroStandard: 'Euro 6',
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
    createdAt: '2024-01-20',
    views: 89
  }
]

export const mockParts: Part[] = [
  {
    id: '1',
    name: 'Фара передняя левая',
    category: 'Оптика',
    oem: 'A2218200661',
    compatibility: 'Mercedes-Benz S-Class W221 2005-2013',
    condition: 'used',
    price: 350,
    stock: 1,
    photos: ['/placeholder.svg?height=300&width=400'],
    status: 'available',
    createdAt: '2024-01-10'
  }
]

export const mockLeads: Lead[] = [
  {
    id: '1',
    type: 'question',
    itemType: 'car',
    itemId: '1',
    name: 'Иван Петров',
    phone: '+375291234567',
    email: 'ivan@example.com',
    message: 'Интересует BMW X5, можно посмотреть в выходные?',
    createdAt: '2024-01-25T10:30:00',
    status: 'new'
  }
]
