import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PartsState, Part, CreatePartData } from '../../frontend/types/types'
import { partsAPI } from '../../services/api'

const initialState: PartsState = {
  parts: [],
  part: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  filters: {},
}

// Async thunks
export const fetchParts = createAsyncThunk(
  'parts/fetchParts',
  async (params?: any, { rejectWithValue }) => {
    try {
      const response = await partsAPI.getParts(params)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки запчастей')
    }
  }
)

export const fetchPart = createAsyncThunk(
  'parts/fetchPart',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await partsAPI.getPart(id)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки запчасти')
    }
  }
)

export const createPart = createAsyncThunk(
  'parts/createPart',
  async (data: CreatePartData, { rejectWithValue }) => {
    try {
      const response = await partsAPI.createPart(data)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка создания запчасти')
    }
  }
)

export const updatePart = createAsyncThunk(
  'parts/updatePart',
  async ({ id, data }: { id: number; data: Partial<CreatePartData> }, { rejectWithValue }) => {
    try {
      const response = await partsAPI.updatePart(id, data)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления запчасти')
    }
  }
)

export const deletePart = createAsyncThunk(
  'parts/deletePart',
  async (id: number, { rejectWithValue }) => {
    try {
      await partsAPI.deletePart(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления запчасти')
    }
  }
)

export const incrementPartViews = createAsyncThunk(
  'parts/incrementViews',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await partsAPI.incrementViews(id)
      return { id, views: response.views }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка обновления просмотров')
    }
  }
)

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearPart: (state) => {
      state.part = null
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
      // Fetch Parts
      .addCase(fetchParts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchParts.fulfilled, (state, action) => {
        state.loading = false
        state.parts = action.payload.results
        state.total = action.payload.count
      })
      .addCase(fetchParts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch Part
      .addCase(fetchPart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPart.fulfilled, (state, action) => {
        state.loading = false
        state.part = action.payload
      })
      .addCase(fetchPart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create Part
      .addCase(createPart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPart.fulfilled, (state, action) => {
        state.loading = false
        state.parts.unshift(action.payload)
        state.total += 1
      })
      .addCase(createPart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update Part
      .addCase(updatePart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePart.fulfilled, (state, action) => {
        state.loading = false
        const index = state.parts.findIndex(part => part.id === action.payload.id)
        if (index !== -1) {
          state.parts[index] = action.payload
        }
        if (state.part?.id === action.payload.id) {
          state.part = action.payload
        }
      })
      .addCase(updatePart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete Part
      .addCase(deletePart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePart.fulfilled, (state, action) => {
        state.loading = false
        state.parts = state.parts.filter(part => part.id !== action.payload)
        state.total -= 1
        if (state.part?.id === action.payload) {
          state.part = null
        }
      })
      .addCase(deletePart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Increment Views
      .addCase(incrementPartViews.fulfilled, (state, action) => {
        const { id, views } = action.payload
        const part = state.parts.find(p => p.id === id)
        if (part) {
          part.views = views
        }
        if (state.part?.id === id) {
          state.part.views = views
        }
      })
  },
})

export const { 
  clearError, 
  clearPart, 
  setFilters, 
  clearFilters, 
  setPage 
} = partsSlice.actions

export default partsSlice.reducer
