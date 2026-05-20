import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../views/Login/Login';
import { Dashboard } from '../views/Dashboard/Dashboard';
import { Reservas } from '../views/Reservas/Reservas';
import { ProtectedRoute } from '../components/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reservas" element={<Reservas />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
