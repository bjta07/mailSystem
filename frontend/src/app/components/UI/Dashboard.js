// components/UserDashboard.jsx
'use client'

import { useAuth } from '@/config/contexts/AuthContext'
import Link from 'next/link'
import styles from '@/styles/Dashboard.module.css'

export default function UserDashboard() {
  const { user } = useAuth()

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Panel de Usuario</h1>

      {/* Tarjeta de usuario */}
      <div className={styles.userCard}>
        <div className={styles.userInfoLeft}>
          <h2>👋 ¡Bienvenido, {user?.name}!</h2>
          <p>
            <span className={styles.label}>Usuario:</span> {user?.username}
          </p>
        </div>
        <div className={styles.userInfoRight}>
          <p>
            <span className={styles.label}>Rol:</span> {user?.role === 1 ? 'Administrador' : 'Usuario'}
          </p>
          <p>
            <span className={styles.label}>Estado:</span>{' '}
            <span className={user?.isActive ? styles.active : styles.inactive}>
              {user?.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </p>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className={styles.quickAccess}>
        <h3>⚡ Accesos Rápidos</h3>
        <div className={styles.cards}>
          <div className={styles.card}>
            <Link href="users/correspondencia">
              <h4>📨 Gestión de Correspondencia</h4>
            </Link>
            <p>Administra y da seguimiento a tu correspondencia</p>
          </div>
          <div className={styles.card}>
            <Link href="users/profile">
              <h4>👤 Mi Perfil</h4>
            </Link>
            <p>Actualiza tu información personal</p>
          </div>
        </div>
      </div>
    </div>
  )
}

