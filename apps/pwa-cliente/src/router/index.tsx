// router/index.tsx — React Router v7, rutas protegidas

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/auth.store';
import { lazy, Suspense } from 'react';

const LoginScreen = lazy(() => import('../screens/login/LoginScreen').then(m => ({ default: m.LoginScreen })));
const MesasScreen = lazy(() => import('../screens/ops/MesasScreen').then(m => ({ default: m.MesasScreen })));
const PedidosScreen = lazy(() => import('../screens/ops/PedidosScreen').then(m => ({ default: m.PedidosScreen })));
const CocinaScreen = lazy(() => import('../screens/ops/CocinaScreen').then(m => ({ default: m.CocinaScreen })));
const DeliveryScreen = lazy(() => import('../screens/ops/DeliveryScreen').then(m => ({ default: m.DeliveryScreen })));
const CrearPedidoScreen = lazy(() => import('../screens/ops/CrearPedidoScreen').then(m => ({ default: m.CrearPedidoScreen })));
const CajaScreen = lazy(() => import('../screens/caja/CajaScreen').then(m => ({ default: m.CajaScreen })));
const ReservasScreen = lazy(() => import('../screens/reservas/ReservasScreen').then(m => ({ default: m.ReservasScreen })));
const InventarioScreen = lazy(() => import('../screens/inventario/InventarioScreen').then(m => ({ default: m.InventarioScreen })));
const ReportesScreen = lazy(() => import('../screens/reportes/ReportesScreen').then(m => ({ default: m.ReportesScreen })));
const UsuariosScreen = lazy(() => import('../screens/admin/UsuariosScreen').then(m => ({ default: m.UsuariosScreen })));
import { Shell } from '../components/layout/Shell';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';



// ─── Guard: redirige a /login si no está autenticado ────────────
function ProtectedRoute() {
  const authenticated = useAuthStore((s) => s.authenticated);
  if (!authenticated) return <Navigate to="/login" replace />;
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

// ─── Guard: redirige a /app si ya está autenticado ──────────────
function PublicRoute() {
  const authenticated = useAuthStore((s) => s.authenticated);
  if (authenticated) return <Navigate to="/app" replace />;
  return <Outlet />;
}

function ScreenLoading() {
  return (
    <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid var(--surface-hover)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ScreenBoundary({ modulo, children }: { modulo: string; children: ReactNode }) {
  return (
    <ErrorBoundary moduleName={modulo}>
      <Suspense fallback={<ScreenLoading />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// ─── Router principal ──────────────────────────────────────────
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Suspense fallback={<ScreenLoading />}><LoginScreen /></Suspense>} />
        </Route>

        {/* Rutas protegidas */}
        <Route path="/app" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="mesas" replace />} />
          <Route path="mesas" element={<ScreenBoundary modulo="Mesas"><MesasScreen /></ScreenBoundary>} />
          <Route path="pedidos" element={<ScreenBoundary modulo="Pedidos"><PedidosScreen /></ScreenBoundary>} />
          <Route path="crear-pedido" element={<ScreenBoundary modulo="Crear pedido"><CrearPedidoScreen /></ScreenBoundary>} />
          <Route path="cocina" element={<ScreenBoundary modulo="Cocina"><CocinaScreen /></ScreenBoundary>} />
          <Route path="delivery" element={<ScreenBoundary modulo="Delivery"><DeliveryScreen /></ScreenBoundary>} />
          <Route path="caja" element={<ScreenBoundary modulo="Caja"><CajaScreen /></ScreenBoundary>} />
          <Route path="reservas" element={<ScreenBoundary modulo="Reservas"><ReservasScreen /></ScreenBoundary>} />
          <Route path="inventario" element={<ScreenBoundary modulo="Inventario"><InventarioScreen /></ScreenBoundary>} />
          <Route path="reportes" element={<ScreenBoundary modulo="Reportes"><ReportesScreen /></ScreenBoundary>} />
          <Route path="usuarios" element={<ScreenBoundary modulo="Usuarios"><UsuariosScreen /></ScreenBoundary>} />
        </Route>


        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
