'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/config/contexts/AuthContext'

export function PublicRoute({ children, redirectTo = '/' }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (!loading && user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Cargando...</div>
      </div>
    )
  }

  // Si ya está autenticado, no mostrar la página pública
  if (user) {
    return null
  }

  return children
}