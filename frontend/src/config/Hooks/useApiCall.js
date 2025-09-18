import { useState } from 'react'

export const useApiCall = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = async (apiFunction, ...args) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiFunction(...args)
      return { success: true, data: result }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, execute }
}