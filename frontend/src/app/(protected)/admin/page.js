'use client'
import { ProtectedRoute } from '@/app/components/UI/ProtectedRoute'
import  UserDashboard from '@/app/components/UI/Dashboard'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole={1}>
      <UserDashboard/>
    </ProtectedRoute>
  )
}