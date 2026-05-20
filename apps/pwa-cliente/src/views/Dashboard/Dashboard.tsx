import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Utensils, LayoutDashboard, CalendarDays, Package, LayoutGrid, Banknote } from 'lucide-react';
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
          onClick={() => navigate('/caja')}
        >
          <h2 className={styles.cardTitle}>
            <Banknote size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Caja y Facturación
          </h2>
          <p className={styles.cardText}>
            Registra pagos, realiza arqueos y visualiza las ventas del día.
          </p>
        </div>

        <div 
          className={styles.card} 
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--color-accent)' }}
          onClick={() => navigate('/pedidos')}
        >
          <h2 className={styles.cardTitle}>
            <Utensils size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Comandas y Pedidos
          </h2>
          <p className={styles.cardText}>
            Toma pedidos, añade modificadores y gestiona las cuentas de las mesas.
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

        <div 
          className={styles.card} 
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--color-accent)' }}
          onClick={() => navigate('/inventario')}
        >
          <h2 className={styles.cardTitle}>
            <Package size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Menú e Inventario
          </h2>
          <p className={styles.cardText}>
            Gestiona los productos, categorías, precios y controla el stock.
          </p>
        </div>

        <div 
          className={styles.card} 
          style={{ cursor: 'pointer', borderLeft: '4px solid var(--color-accent)' }}
          onClick={() => navigate('/mesas')}
        >
          <h2 className={styles.cardTitle}>
            <LayoutGrid size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Mesas y Salón
          </h2>
          <p className={styles.cardText}>
            Visualiza el mapa de mesas y gestiona su estado en tiempo real.
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
