// components/layout/Header.tsx — Topbar: turno, conexión, tema, accesibilidad,
// notificaciones (backend), usuario y logout.

import { useAuthStore } from '../../store/auth.store';
import { APP_CONFIG, getTurnoActual } from '../../config';
import { useNotificacionesQuery } from '../../hooks/queries/useNotificacionesQuery';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { applyThemeColor } from '../../utils/theme';
import { Icons } from '../ui/icons';

type Theme = 'light' | 'dark';
type Density = 'comfy' | 'compact';
type FontScale = 'md' | 'lg' | 'xl';
type Contrast = 'normal' | 'high';

function readAttr<T extends string>(attr: string, fallback: T): T {
  return (document.documentElement.getAttribute(attr) as T) || fallback;
}

function applyAttr<T extends string>(attr: string, storageKey: string, value: T, setter: (v: T) => void) {
  document.documentElement.setAttribute(attr, value);
  localStorage.setItem(storageKey, value);
  setter(value);
}

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { notificaciones, markAllRead } = useNotificacionesQuery();
  const navigate = useNavigate();
  const online = useOnlineStatus();

  const [now, setNow] = useState(() => new Date());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  useFocusTrap(settingsRef, { active: settingsOpen, onClose: () => setSettingsOpen(false) });
  const [theme, setTheme] = useState<Theme>(() => readAttr('data-theme', 'light'));
  const [density, setDensity] = useState<Density>(() => readAttr('data-density', 'comfy'));
  const [fontscale, setFontscale] = useState<FontScale>(() => readAttr('data-fontscale', 'md'));
  const [contrast, setContrast] = useState<Contrast>(() => readAttr('data-contrast', 'normal'));

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const hora = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
  const turnoLabel = getTurnoActual(now);
  const connLabel = online ? 'En línea' : 'Sin conexión';

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset['theme'] = next;
    localStorage.setItem('nachopps-theme', next);
    applyThemeColor(next);
    setTheme(next);
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
    setSettingsOpen(false);
    setNotificationsOpen((current) => {
      // Marcar como leídas al CERRAR (cuando el usuario ya las pudo ver),
      // no al abrir: así el contador no desaparece antes de leerlas.
      if (current && unreadCount > 0) markAllRead();
      return !current;
    });
  };

  const initials = user
    ? user.nombre.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="topbar">
      <span className="top-loc">{APP_CONFIG.nombreLocal}</span>
      <span className="top-turno">{turnoLabel} · {hora}</span>
      <span className="spacer" />

      {/* Indicador de conexión */}
      <span className={`conn ${online ? 'online' : 'offline'}`} title={connLabel} role="status" aria-live="polite">
        <span className="conn-dot" />
        {connLabel}
      </span>

      {/* Accesibilidad / vista */}
      <div style={{ position: 'relative' }}>
        <button
          className={`icon-btn ${settingsOpen ? 'on' : ''}`}
          onClick={() => { setNotificationsOpen(false); setSettingsOpen((x) => !x); }}
          title="Vista y accesibilidad"
          aria-label="Vista y accesibilidad"
          aria-expanded={settingsOpen}
          aria-haspopup="dialog"
        >
          <Icons.Layers s={18} />
        </button>
        {settingsOpen && (
          <div ref={settingsRef}>
            <button type="button" aria-label="Cerrar" tabIndex={-1} style={{ position: 'fixed', inset: 0, zIndex: 89, background: 'transparent', border: 'none', padding: 0, cursor: 'default', appearance: 'none' }} onClick={() => setSettingsOpen(false)} />
            <dialog open className="settings-pop" aria-modal="true" aria-label="Vista y accesibilidad">
              <div className="sp-row">
                <span className="sp-lbl">Densidad</span>
                <div className="seg sm" style={{ width: '100%' }}>
                  <button className={density === 'comfy' ? 'on' : ''} style={{ flex: 1 }} onClick={() => applyAttr('data-density', 'nachopps-density', 'comfy', setDensity)}>Cómoda</button>
                  <button className={density === 'compact' ? 'on' : ''} style={{ flex: 1 }} onClick={() => applyAttr('data-density', 'nachopps-density', 'compact', setDensity)}>Compacta</button>
                </div>
              </div>
              <div className="sp-row">
                <span className="sp-lbl">Tamaño de texto</span>
                <div className="seg sm" style={{ width: '100%' }}>
                  <button className={fontscale === 'md' ? 'on' : ''} style={{ flex: 1 }} onClick={() => applyAttr('data-fontscale', 'nachopps-fontscale', 'md', setFontscale)}>A</button>
                  <button className={fontscale === 'lg' ? 'on' : ''} style={{ flex: 1, fontSize: 15 }} onClick={() => applyAttr('data-fontscale', 'nachopps-fontscale', 'lg', setFontscale)}>A</button>
                  <button className={fontscale === 'xl' ? 'on' : ''} style={{ flex: 1, fontSize: 17 }} onClick={() => applyAttr('data-fontscale', 'nachopps-fontscale', 'xl', setFontscale)}>A</button>
                </div>
              </div>
              <div className="sp-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="sp-lbl" style={{ marginBottom: 0 }}>Alto contraste</span>
                <button
                  className={`toggle ${contrast === 'high' ? 'on' : ''}`}
                  onClick={() => applyAttr('data-contrast', 'nachopps-contrast', contrast === 'high' ? 'normal' : 'high', setContrast)}
                >
                  <span className="knob" />
                </button>
              </div>
            </dialog>
          </div>
        )}
      </div>

      {/* Theme toggle */}
      <button
        className="icon-btn"
        onClick={toggleTheme}
        title="Tema claro/oscuro"
        aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        aria-pressed={theme === 'dark'}
      >
        {theme === 'dark' ? <Icons.Sun s={18} /> : <Icons.Moon s={18} />}
      </button>

      {/* Notificaciones (backend) */}
      <div className="notif-wrap">
        <button
          className="icon-btn"
          onClick={toggleNotifications}
          title="Notificaciones"
          aria-label={unreadCount > 0 ? `Notificaciones, ${unreadCount} sin leer` : 'Notificaciones'}
          aria-expanded={notificationsOpen}
          aria-haspopup="dialog"
        >
          <Icons.Bell s={18} />
          {unreadCount > 0 && <span className="bdg danger">{Math.min(unreadCount, 9)}</span>}
        </button>
        {notificationsOpen && (
          <>
          <button type="button" aria-label="Cerrar" tabIndex={-1} style={{ position: 'fixed', inset: 0, zIndex: 89, background: 'transparent', border: 'none', padding: 0, cursor: 'default', appearance: 'none' }} onClick={() => setNotificationsOpen(false)} />
          <dialog open className="notif-popover" aria-label="Notificaciones">
            <div className="panel-h">
              <h3>Notificaciones</h3>
              <span className="spacer" />
              {unreadCount > 0 && (
                <button className="btn btn-sm btn-ghost" onClick={() => markAllRead()}>Marcar leídas</button>
              )}
              <span className="badge badge-muted">{notificaciones.length}</span>
            </div>
            {notificaciones.length === 0 ? (
              <div className="empty empty-compact">
                <div className="e-ic"><Icons.Bell s={22} /></div>
                <h3>Sin notificaciones</h3>
                <p>Las actualizaciones del backend aparecerán aquí.</p>
              </div>
            ) : (
              <div className="notif-list">
                {notificaciones.slice(0, 8).map((item) => (
                  <div key={item.id} className={`notif ${item.unread ? 'unread' : ''}`}>
                    <div className="n-ic badge-info"><Icons.Bell s={18} /></div>
                    <div>
                      <b>{item.titulo}</b>
                      <p>{item.contenido}</p>
                      <div className="n-time">{item.timestampLabel} · {item.canal}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </dialog>
          </>
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
      <button className="icon-btn" onClick={handleLogout} title="Cerrar sesión" aria-label="Cerrar sesión">
        <Icons.Logout s={18} />
      </button>
    </header>
  );
}
