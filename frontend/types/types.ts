// Auth types
export interface Admin {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
  date_joined: string
}

export interface AuthState {
  user: Admin | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Car types
export interface Car {
  id: number
  brand: string
  model: string
  generation?: string
  year: number
  mileage: number
  transmission: 'manual' | 'automatic' | 'robot' | 'variator'
  fuel: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'gas'
  drive: 'front' | 'rear' | 'all'
  body_type: 'sedan' | 'hatchback' | 'wagon' | 'suv' | 'coupe' | 'convertible'
  color: string
  power: number
  engine_volume: number
  euro_standard: string
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
  views: number
  admin: Admin
  created_at: string
  updated_at: string
}

export interface CarsState {
  cars: Car[]
  car: Car | null
  loading: boolean
  error: string | null
  total: number
  page: number
  filters: {
    brand?: string
    model?: string
    year?: number
    transmission?: string
    fuel?: string
    status?: string
    price_min?: number
    price_max?: number
  }
}

// Part types
export interface Part {
  id: number
  name: string
  brand: string
  model: string
  year_from?: number
  year_to?: number
  category: string
  condition: 'new' | 'used' | 'refurbished'
  price: number
  currency: 'EUR' | 'USD' | 'RUB'
  negotiable: boolean
  city: string
  description: string
  photos: string[]
  status: 'draft' | 'published' | 'sold'
  views: number
  admin: Admin
  created_at: string
  updated_at: string
}

export interface PartsState {
  parts: Part[]
  part: Part | null
  loading: boolean
  error: string | null
  total: number
  page: number
  filters: {
    brand?: string
    model?: string
    category?: string
    condition?: string
    status?: string
    price_min?: number
    price_max?: number
  }
}

// API Response types
export interface ApiResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateCarData {
  brand: string
  model: string
  generation?: string
  year: number
  mileage: number
  transmission: string
  fuel: string
  drive: string
  body_type: string
  color: string
  power: number
  engine_volume: number
  euro_standard: string
  vin: string
  condition: string
  customs: boolean
  vat: boolean
  owners: number
  price: number
  currency: string
  negotiable: boolean
  city: string
  description: string
  photos: string[]
  status: string
}

export interface CreatePartData {
  name: string
  brand: string
  model: string
  year_from?: number
  year_to?: number
  category: string
  condition: string
  price: number
  currency: string
  negotiable: boolean
  city: string
  description: string
  photos: string[]
  status: string
}
