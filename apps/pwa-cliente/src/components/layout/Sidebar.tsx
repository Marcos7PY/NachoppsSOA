// components/layout/Sidebar.tsx — Navegación lateral (estructura del prototipo)

import { useLocation, useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../../config';
import { useAuthStore } from '../../store/auth.store';
import { puedeAcceder } from '../../auth/permisos';
import { Icons } from '../ui/icons';
import { NAV_GROUPS } from './navigation';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const rol = useAuthStore((s) => s.user?.rol);

  // Extraer la key activa del pathname: /app/mesas → mesas
  const activeKey = location.pathname.split('/')[2] ?? '';

  const go = (key: string) => navigate(`/app/${key}`);

  // Solo se muestran las entradas que el rol puede abrir; los grupos que
  // quedan vacíos se ocultan por completo.
  const navVisible = NAV_GROUPS
    .map((g) => ({ ...g, items: g.items.filter((it) => puedeAcceder(rol, it.key)) }))
    .filter((g) => g.items.length > 0);

  return (
    <nav className="sidebar">
      <div className="brand">
        <div className="brand-logo">{APP_CONFIG.nombreLocal.charAt(0)}</div>
        <div>
          <b>{APP_CONFIG.nombreLocal}</b>
          <small>{APP_CONFIG.ubicacionLocal}</small>
        </div>
      </div>

      <div className="nav">
        {navVisible.map((g) => (
          <div key={g.group}>
            <div className="nav-lbl">{g.group}</div>
            {g.items.map((it) => {
              const Ic = Icons[it.icon];
              const on = activeKey === it.key;
              return (
                <button
                  key={it.key}
                  className={`nav-item ${on ? 'on' : ''}`}
                  onClick={() => go(it.key)}
                >
                  <Ic s={18} />
                  <span>{it.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="nav-foot">
        <div className="hint" style={{ padding: '4px 8px', lineHeight: 1.5 }}>
          {APP_CONFIG.nombreLocal} · Operación
        </div>
      </div>
    </nav>
  );
}
