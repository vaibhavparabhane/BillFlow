'use client'

import { useMemo } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { useAuthStore } from '@/store/auth.store'
import { lightTheme, darkTheme } from '@/lib/theme'

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useAuthStore((s) => s.themeMode)
  const theme = useMemo(() => (themeMode === 'dark' ? darkTheme : lightTheme), [themeMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={4000}
      >
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  )
}
