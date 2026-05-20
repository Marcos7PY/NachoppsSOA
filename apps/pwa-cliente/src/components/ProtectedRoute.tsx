import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

/**
 * Componente que protege las rutas privadas.
 * Si el usuario no está autenticado, lo redirige al Login.
 * Si está autenticado, renderiza las rutas hijas (<Outlet />).
 */
export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
