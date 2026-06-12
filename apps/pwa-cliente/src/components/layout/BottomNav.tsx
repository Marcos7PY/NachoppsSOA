import { useLocation, useNavigate } from 'react-router-dom';
import { puedeAcceder } from '../../auth/permisos';
import { useAuthStore } from '../../store/auth.store';
import { Icons } from '../ui/icons';
import { NAV_ITEMS } from './navigation';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const rol = useAuthStore((s) => s.user?.rol);
  const activeKey = location.pathname.split('/')[2] ?? '';

  const visibleItems = NAV_ITEMS
    .filter((item) => puedeAcceder(rol, item.key))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);

  if (visibleItems.length <= 1) return null;

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {visibleItems.map((item) => {
        const Icon = Icons[item.icon];
        const active = activeKey === item.key;
        return (
          <button
            key={item.key}
            className={`bn-item ${active ? 'on' : ''}`}
            type="button"
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(`/app/${item.key}`)}
          >
            <Icon s={20} />
            <span>{item.shortLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}
