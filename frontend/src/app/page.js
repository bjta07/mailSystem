'use client'

import React from 'react';
import styles from '@/styles/login.module.css';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [focusedInputs, setFocusedInputs] = React.useState({
    username: false,
    password: false
  });

  const [inputValues, setInputValues] = React.useState({
    username: '',
    password: ''
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleInputFocus = (inputName) => {
    setFocusedInputs(prev => ({ ...prev, [inputName]: true }));
    setError(''); // Limpiar error cuando el usuario intenta de nuevo
  };

  const handleInputBlur = (inputName, value) => {
    if (!value) {
      setFocusedInputs(prev => ({ ...prev, [inputName]: false }));
    }
  };

  const handleInputChange = (inputName, value) => {
    setInputValues(prev => ({ ...prev, [inputName]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.login({
        username: inputValues.username,
        password: inputValues.password,
      });

      console.log('Login response:', response); // Para debugging

      if (response && response.token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', response.token);
        
        // Guardar los datos del usuario
        localStorage.setItem('user', JSON.stringify(response.user));

        // Redirigir según rol
        if (response.user.role  === 1) {
          router.push('/admin');
        } else {
          router.push('/users');
        }
      } else {
        setError('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message || 'Error al iniciar sesión. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };



  const getInputFieldClass = (inputName) => {
    let className = styles.inputField;
    if (focusedInputs[inputName]) {
      className += ` ${styles.focused}`;
    }
    if (inputValues[inputName]) {
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
              value={inputValues.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onFocus={() => handleInputFocus('username')}
              onBlur={(e) => handleInputBlur('username', e.target.value)}
            />
            <label>Enter your username</label>
          </div>

          <div className={getInputFieldClass('password')}>
            <input 
              type="password" 
              required
              value={inputValues.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onFocus={() => handleInputFocus('password')}
              onBlur={(e) => handleInputBlur('password', e.target.value)}
            />
            <label>Enter your password</label>
          </div>

          <div className={styles.forget}>
            <label htmlFor="remember" className={styles.forgetLabel}>
              <input 
                type="checkbox" 
                id="remember"
                className={styles.checkbox}
              />
              <p>Remember me</p>
            </label>
            <a href="#">Forgot password?</a>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Log In'}
          </button>

          <div className={styles.register}>
            <p>
              Don't have an account? <a href="#">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}