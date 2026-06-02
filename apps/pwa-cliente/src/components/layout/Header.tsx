// components/layout/Header.tsx — Topbar con info de usuario y logout

import { useAuthStore } from '../../store/auth.store';
import { getTurnoActual } from '../../config';
import { useNotificacionesQuery } from '../../hooks/queries/useNotificacionesQuery';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { notificaciones, markAllRead } = useNotificacionesQuery();
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const hora = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
  const turnoLabel = getTurnoActual(now);
  const connLabel = online ? 'En línea' : 'Sin conexión';
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setTheme(next);
    localStorage.setItem('nachopps-theme', next);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const unreadCount = useMemo(
    () => notificaciones.filter((item) => item.unread).length,
    [notificaciones],
  );

  const toggleNotifications = () => {
    setNotificationsOpen((current) => {
      const next = !current;
      if (next) markAllRead();
      return next;
    });
  };

  const initials = user
    ? user.nombre
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <header className="topbar">
      <span className="top-loc">Resto Barranco</span>
      <span className="top-turno">{turnoLabel} · {hora}</span>
      <span className="spacer" />

      {/* Indicador de conexión */}
      <span className={`conn ${online ? 'online' : 'offline'}`} title={connLabel}>
        <span className="conn-dot" />
        {connLabel}
      </span>

      {/* Theme toggle */}
      <button className="icon-btn" onClick={toggleTheme} title="Tema claro/oscuro">
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="notif-wrap">
        <button className="icon-btn" onClick={toggleNotifications} title="Notificaciones">
          <BellIcon />
          {unreadCount > 0 && <span className="bdg danger">{Math.min(unreadCount, 9)}</span>}
        </button>
        {notificationsOpen && (
          <div className="notif-popover">
            <div className="panel-h">
              <h3>Notificaciones</h3>
              <span className="spacer" />
              <span className="badge badge-muted">{notificaciones.length}</span>
            </div>
            {notificaciones.length === 0 ? (
              <div className="empty empty-compact">
                <div className="e-ic"><BellIcon /></div>
                <h3>Sin notificaciones</h3>
                <p>Las actualizaciones del backend aparecerán aquí.</p>
              </div>
            ) : (
              <div className="notif-list">
                {notificaciones.slice(0, 8).map((item) => (
                  <div key={item.id} className={`notif ${item.unread ? 'unread' : ''}`}>
                    <div className="n-ic badge-info"><BellIcon /></div>
                    <div>
                      <b>{item.titulo}</b>
                      <p>{item.contenido}</p>
                      <div className="n-time">{item.timestampLabel} · {item.canal}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User chip */}
      {user && (
        <div className="user-chip">
          <div className="ava">{initials}</div>
          <div>
            <b>{user.nombre}</b>
            <small>{user.rol}</small>
          </div>
        </div>
      )}

      {/* Logout */}
      <button className="icon-btn" onClick={handleLogout} title="Cerrar sesión">
        <LogoutIcon />
      </button>
    </header>
  );
}

// ─── Inline SVG icons ──────────────────────────────────────────

function SunIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </svg>
  );
}
