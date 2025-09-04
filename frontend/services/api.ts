import axios from 'axios'
import { 
  LoginCredentials, 
  CreateCarData, 
  CreatePartData, 
  Car, 
  Part, 
  Admin,
  ApiResponse 
} from '../types/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Создаем axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с Django сессиями
})

// Interceptor для добавления токена (не нужен для Django сессий)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// Interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API - используем Django сессии
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    console.log('🌐 Отправка запроса на:', `${API_BASE_URL}/api/login/`)
    console.log('📤 Данные:', credentials)
    const response = await api.post('/api/login/', credentials, {
      withCredentials: true // Важно для работы с сессиями
    })
    console.log('📥 Ответ:', response.data)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/api/logout/', {}, {
      withCredentials: true
    })
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/api/profile/', {
      withCredentials: true
    })
    return response.data
  },
}

// Cars API
export const carsAPI = {
  getCars: async (params?: any) => {
    const response = await api.get<ApiResponse<Car>>('/api/cars/', { params })
    return response.data
  },

  getCar: async (id: number) => {
    const response = await api.get<Car>(`/api/cars/${id}/`)
    return response.data
  },

  createCar: async (data: CreateCarData) => {
    const response = await api.post<Car>('/api/cars/', data)
    return response.data
  },

  updateCar: async (id: number, data: Partial<CreateCarData>) => {
    const response = await api.put<Car>(`/api/cars/${id}/`, data)
    return response.data
  },

  deleteCar: async (id: number) => {
    const response = await api.delete(`/api/cars/${id}/`)
    return response.data
  },

  incrementViews: async (id: number) => {
    const response = await api.post(`/api/cars/${id}/increment_views/`)
    return response.data
  },

  getStats: async () => {
    const response = await api.get('/api/cars/stats/')
    return response.data
  },
}

// Parts API
export const partsAPI = {
  getParts: async (params?: any) => {
    const response = await api.get<ApiResponse<Part>>('/api/parts/', { params })
    return response.data
  },

  getPart: async (id: number) => {
    const response = await api.get<Part>(`/api/parts/${id}/`)
    return response.data
  },

  createPart: async (data: CreatePartData) => {
    const response = await api.post<Part>('/api/parts/', data)
    return response.data
  },

  updatePart: async (id: number, data: Partial<CreatePartData>) => {
    const response = await api.put<Part>(`/api/parts/${id}/`, data)
    return response.data
  },

  deletePart: async (id: number) => {
    const response = await api.delete(`/api/parts/${id}/`)
    return response.data
  },

  incrementViews: async (id: number) => {
    const response = await api.post(`/api/parts/${id}/increment_views/`)
    return response.data
  },

  getStats: async () => {
    const response = await api.get('/api/parts/stats/')
    return response.data
  },
}

// Admins API
export const adminsAPI = {
  getAdmins: async (params?: any) => {
    const response = await api.get<ApiResponse<Admin>>('/api/admins/', { params })
    return response.data
  },

  getAdmin: async (id: number) => {
    const response = await api.get<Admin>(`/api/admins/${id}/`)
    return response.data
  },

  createAdmin: async (data: any) => {
    const response = await api.post<Admin>('/api/admins/', data)
    return response.data
  },

  updateAdmin: async (id: number, data: any) => {
    const response = await api.put<Admin>(`/api/admins/${id}/`, data)
    return response.data
  },

  deleteAdmin: async (id: number) => {
    const response = await api.delete(`/api/admins/${id}/`)
    return response.data
  },
}

export default api
