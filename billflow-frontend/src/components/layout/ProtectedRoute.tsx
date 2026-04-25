'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/lib/constants'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const router = useRouter()

  useEffect(() => {
    if (!token) router.replace(ROUTES.LOGIN)
  }, [token, router])

  if (!token) return null
  return <>{children}</>
}
