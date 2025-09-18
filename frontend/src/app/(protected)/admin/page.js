'use client'
import { ProtectedRoute } from '@/app/components/UI/ProtectedRoute'
import { useAuth } from '@/config/contexts/AuthContext'

export default function AdminPage() {
  const { logout } = useAuth()
  return (
    <ProtectedRoute requiredRole={1}>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
        <p>Contenido exclusivo para administradores.</p>
        <button onClick={logout}>Cerrar Sesion</button>
      </div>
    </ProtectedRoute>
  )
}