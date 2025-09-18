'use client'
import { useAuth } from '@/config/contexts/AuthContext'
import UsersTable from '@/app/components/UI/UsersTable'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function UsersPage() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user?.role !== 1) { // 1 = admin
        router.push('/users') // redirige a dashboard normal
      }
    }
  }, [loading, isAuthenticated, user, router])

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <UsersTable />
    </div>
  )
}
