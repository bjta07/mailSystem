'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/config/contexts/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('Usuario no autenticado, redirigiendo a login...');
        router.push('/login');
        return;
      }

      console.log('Usuario autenticado:', user);
      // Redirigir según el rol del usuario
      if (user.role === 'admin' || user.role === 1) {
        console.log('Redirigiendo a panel de admin...');
        router.push('/admin');
      } else {
        console.log('Redirigiendo a panel de usuario...');
        router.push('/users');
      }
    }
  }, [user, loading, router])

  // Mostrar loading mientras verifica y redirige
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Mostrar loading de redirección mientras procesa
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-blue-100 rounded w-32"></div>
        </div>
        <p className="text-gray-600 mt-4">Redirigiendo...</p>
      </div>
    </div>
  )
}