'use client'

import { Provider } from 'react-redux'
import { store } from '../store'
import { ThemeProvider } from '@/components/theme-provider'
import { LocaleProvider } from '@/contexts/locale-context'
import { AuthProvider } from '@/contexts/auth-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        forcedTheme="light"
        storageKey="auto-theme"
        disableTransitionOnChange
      >
        <LocaleProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </Provider>
  )
}
