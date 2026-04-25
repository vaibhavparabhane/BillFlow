import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  themeMode: 'light' | 'dark'
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  logout: () => void
  toggleTheme: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      themeMode: 'light',
      setAuth: (user, token) => set({ user, token }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null }),
      toggleTheme: () =>
        set((s) => ({ themeMode: s.themeMode === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'auth' },
  ),
)
