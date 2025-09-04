import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import carsReducer from './slices/carsSlice'
import partsReducer from './slices/partsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carsReducer,
    parts: partsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
