export interface Car {
  id: string
  brand: string
  model: string
  generation?: string
  year: number
  mileage: number
  transmission: 'manual' | 'automatic' | 'robot' | 'variator'
  fuel: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'gas'
  drive: 'front' | 'rear' | 'all'
  bodyType: 'sedan' | 'hatchback' | 'wagon' | 'suv' | 'coupe' | 'convertible'
  color: string
  power: number
  engineVolume: number
  euroStandard: string
  vin: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  customs: boolean
  vat: boolean
  owners: number
  price: number
  currency: 'EUR' | 'USD' | 'RUB'
  negotiable: boolean
  city: string
  description: string
  photos: string[]
  status: 'draft' | 'published' | 'sold'
  createdAt: string
  views: number
  admin?: {
    id: string
    name: string
    email: string
  }
}

export interface Part {
  id: string
  name: string
  category: string
  oem: string
  compatibility: string
  condition: 'new' | 'used'
  price: number
  stock: number
  photos: string[]
  status: 'available' | 'hidden' | 'sold'
  createdAt: string
}

export interface Lead {
  id: string
  type: 'question' | 'viewing' | 'call'
  itemType: 'car' | 'part'
  itemId: string
  name: string
  phone: string
  email?: string
  message: string
  createdAt: string
  status: 'new' | 'contacted' | 'closed'
}
