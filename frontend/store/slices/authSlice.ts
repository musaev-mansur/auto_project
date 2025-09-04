import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, LoginCredentials, Admin } from '@/types/types'
import { authAPI } from '../../services/api'

const initialState: AuthState = {
  user: null,
  token: null, // Не используем токены для Django сессий
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log('🔐 Попытка входа с:', credentials)
      const response = await authAPI.login(credentials)
      console.log('✅ Ответ от сервера:', response)
      return response
    } catch (error: any) {
      console.error('❌ Ошибка входа:', error)
      console.error('❌ Данные ошибки:', error.response?.data)
      return rejectWithValue(error.response?.data?.error || 'Ошибка входа')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout()
      return null
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка выхода')
    }
  }
)

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка получения профиля')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = null // Не используем токены для Django сессий
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setToken } = authSlice.actions
export default authSlice.reducer
