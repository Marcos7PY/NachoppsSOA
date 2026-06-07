// router/index.tsx — React Router v7, rutas protegidas

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/auth.store';
import { homeDeRol, puedeAcceder, type RutaApp } from '../auth/permisos';
import { lazy, Suspense } from 'react';

const LoginScreen = lazy(() => import('../screens/login/LoginScreen').then(m => ({ default: m.LoginScreen })));
const InicioScreen = lazy(() => import('../screens/inicio/InicioScreen').then(m => ({ default: m.InicioScreen })));
const MesasScreen = lazy(() => import('../screens/ops/MesasScreen').then(m => ({ default: m.MesasScreen })));
const PedidosScreen = lazy(() => import('../screens/ops/PedidosScreen').then(m => ({ default: m.PedidosScreen })));
const CocinaScreen = lazy(() => import('../screens/ops/CocinaScreen').then(m => ({ default: m.CocinaScreen })));
const CajaScreen = lazy(() => import('../screens/caja/CajaScreen').then(m => ({ default: m.CajaScreen })));
const ReservasScreen = lazy(() => import('../screens/reservas/ReservasScreen').then(m => ({ default: m.ReservasScreen })));
const InventarioScreen = lazy(() => import('../screens/inventario/InventarioScreen').then(m => ({ default: m.InventarioScreen })));
const ReportesScreen = lazy(() => import('../screens/reportes/ReportesScreen').then(m => ({ default: m.ReportesScreen })));
const UsuariosScreen = lazy(() => import('../screens/admin/UsuariosScreen').then(m => ({ default: m.UsuariosScreen })));
const CartaScreen = lazy(() => import('../screens/carta/CartaScreen').then(m => ({ default: m.CartaScreen })));
const ComprasScreen = lazy(() => import('../screens/compras/ComprasScreen').then(m => ({ default: m.ComprasScreen })));
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

// ─── Índice de /app: aterriza cada rol en su vista "home" ───────
function IndicePorRol() {
  const rol = useAuthStore((s) => s.user?.rol);
  return <Navigate to={homeDeRol(rol)} replace />;
}

// ─── Guard por rol: bloquea rutas no permitidas para el rol ─────
// Si el rol no puede abrir esta ruta (p. ej. la escribió en la URL),
// se le redirige silenciosamente a su vista "home".
function RutaPorRol({ ruta, children }: { ruta: RutaApp; children: ReactNode }) {
  const rol = useAuthStore((s) => s.user?.rol);
  if (!puedeAcceder(rol, ruta)) return <Navigate to={`/app/${homeDeRol(rol)}`} replace />;
  return <>{children}</>;
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
          <Route index element={<IndicePorRol />} />
          <Route path="inicio" element={<RutaPorRol ruta="inicio"><ScreenBoundary modulo="Inicio"><InicioScreen /></ScreenBoundary></RutaPorRol>} />
          <Route path="mesas" element={<RutaPorRol ruta="mesas"><ScreenBoundary modulo="Mesas"><MesasScreen /></ScreenBoundary></RutaPorRol>} />
          <Route path="pedidos" element={<RutaPorRol ruta="pedidos"><ScreenBoundary modulo="Pedidos"><PedidosScreen /></ScreenBoundary></RutaPorRol>} />
          <Route path="cocina" element={<RutaPorRol ruta="cocina"><ScreenBoundary modulo="Cocina"><CocinaScreen /></ScreenBoundary></RutaPorRol>} />
          {/* "delivery" y "crear-pedido" se fusionaron en el hub Pedidos + Comandero */}
          <Route path="delivery" element={<Navigate to="/app/pedidos" replace />} />
          <Route path="crear-pedido" element={<Navigate to="/app/pedidos" replace />} />
          <Route path="caja" element={<RutaPorRol ruta="caja"><ScreenBoundary modulo="Caja"><CajaScreen /></ScreenBoundary></RutaPorRol>} />
          <Route path="reservas" element={<RutaPorRol ruta="reservas"><ScreenBoundary modulo="Reservas"><ReservasScreen /></ScreenBoundary></RutaPorRol>} />
          <Route path="inventario" element={<RutaPorRol ruta="inventario"><ScreenBoundary modulo="Inventario"><InventarioScreen /></ScreenBoundary></RutaPorRol>} />
          <Route path="reportes" element={<RutaPorRol ruta="reportes"><ScreenBoundary modulo="Reportes"><ReportesScreen /></ScreenBoundary></RutaPorRol>} />
          <Route path="usuarios" element={<RutaPorRol ruta="usuarios"><ScreenBoundary modulo="Usuarios"><UsuariosScreen /></ScreenBoundary></RutaPorRol>} />
          <Route path="carta" element={<RutaPorRol ruta="carta"><ScreenBoundary modulo="Carta"><CartaScreen /></ScreenBoundary></RutaPorRol>} />
          <Route path="compras" element={<RutaPorRol ruta="compras"><ScreenBoundary modulo="Compras"><ComprasScreen /></ScreenBoundary></RutaPorRol>} />
        </Route>


        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
