import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  NotebookPen,
  ChefHat,
  Banknote,
  Receipt,
  Square,
  CalendarDays,
  Package,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { cn } from '../../lib/utils';

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles: string[];
}

const navigation: NavItem[] = [
  { title: 'Dashboard', url: '/', icon: LayoutGrid, roles: ['ADMIN'] },
  { title: 'Pedidos', url: '/pedidos', icon: NotebookPen, roles: ['ADMIN', 'MESERO', 'CAJERO'] },
  { title: 'Cocina', url: '/cocina', icon: ChefHat, roles: ['ADMIN', 'COCINA'] },
  { title: 'Caja', url: '/caja', icon: Banknote, roles: ['ADMIN', 'CAJERO'] },
  { title: 'Control Caja', url: '/control-caja', icon: Receipt, roles: ['ADMIN', 'CAJERO'] },
  { title: 'Mesas', url: '/mesas', icon: Square, roles: ['ADMIN'] },
  { title: 'Reservas', url: '/reservas', icon: CalendarDays, roles: ['ADMIN'] },
  { title: 'Inventario', url: '/inventario', icon: Package, roles: ['ADMIN'] },
  { title: 'Auditoría', url: '/auditoria', icon: Shield, roles: ['ADMIN'] },
];

export function NavMain({ collapsed }: { collapsed: boolean }) {
  const { usuario } = useAuthStore();
  const location = useLocation();

  const allowedNavigation = navigation.filter(
    (item) => !usuario || item.roles.includes(usuario.rol)
  );

  return (
    <nav className="flex flex-col gap-1 px-2">
      {!collapsed && (
        <h2 className="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
          Menú Principal
        </h2>
      )}
      {allowedNavigation.map((item) => {
        const isActive = item.url === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.url);

        return (
          <NavLink
            key={item.url}
            to={item.url}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
}
