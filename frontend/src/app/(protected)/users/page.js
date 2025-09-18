import { ProtectedRoute } from '@/app/components/UI/ProtectedRoute'

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Panel de Usuario</h1>
        <p>Contenido para usuarios normales.</p>
      </div>
    </ProtectedRoute>
  )
}