import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../views/Login/Login';
import { Dashboard } from '../views/Dashboard/Dashboard';
import { Reservas } from '../views/Reservas/Reservas';
import { Inventario } from '../views/Inventario/Inventario';
import { Mesas } from '../views/Mesas/Mesas';
import { Pedidos } from '../views/Pedidos/Pedidos';
import { Caja } from '../views/Caja/Caja';
import { Cocina } from '../views/Cocina/Cocina';
import { Auditoria } from '../views/Auditoria/Auditoria';
import { ControlCaja } from '../views/ControlCaja/ControlCaja';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/mesas" element={<Mesas />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/caja" element={<Caja />} />
            <Route path="/cocina" element={<Cocina />} />
            <Route path="/auditoria" element={<Auditoria />} />
            <Route path="/control-caja" element={<ControlCaja />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
