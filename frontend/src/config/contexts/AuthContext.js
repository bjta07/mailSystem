'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '../api/apiAuth'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Verificar token al cargar la app
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.log('No hay token, usuario no autenticado')
          setLoading(false)
          return
        }

        console.log('Verificando token...')
        const userData = await authApi.getProfile()
        console.log('Perfil obtenido:', userData)
        
        if (userData && userData.data) {
          setUser(userData.data)
        } else {
          console.log('Respuesta de perfil inválida')
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error)
        localStorage.removeItem('token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      console.log('Intentando login con:', credentials);
      
      const response = await authApi.login(credentials);
      console.log('Respuesta del login:', response);

      if (!response || !response.token) {
        throw new Error('Respuesta de login inválida');
      }

      // Guardar token y usuario
      localStorage.setItem('token', response.token);
      setUser(response.user);

      // Redirección basada en rol
      const redirectPath = response.user.role === 1 ? '/admin' : '/users';
      console.log('Redirigiendo a:', redirectPath);
      router.push(redirectPath);
      
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión'
      };
    }
  }

  const logout = () => {
    console.log('Cerrando sesión...')
    setUser(null)
    localStorage.removeItem('token')
    setLoading(false)
    router.push('/login')
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}