import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { CarsState, Car, CreateCarData } from '../../frontend/types/types'
import { carsAPI } from '../../services/api'

const initialState: CarsState = {
  cars: [],
  car: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  filters: {},
}

// Async thunks
export const fetchCars = createAsyncThunk(
  'cars/fetchCars',
  async (params?: any, { rejectWithValue }) => {
    try {
      const response = await carsAPI.getCars(params)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки автомобилей')
    }
  }
)

export const fetchCar = createAsyncThunk(
  'cars/fetchCar',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await carsAPI.getCar(id)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки автомобиля')
    }
  }
)

export const createCar = createAsyncThunk(
  'cars/createCar',
  async (data: CreateCarData, { rejectWithValue }) => {
    try {
      const response = await carsAPI.createCar(data)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания автомобиля')
    }
  }
)

export const updateCar = createAsyncThunk(
  'cars/updateCar',
  async ({ id, data }: { id: number; data: Partial<CreateCarData> }, { rejectWithValue }) => {
    try {
      const response = await carsAPI.updateCar(id, data)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления автомобиля')
    }
  }
)

export const deleteCar = createAsyncThunk(
  'cars/deleteCar',
  async (id: number, { rejectWithValue }) => {
    try {
      await carsAPI.deleteCar(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления автомобиля')
    }
  }
)

export const incrementCarViews = createAsyncThunk(
  'cars/incrementViews',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await carsAPI.incrementViews(id)
      return { id, views: response.views }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления просмотров')
    }
  }
)

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCar: (state) => {
      state.car = null
    },
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.page = 1
    },
    clearFilters: (state) => {
      state.filters = {}
      state.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cars
      .addCase(fetchCars.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false
        state.cars = action.payload.results
        state.total = action.payload.count
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch Car
      .addCase(fetchCar.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCar.fulfilled, (state, action) => {
        state.loading = false
        state.car = action.payload
      })
      .addCase(fetchCar.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create Car
      .addCase(createCar.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.loading = false
        state.cars.unshift(action.payload)
        state.total += 1
      })
      .addCase(createCar.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update Car
      .addCase(updateCar.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.loading = false
        const index = state.cars.findIndex(car => car.id === action.payload.id)
        if (index !== -1) {
          state.cars[index] = action.payload
        }
        if (state.car?.id === action.payload.id) {
          state.car = action.payload
        }
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete Car
      .addCase(deleteCar.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.loading = false
        state.cars = state.cars.filter(car => car.id !== action.payload)
        state.total -= 1
        if (state.car?.id === action.payload) {
          state.car = null
        }
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Increment Views
      .addCase(incrementCarViews.fulfilled, (state, action) => {
        const { id, views } = action.payload
        const car = state.cars.find(c => c.id === id)
        if (car) {
          car.views = views
        }
        if (state.car?.id === id) {
          state.car.views = views
        }
      })
  },
})

export const { 
  clearError, 
  clearCar, 
  setFilters, 
  clearFilters, 
  setPage 
} = carsSlice.actions

export default carsSlice.reducer
