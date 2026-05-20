import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Utensils, LayoutDashboard, CalendarDays } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Utensils size={32} className={styles.brandIcon} />
          <h1>NachoPps</h1>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userText}>
            <div className={styles.userName}>Hola, {usuario?.nombre}</div>
            <div className={styles.userRole}>{usuario?.rol?.toLowerCase()}</div>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={18} /> Salir
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <LayoutDashboard size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Bienvenido al Sistema
          </h2>
          <p className={styles.cardText}>
            Has iniciado sesión exitosamente mediante el API Gateway (Kong) y el servicio de Identidad.
            El token JWT se inyectará automáticamente en todas las peticiones futuras.
          </p>
        </div>
        
        <div 
          className={styles.card} 
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--color-accent)' }}
          onClick={() => navigate('/reservas')}
        >
          <h2 className={styles.cardTitle}>
            <CalendarDays size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Módulo de Reservas
          </h2>
          <p className={styles.cardText}>
            Gestiona las reservaciones, confirma asistencias y crea nuevos apartados de mesa.
          </p>
        </div>
        
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Tu Perfil</h2>
          <p className={styles.cardText}>
            <strong>Email:</strong> {usuario?.email}<br/>
            <strong>ID:</strong> {usuario?.id}
          </p>
        </div>
      </main>
    </div>
  );
};
