import { useLocation, useNavigate } from 'react-router-dom';
import { puedeAcceder } from '../../auth/permisos';
import { useAuthStore } from '../../store/auth.store';
import { Icons } from '../ui/icons';
import { NAV_ITEMS } from './navigation';
import { useEffect, useRef, useState } from 'react';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const rol = useAuthStore((s) => s.user?.rol);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const activeKey = location.pathname.split('/')[2] ?? '';

  const allowedItems = NAV_ITEMS
    .filter((item) => puedeAcceder(rol, item.key))
    .sort((a, b) => a.priority - b.priority);

  const hasOverflow = allowedItems.length > 5;
  const primaryItems = hasOverflow ? allowedItems.slice(0, 4) : allowedItems;
  const overflowItems = hasOverflow ? allowedItems.slice(4) : [];
  const overflowActive = overflowItems.some((item) => item.key === activeKey);

  useEffect(() => {
    if (!moreOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  if (allowedItems.length <= 1) return null;

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {primaryItems.map((item) => {
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
      {hasOverflow && (
        <div className="bn-more-wrap" ref={moreRef}>
          {moreOpen && (
            <div className="bn-more-panel" role="menu" aria-label="Más módulos">
              {overflowItems.map((item) => {
                const Icon = Icons[item.icon];
                const active = activeKey === item.key;
                return (
                  <button
                    key={item.key}
                    className={`bn-more-item ${active ? 'on' : ''}`}
                    type="button"
                    role="menuitem"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => navigate(`/app/${item.key}`)}
                  >
                    <Icon s={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
          <button
            className={`bn-item ${overflowActive || moreOpen ? 'on' : ''}`}
            type="button"
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            aria-label="Más módulos"
            onClick={() => setMoreOpen((current) => !current)}
          >
            <Icons.Plus s={20} />
            <span>Más</span>
          </button>
        </div>
      )}
    </nav>
  );
}
