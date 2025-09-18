'use client'
import { useEffect, useState } from 'react'
import { authApi } from '@/config/api/apiAuth'
import { useAuth } from '@/config/contexts/AuthContext'
import styles from '@/styles/UsersTable.module.css'
import UserModal from './UserModal'

export default function UsersTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user: currentUser } = useAuth()

  const handleEditClick = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSave = async (updatedUserData) => {
    try {
      setLoading(true)
      const response = await authApi.updateUser(selectedUser.uid, updatedUserData)
      
      // Actualizar la lista de usuarios
      setUsers(users.map(user => 
        user.uid === selectedUser.uid ? { ...user, ...updatedUserData } : user
      ))
      
      setIsModalOpen(false)
      setSelectedUser(null)
    } catch (err) {
      setError('Error al actualizar el usuario: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return
    }

    try {
      setLoading(true)
      await authApi.deleteUser(userId)
      
      // Eliminar el usuario de la lista
      setUsers(users.filter(user => user.uid !== userId))
      
      setIsModalOpen(false)
      setSelectedUser(null)
    } catch (err) {
      setError('Error al eliminar el usuario: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Intentando obtener usuarios...')
        const response = await authApi.findAll()
        console.log('Respuesta de usuarios:', response)
        
        // Verificar la estructura de la respuesta
        if (response && response.ok && Array.isArray(response.data)) {
          setUsers(response.data)
        } else if (response && response.data && Array.isArray(response.data)) {
          setUsers(response.data)
        } else {
          console.error('Estructura de respuesta inesperada:', response)
          throw new Error('Formato de respuesta inválido')
        }
      } catch (err) {
        console.error('Error al obtener usuarios:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser && (currentUser.role === 1 || currentUser.role === 'admin')) {
      fetchUsers()
    } else {
      setError('No tienes permisos para ver esta información')
      setLoading(false)
    }
  }, [currentUser])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando usuarios...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <span className={styles.errorTitle}>Error:</span>
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Usuario</th>
            <th className={styles.centered}>Rol</th>
            <th className={styles.centered}>Estado</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {Array.isArray(users) && users.length > 0 ? (
            users.map(user => (
              <tr key={user.uid} className={styles.tableRow}>
                <td>{user.uid}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={
                    user.role === 1 || user.role === 'admin' 
                      ? styles.adminBadge 
                      : styles.userBadge
                  }>
                    {user.role === 1 || user.role === 'admin' ? 'Admin' : 'Usuario'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={user.isActive ? styles.activeBadge : styles.inactiveBadge}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => handleEditClick(user)}
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.noData}>
                No hay usuarios para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
