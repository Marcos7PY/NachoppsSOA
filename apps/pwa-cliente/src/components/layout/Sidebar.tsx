// components/layout/Sidebar.tsx — Navegación lateral

import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    group: 'Operación',
    items: [
      { key: 'mesas', label: 'Mesas', icon: <MesasIcon /> },
      { key: 'pedidos', label: 'Pedidos', icon: <PedidosIcon /> },
      { key: 'cocina', label: 'Cocina', icon: <CocinaIcon /> },
      { key: 'delivery', label: 'Delivery & Llevar', icon: <DeliveryIcon /> },
      { key: 'caja', label: 'Caja', icon: <CajaIcon /> },
      { key: 'reservas', label: 'Reservas', icon: <ReservasIcon /> },

    ],
  },
  {
    group: 'Administración',
    items: [
      { key: 'inventario', label: 'Inventario', icon: <InventarioIcon /> },
      { key: 'reportes', label: 'Reportes', icon: <ReportesIcon /> },
      { key: 'usuarios', label: 'Usuarios', icon: <UsuariosIcon /> },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extraer la key activa del pathname: /app/mesas → mesas
  const activeKey = location.pathname.split('/')[2] ?? '';

  const go = (key: string) => {
    navigate(`/app/${key}`);
  };

  return (
    <nav className="sidebar">
      <div className="brand">
        <div className="brand-logo">N</div>
        <div>
          <b>NachoPps</b>
          <small>Barranco · Lima</small>
        </div>
      </div>

      <div className="nav">
        {NAV.map((g) => (
          <div key={g.group}>
            <div className="nav-lbl">{g.group}</div>
            {g.items.map((it) => (
              <button
                key={it.key}
                className={`nav-item ${activeKey === it.key ? 'on' : ''}`}
                onClick={() => go(it.key)}
              >
                {it.icon}
                <span>{it.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="nav-foot">
        <button className="nav-item" onClick={() => go('mesas')} title="Buscar">
          <SearchIcon />
          <span>Buscar</span>
          <span className="kbd" style={{ marginLeft: 'auto' }}>⌘K</span>
        </button>
      </div>
    </nav>
  );
}

// ─── Inline SVG Nav Icons (18×18) ───────────────────────────────

function MesasIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function PedidosIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 18v-4" /><path d="M14 18v-6" />
    </svg>
  );
}

function CocinaIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20a8 8 0 0 0 8-8h-8Z" /><path d="M12 20a8 8 0 0 1-8-8h8Z" /><path d="M12 20V4" /><path d="M4 12h16" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}


function CajaIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" />
    </svg>
  );
}

function ReservasIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
    </svg>
  );
}

function InventarioIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  );
}

function ReportesIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function UsuariosIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
