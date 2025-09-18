'use client'

import React, { useState } from 'react';
import styles from '@/styles/login.module.css';
import { useAuth } from '@/config/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  // Estados principales
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para efectos visuales de inputs
  const [focusedInputs, setFocusedInputs] = useState({
    username: false,
    password: false
  });

  // Manejar focus de inputs
  const handleInputFocus = (inputName) => {
    setFocusedInputs(prev => ({ ...prev, [inputName]: true }));
    setError(''); // Limpiar error cuando el usuario intenta de nuevo
  };

  // Manejar blur de inputs
  const handleInputBlur = (inputName, value) => {
    if (!value) {
      setFocusedInputs(prev => ({ ...prev, [inputName]: false }));
    }
  };

  // Manejar cambios en inputs
  const handleInputChange = (inputName, value) => {
    setCredentials(prev => ({ ...prev, [inputName]: value }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(credentials);

      console.log('Login result:', result); // Para debugging

      if (!result.success) {
        setError(result.error || 'Error al iniciar sesión');
      }
      // Si el login es exitoso, el contexto maneja la redirección
      // No necesitas hacer la redirección aquí
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message || 'Error al iniciar sesión. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Obtener clase CSS para inputs
  const getInputFieldClass = (inputName) => {
    let className = styles.inputField;
    if (focusedInputs[inputName] || credentials[inputName]) {
      className += ` ${styles.focused}`;
    }
    if (credentials[inputName]) {
      className += ` ${styles.hasValue}`;
    }
    return className;
  };

  return (
    <div className={styles.body}>
      <div className={styles.wrapper}>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h2 className={styles.title}>Sistema de Correspondencia</h2>
          
          <div className={getInputFieldClass('username')}>
            <input 
              type="text" 
              required
              value={credentials.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onFocus={() => handleInputFocus('username')}
              onBlur={(e) => handleInputBlur('username', e.target.value)}
              disabled={loading}
            />
            <label>Enter your username</label>
          </div>

          <div className={getInputFieldClass('password')}>
            <input 
              type="password" 
              required
              value={credentials.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onFocus={() => handleInputFocus('password')}
              onBlur={(e) => handleInputBlur('password', e.target.value)}
              disabled={loading}
            />
            <label>Enter your password</label>
          </div>

          <div className={styles.forget}>
            <label htmlFor="remember" className={styles.forgetLabel}>
              <input 
                type="checkbox" 
                id="remember"
                className={styles.checkbox}
                disabled={loading}
              />
              <p>Remember me</p>
            </label>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Log In'}
          </button>

          <div className={styles.register}>
            <p>
              Don't have an account? 
              <a href="#" onClick={(e) => e.preventDefault()}>
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}