// app.jsx — NachoPps root: store, routing, theme, toasts, tweaks.
(function () {
  const { useState, useEffect, useMemo, useCallback } = React;
  const Icon = window.Icon;
  const D = window.DATA;
  const { ToastHost } = window;
  const { Sidebar, Topbar, BottomNav, NotifPanel, CommandPalette, MoreSheet, AppearanceMenu } = window;
  const { useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio, TweakColor } = window;

  const initStore = () => ({
    mesas: D.mesas.map((m) => ({ ...m })),
    pedidos: D.pedidos.map((p) => ({ ...p, canal: p.canal || 'SALON', items: p.items.map((i) => ({ ...i })) })),
    cuentas: JSON.parse(JSON.stringify(D.cuentas)),
    productos: D.productos.map((p) => ({ ...p })),
    reservas: D.reservas.map((r) => ({ ...r })),
    transacciones: D.transacciones.map((t) => ({ ...t })),
    usuarios: D.usuarios.map((u) => ({ ...u })),
    notifs: D.notificaciones.map((n) => ({ ...n })),
    correlativo: { BOLETA: 1245, FACTURA: 318 },
  });

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "dark": false,
    "density": "regular",
    "conn": "online"
  }/*EDITMODE-END*/;

  const SCREENS = {
    mesas: window.Mesas, 'crear-pedido': window.CrearPedido, pedidos: window.Pedidos, cocina: window.Cocina,
    caja: window.Caja, reservas: window.Reservas, inventario: window.Inventario,
    reportes: window.Reportes, usuarios: window.Usuarios, estado: window.Estado,
  };

  function App() {
    const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [logged, setLogged] = useState(false);
    const [store, setStore] = useState(initStore);
    const [route, setRoute] = useState('mesas');
    const [params, setParams] = useState({});
    const [toasts, setToasts] = useState([]);
    const [syncing, setSyncing] = useState(false);
    const [bell, setBell] = useState(false);
    const [cmdk, setCmdk] = useState(false);
    const [more, setMore] = useState(false);
    const [appearance, setAppearance] = useState(false);

    // in-app color customization (persisted)
    const [accent, setAccentState] = useState(() => (typeof localStorage !== 'undefined' && localStorage.getItem('nacho_accent')) || '#2950a6');
    const [primaryAccent, setPrimaryAccentState] = useState(() => typeof localStorage !== 'undefined' && localStorage.getItem('nacho_primaryAccent') === '1');
    const setAccent = (v) => { setAccentState(v); try { localStorage.setItem('nacho_accent', v); } catch (e) {} };
    const setPrimaryAccent = (v) => { setPrimaryAccentState(v); try { localStorage.setItem('nacho_primaryAccent', v ? '1' : '0'); } catch (e) {} };

    // theme + density
    useEffect(() => {
      const r = document.documentElement;
      r.setAttribute('data-theme', t.dark ? 'dark' : 'light');
      r.setAttribute('data-density', t.density === 'compact' ? 'compact' : 'regular');
    }, [t.dark, t.density]);

    // accent (derive hover/soft/text via color-mix so any hex works in both themes)
    useEffect(() => {
      const r = document.documentElement, dark = t.dark, a = accent;
      const mixHover = `color-mix(in srgb, ${a} ${dark ? '78%' : '86%'}, ${dark ? '#ffffff' : '#000000'})`;
      r.style.setProperty('--accent', a);
      r.style.setProperty('--accent-hover', mixHover);
      r.style.setProperty('--accent-soft', dark ? `color-mix(in srgb, ${a} 24%, #15171c)` : `color-mix(in srgb, ${a} 11%, #ffffff)`);
      r.style.setProperty('--accent-text', dark ? `color-mix(in srgb, ${a} 66%, #ffffff)` : `color-mix(in srgb, ${a} 84%, #000000)`);
      if (primaryAccent) {
        r.style.setProperty('--primary', a);
        r.style.setProperty('--primary-hover', mixHover);
        r.style.setProperty('--on-primary', '#ffffff');
      } else {
        r.style.removeProperty('--primary');
        r.style.removeProperty('--primary-hover');
        r.style.removeProperty('--on-primary');
      }
    }, [accent, primaryAccent, t.dark]);

    const conn = t.conn || 'online';

    const toast = useCallback((kind, title, msg) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((ts) => [...ts, { id, kind, title, msg }]);
    }, []);
    const dismiss = (id) => setToasts((ts) => ts.filter((x) => x.id !== id));

    const go = useCallback((r, p = {}) => {
      if (r === 'cmdk') { setCmdk(true); return; }
      setParams(p); setRoute(r); setMore(false); setBell(false); setCmdk(false);
      document.querySelector('.content') && (document.querySelector('.content').scrollTop = 0);
    }, []);

    const sync = () => { setSyncing(true); toast('info', 'Sincronizando…', 'Consultando servicios.'); setTimeout(() => { setSyncing(false); toast('ok', 'Actualizado', 'Datos al día.'); }, 1100); };

    // ⌘K
    useEffect(() => {
      const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdk((v) => !v); } };
      window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
    }, []);

    const readNotif = (id) => setStore((s) => ({ ...s, notifs: s.notifs.map((n) => n.id === id ? { ...n, read: true } : n) }));
    const readAll = () => setStore((s) => ({ ...s, notifs: s.notifs.map((n) => ({ ...n, read: true })) }));
    const unread = store.notifs.filter((n) => !n.read).length;

    const counts = {
      pedidos: store.pedidos.filter((p) => ['PENDIENTE', 'EN_PREPARACION'].includes(p.estado)).length,
      cocina: store.pedidos.filter((p) => p.area === 'COCINA' && ['PENDIENTE', 'EN_PREPARACION'].includes(p.estado)).length,
      reservas: store.reservas.filter((r) => r.estado === 'PENDIENTE').length,
    };

    const app = { store, setStore, toast, go, route, params, theme: t.dark ? 'dark' : 'light' };

    const tweaksPanel = (
      <TweaksPanel>
        <TweakSection label="Tema" />
        <TweakToggle label="Modo oscuro" value={t.dark} onChange={(v) => setTweak('dark', v)} />
        <TweakSection label="Densidad" />
        <TweakRadio label="Espaciado" value={t.density} options={['compact', 'regular']} onChange={(v) => setTweak('density', v)} />
        <TweakSection label="Conexión (demo de estados)" />
        <TweakRadio label="Estado" value={t.conn} options={['online', 'recon', 'offline']} onChange={(v) => setTweak('conn', v)} />
      </TweaksPanel>
    );

    if (!logged) {
      return (<>
        <window.Login onLogin={() => { setLogged(true); go('mesas'); }} />
        {tweaksPanel}
      </>);
    }

    const Screen = SCREENS[route] || window.Mesas;

    return (
      <div className="app">
        {conn === 'offline' && <div className="offline-banner"><Icon name="wifiOff" size={15} /> Sin conexión — trabajando en modo offline. Los cambios se sincronizarán al reconectar.</div>}
        <Sidebar route={route} go={go} counts={counts} />
        <div className="main">
          <Topbar conn={conn} syncing={syncing} onSync={sync} onBell={() => setBell(true)} unread={unread}
            theme={t.dark ? 'dark' : 'light'} onTheme={() => setTweak('dark', !t.dark)} onCmdk={() => setCmdk(true)} onLogout={() => setLogged(false)} onAppearance={() => setAppearance(true)} />
          {conn === 'recon' && <div className="banner warn" style={{ borderRadius: 0, justifyContent: 'center' }}><Icon name="sync" size={15} /> Reconectando con el servidor… reintentando operaciones pendientes.</div>}
          <main className="content">
            <Screen app={app} />
          </main>
        </div>

        <BottomNav route={route} go={go} onMore={() => setMore(true)} />

        {bell && <NotifPanel notifs={store.notifs} onClose={() => setBell(false)} onRead={readNotif} onReadAll={readAll} go={go} />}
        {appearance && <AppearanceMenu accent={accent} setAccent={setAccent} primaryAccent={primaryAccent} setPrimaryAccent={setPrimaryAccent} theme={t.dark ? 'dark' : 'light'} onTheme={(d) => setTweak('dark', d)} onClose={() => setAppearance(false)} onReset={() => { setAccent('#2950a6'); setPrimaryAccent(false); }} />}
        {cmdk && <CommandPalette onClose={() => setCmdk(false)} go={go} />}
        {more && <MoreSheet route={route} go={go} onClose={() => setMore(false)} onTheme={() => setTweak('dark', !t.dark)} theme={t.dark ? 'dark' : 'light'} onLogout={() => { setMore(false); setLogged(false); }} />}

        <ToastHost toasts={toasts} onDismiss={dismiss} />
        {tweaksPanel}
      </div>
    );
  }

  window.NachoApp = App;
})();
