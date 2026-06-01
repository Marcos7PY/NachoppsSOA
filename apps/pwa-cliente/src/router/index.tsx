// router/index.tsx — React Router v7, rutas protegidas

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/auth.store';
import { LoginScreen } from '../screens/login/LoginScreen';
import { MesasScreen } from '../screens/ops/MesasScreen';
import { PedidosScreen } from '../screens/ops/PedidosScreen';
import { CocinaScreen } from '../screens/ops/CocinaScreen';
import { DeliveryScreen } from '../screens/ops/DeliveryScreen';
import { CrearPedidoScreen } from '../screens/ops/CrearPedidoScreen';
import { CajaScreen } from '../screens/caja/CajaScreen';
import { ReservasScreen } from '../screens/reservas/ReservasScreen';
import { InventarioScreen } from '../screens/inventario/InventarioScreen';
import { ReportesScreen } from '../screens/reportes/ReportesScreen';
import { UsuariosScreen } from '../screens/admin/UsuariosScreen';
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

function ScreenBoundary({ modulo, children }: { modulo: string; children: ReactNode }) {
  return <ErrorBoundary moduleName={modulo}>{children}</ErrorBoundary>;
}

// ─── Router principal ──────────────────────────────────────────
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginScreen />} />
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
