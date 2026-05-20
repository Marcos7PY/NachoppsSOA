import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../store/auth.store';
import styles from './Login.module.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Llamada al endpoint de login a través de Kong
      const { data } = await apiClient.post('/identidad/auth/login', {
        email,
        password,
      });

      // Guardar token y usuario en el store (y localStorage)
      setSession(data.access_token, data.usuario);
      
      // Redirigir al dashboard
      navigate('/');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else {
        setError('Error al conectar con el servidor. Intenta de nuevo más tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        
        <div className={styles.logoContainer}>
          <Utensils size={48} className={styles.logoIcon} />
          <h1 className={styles.title}>NachoPps</h1>
          <p className={styles.subtitle}>Sistema de Gestión Integral</p>
        </div>

        {error && <div className={styles.errorText}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Correo Electrónico</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                type="email"
                className={styles.input}
                placeholder="ejemplo@nachopps.pe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contraseña</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? (
              <Loader2 size={20} className={styles.spinner} />
            ) : (
              <>
                Iniciar Sesión <LogIn size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
