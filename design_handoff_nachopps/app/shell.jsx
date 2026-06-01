// shell.jsx — app chrome: sidebar, topbar, bottom nav, notifications, command palette.
(function () {
  const { useState, useEffect, useRef, useMemo } = React;
  const Icon = window.Icon;
  const { Badge, Drawer } = window;

  const NAV = [
    { group: 'Operación', items: [
      { key: 'mesas', label: 'Mesas', icon: 'mesas' },
      { key: 'pedidos', label: 'Pedidos', icon: 'pedidos' },
      { key: 'cocina', label: 'Cocina', icon: 'cocina' },
      { key: 'caja', label: 'Caja', icon: 'caja' },
      { key: 'reservas', label: 'Reservas', icon: 'reservas' },
    ]},
    { group: 'Administración', items: [
      { key: 'inventario', label: 'Inventario', icon: 'inventario' },
      { key: 'reportes', label: 'Reportes', icon: 'reportes' },
      { key: 'usuarios', label: 'Usuarios', icon: 'usuarios' },
      { key: 'estado', label: 'Estado', icon: 'estado' },
    ]},
  ];
  const BOTTOM = [
    { key: 'mesas', label: 'Mesas', icon: 'mesas' },
    { key: 'pedidos', label: 'Pedidos', icon: 'pedidos' },
    { key: 'cocina', label: 'Cocina', icon: 'cocina' },
    { key: 'caja', label: 'Caja', icon: 'caja' },
    { key: 'more', label: 'Más', icon: 'grid' },
  ];
  window.NAV = NAV;

  // ---------------- Sidebar ----------------
  function Sidebar({ route, go, counts }) {
    return (
      <nav className="sidebar">
        <div className="brand">
          <div className="brand-logo">N</div>
          <div><b>NachoPps</b><small>Barranco · Lima</small></div>
        </div>
        <div className="nav">
          {NAV.map((g) => (
            <div key={g.group}>
              <div className="nav-lbl">{g.group}</div>
              {g.items.map((it) => (
                <button key={it.key} className={`nav-item ${route === it.key ? 'on' : ''}`} onClick={() => go(it.key)}>
                  <Icon name={it.icon} size={18} />
                  <span>{it.label}</span>
                  {counts[it.key] ? <span className="cnt">{counts[it.key]}</span> : null}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="nav-foot">
          <button className="nav-item" onClick={() => go('cmdk')}>
            <Icon name="search" size={18} /><span>Buscar</span>
            <span className="kbd" style={{ marginLeft: 'auto' }}>⌘K</span>
          </button>
        </div>
      </nav>
    );
  }

  // ---------------- Topbar ----------------
  function Topbar({ conn, syncing, onSync, onBell, unread, theme, onTheme, onCmdk, onLogout, onAppearance }) {
    const connText = { online: 'En línea', offline: 'Sin conexión', recon: 'Reconectando…' }[conn] || 'En línea';
    return (
      <header className="topbar">
        <span className="top-loc">Resto Barranco</span>
        <span className="top-turno">Turno Noche · 19:42</span>
        <button className="icon-btn desktop-only" onClick={onCmdk} title="Buscar (⌘K)"><Icon name="search" size={18} /></button>
        <span className="spacer" />
        <span className={`conn ${conn}`}><span className="conn-dot" />{connText}</span>
        <button className={`icon-btn ${syncing ? 'spin' : ''}`} onClick={onSync} title="Sincronizar"><Icon name="refresh" size={18} /></button>
        <button className="icon-btn" onClick={onAppearance} title="Apariencia / color"><Icon name="palette" size={18} /></button>
        <button className="icon-btn" onClick={onTheme} title="Tema claro/oscuro"><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} /></button>
        <button className="icon-btn" onClick={onBell} title="Notificaciones">
          <Icon name="bell" size={18} />
          {unread > 0 && <span className="bdg">{unread}</span>}
        </button>
        <div className="user-chip">
          <div className="ava">CR</div>
          <div className="desktop-only"><b>Camila R.</b><small>Administrador</small></div>
        </div>
        <button className="icon-btn desktop-only" onClick={onLogout} title="Cerrar sesión"><Icon name="logout" size={18} /></button>
      </header>
    );
  }

  // ---------------- Bottom nav (mobile) ----------------
  function BottomNav({ route, go, onMore }) {
    return (
      <nav className="bottom-nav">
        {BOTTOM.map((it) => (
          <button key={it.key} className={`bn-item ${route === it.key ? 'on' : ''}`} onClick={() => it.key === 'more' ? onMore() : go(it.key)}>
            <Icon name={it.icon} size={20} /><span>{it.label}</span>
          </button>
        ))}
      </nav>
    );
  }

  // ---------------- Notifications panel ----------------
  const SEV = {
    danger: { ic: 'alertTri', bg: 'var(--danger-soft)', fg: 'var(--danger)' },
    warn: { ic: 'warning', bg: 'var(--warn-soft)', fg: 'var(--warn-text)' },
    ok: { ic: 'checkCircle', bg: 'var(--ok-soft)', fg: 'var(--ok)' },
    info: { ic: 'info', bg: 'var(--info-soft)', fg: 'var(--info)' },
  };
  function NotifPanel({ notifs, onClose, onRead, onReadAll, go }) {
    const [tab, setTab] = useState('all');
    const groups = [
      { key: 'danger', label: 'Críticas' },
      { key: 'warn', label: 'Atención' },
      { key: 'ok', label: 'Operación' },
    ];
    const filtered = notifs.filter((n) => tab === 'all' || (tab === 'unread' ? !n.read : n.sev === tab));
    const unread = notifs.filter((n) => !n.read).length;
    return (
      <Drawer title="Notificaciones" subtitle={`${unread} sin leer · agrupadas por severidad`} onClose={onClose}
        headExtra={<button className="btn btn-soft btn-sm" onClick={onReadAll}>Marcar leídas</button>}>
        <div className="seg" style={{ marginBottom: 16 }}>
          {[['all', 'Todas'], ['unread', 'Sin leer'], ['danger', 'Críticas']].map(([k, l]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <window.EmptyState icon="checkCircle" title="Todo al día" message="No hay notificaciones en esta vista." />
        ) : (
          <div style={{ margin: '0 -18px' }}>
            {filtered.map((n) => {
              const s = SEV[n.sev] || SEV.info;
              return (
                <div key={n.id} className={`notif ${n.read ? '' : 'unread'}`} onClick={() => { onRead(n.id); if (n.modulo) { go(n.modulo); onClose(); } }} style={{ cursor: 'pointer' }}>
                  <div className="n-ic" style={{ background: s.bg, color: s.fg }}><Icon name={n.ic || s.ic} size={18} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b>{n.titulo}</b>
                    <p>{n.detalle}</p>
                    <div className="n-time">{n.time}{n.admin && ' · solo admin'}</div>
                  </div>
                  {!n.read && <span style={{ width: 8, height: 8, borderRadius: 5, background: 'var(--accent)', flex: 'none', marginTop: 6 }} />}
                </div>
              );
            })}
          </div>
        )}
      </Drawer>
    );
  }

  // ---------------- Command palette ----------------
  function CommandPalette({ onClose, go, openScreen }) {
    const [q, setQ] = useState('');
    const [sel, setSel] = useState(0);
    const inputRef = useRef();
    useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);
    const cmds = useMemo(() => {
      const nav = NAV.flatMap((g) => g.items).map((it) => ({ type: 'Ir a', label: it.label, icon: it.icon, action: () => go(it.key) }));
      const actions = [
        { type: 'Acción', label: 'Nuevo pedido', icon: 'plus', action: () => go('crear-pedido') },
        { type: 'Acción', label: 'Nueva reserva', icon: 'reservas', action: () => go('reservas') },
        { type: 'Acción', label: 'Cobrar cuenta', icon: 'money', action: () => go('caja') },
        { type: 'Acción', label: 'Ver estado del sistema', icon: 'estado', action: () => go('estado') },
      ];
      const all = [...nav, ...actions];
      if (!q.trim()) return all;
      return all.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
    }, [q]);
    useEffect(() => { setSel(0); }, [q]);
    const run = (c) => { c.action(); onClose(); };
    const onKey = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(cmds.length - 1, s + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); cmds[sel] && run(cmds[sel]); }
      else if (e.key === 'Escape') onClose();
    };
    return (
      <div className="cmdk-wrap" onClick={onClose}>
        <div className="cmdk" onClick={(e) => e.stopPropagation()}>
          <div className="cmdk-input">
            <Icon name="search" size={20} />
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Buscar módulos, acciones, mesas…" />
            <span className="kbd">Esc</span>
          </div>
          <div className="cmdk-list">
            {cmds.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontWeight: 600 }}>Sin resultados para “{q}”</div>}
            {cmds.map((c, i) => (
              <div key={i} className={`cmdk-item ${i === sel ? 'on' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => run(c)}>
                <Icon name={c.icon} size={18} />
                <span style={{ flex: 1 }}>{c.label}</span>
                <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>{c.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Mobile "more" sheet ----------------
  function MoreSheet({ route, go, onClose, onTheme, theme, onLogout }) {
    const all = NAV.flatMap((g) => g.items);
    return (
      <Drawer title="Módulos" onClose={onClose}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {all.map((it) => (
            <button key={it.key} className={`btn ${route === it.key ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start', padding: '14px' }} onClick={() => { go(it.key); onClose(); }}>
              <Icon name={it.icon} size={20} /> {it.label}
            </button>
          ))}
        </div>
        <div className="divider" />
        <button className="btn btn-ghost btn-block" style={{ justifyContent: 'flex-start' }} onClick={onTheme}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} /> Tema {theme === 'dark' ? 'claro' : 'oscuro'}</button>
        <button className="btn btn-ghost btn-block" style={{ justifyContent: 'flex-start', marginTop: 10 }} onClick={onLogout}><Icon name="logout" size={18} /> Cerrar sesión</button>
      </Drawer>
    );
  }

  // ---------------- Appearance / color customization ----------------
  function AppearanceMenu({ accent, setAccent, primaryAccent, setPrimaryAccent, theme, onTheme, onClose, onReset }) {
    const swatches = ['#2950a6', '#1f3f88', '#3a5bbf', '#5b4ad8', '#0f766e', '#b5450e', '#be123c', '#18181b'];
    const isCustom = !swatches.includes((accent || '').toLowerCase());
    const fileRef = React.useRef();
    return (
      <>
        <div style={{ position: 'fixed', inset: 0, zIndex: 75 }} onClick={onClose} />
        <div className="appearance-pop" role="dialog">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
            <b style={{ fontSize: 15, fontWeight: 800 }}>Apariencia</b>
            <button className="icon-btn" style={{ width: 28, height: 28, border: 0, background: 'none' }} onClick={onClose}><Icon name="x" size={15} /></button>
          </div>

          <div className="ap-lbl">Tema</div>
          <div className="seg" style={{ width: '100%', marginBottom: 18 }}>
            <button className={theme === 'light' ? 'on' : ''} style={{ flex: 1 }} onClick={() => onTheme(false)}><Icon name="sun" size={14} /> Claro</button>
            <button className={theme === 'dark' ? 'on' : ''} style={{ flex: 1 }} onClick={() => onTheme(true)}><Icon name="moon" size={14} /> Oscuro</button>
          </div>

          <div className="ap-lbl">Color de acento (tinta)</div>
          <div className="ap-swatches">
            {swatches.map((c) => (
              <button key={c} className={`ap-sw ${accent.toLowerCase() === c ? 'on' : ''}`} style={{ background: c }} onClick={() => setAccent(c)}>
                {accent.toLowerCase() === c && <Icon name="check" size={15} />}
              </button>
            ))}
            <button className={`ap-sw ap-custom ${isCustom ? 'on' : ''}`} style={isCustom ? { background: accent } : undefined} title="Color personalizado" onClick={() => fileRef.current && fileRef.current.click()}>
              <Icon name={isCustom ? 'check' : 'plus'} size={15} />
            </button>
            <input ref={fileRef} type="color" value={accent} onChange={(e) => setAccent(e.target.value)} style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }} />
          </div>

          <div className="ap-hex input" style={{ padding: '7px 10px', marginTop: 12 }}>
            <span className="ap-dot" style={{ background: accent }} />
            <input value={accent} spellCheck={false} onChange={(e) => setAccent(e.target.value)} style={{ fontFamily: 'var(--mono)', fontSize: 13, textTransform: 'uppercase' }} />
            <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
          </div>

          <label className="ap-toggle">
            <span>Usar el acento en botones de acción</span>
            <input type="checkbox" checked={primaryAccent} onChange={(e) => setPrimaryAccent(e.target.checked)} />
          </label>

          <div className="ap-preview">
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Botón primario</button>
            <button className="btn btn-soft btn-sm" style={{ flex: 1, color: 'var(--accent-text)' }}>Enlace tinta</button>
          </div>

          <div className="row gap8" style={{ marginTop: 14 }}>
            <button className="btn btn-ghost btn-sm" onClick={onReset}><Icon name="refresh" size={14} /> Restablecer</button>
            <span className="spacer" />
            <button className="btn btn-primary btn-sm" onClick={onClose}>Listo</button>
          </div>
        </div>
      </>
    );
  }

  Object.assign(window, { Sidebar, Topbar, BottomNav, NotifPanel, CommandPalette, MoreSheet, AppearanceMenu });
})();
