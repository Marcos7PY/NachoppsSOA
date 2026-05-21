import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  CalendarDays, 
  Package, 
  LayoutGrid, 
  Banknote,
  Settings,
  LogOut,
  ChefHat
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

export const Sidebar = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const clearSession = useAuthStore((state) => state.clearSession);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Pedidos y Comandas', href: '/pedidos', icon: Utensils },
    { name: 'Monitor de Cocina', href: '/cocina', icon: ChefHat },
    { name: 'Caja y Pagos', href: '/caja', icon: Banknote },
    { name: 'Mapa de Mesas', href: '/mesas', icon: LayoutGrid },
    { name: 'Reservas', href: '/reservas', icon: CalendarDays },
    { name: 'Inventario', href: '/inventario', icon: Package },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-[#1e3932] text-white transition-all duration-300 shadow-xl">
      <div className="flex h-16 shrink-0 items-center gap-3 px-6 bg-black/10 border-b border-white/10">
        <div className="bg-primary-foreground text-primary p-1.5 rounded-lg">
          <Utensils className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">NachoPps</span>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1">
          <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 px-2">Menu Principal</div>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon
                className="h-5 w-5 shrink-0 opacity-80"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10 p-4 bg-black/5">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 font-bold uppercase text-sm">
            {usuario?.nombre?.substring(0, 2) || 'US'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{usuario?.nombre || 'Usuario'}</span>
            <span className="text-xs text-white/50 capitalize">{usuario?.rol?.toLowerCase() || 'Admin'}</span>
          </div>
        </div>
        <button 
          onClick={() => clearSession()}
          className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};
