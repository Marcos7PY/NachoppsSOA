// screens-ops.jsx — Mesas + drawer, Crear pedido, Pedidos, Cocina (KDS)
(function () {
  const { useState, useEffect, useMemo, useRef } = React;
  const Icon = window.Icon;
  const D = window.DATA;
  const { Badge, StatusBadge, Spinner, Banner, SearchInput, Segmented, FilterChips, Stepper,
    Drawer, Modal, ConfirmModal, EmptyState, ErrorState, SkeletonCards, SkeletonRows } = window;

  // demo state switcher used across screens
  function StateSwitch({ value, onChange }) {
    return (
      <div className="row gap8 desktop-only" style={{ marginLeft: 'auto' }}>
        <span className="muted" style={{ fontSize: 11.5, fontWeight: 700 }}>DEMO ESTADO</span>
        <Segmented value={value} onChange={onChange} options={[
          { value: 'ready', label: 'Datos' }, { value: 'loading', label: 'Cargando' },
          { value: 'empty', label: 'Vacío' }, { value: 'error', label: 'Error' },
        ]} />
      </div>
    );
  }

  // =====================================================================
  // MESAS
  // =====================================================================
  function Mesas({ app }) {
    const { store, go } = app;
    const [filter, setFilter] = useState('all');
    const [q, setQ] = useState('');
    const [sel, setSel] = useState(null);
    const [demo, setDemo] = useState('ready');

    const mesas = store.mesas;
    const counts = {
      all: mesas.length,
      libre: mesas.filter((m) => m.estado === 'LIBRE').length,
      ocup: mesas.filter((m) => m.estado === 'OCUPADA').length,
      resv: mesas.filter((m) => m.estado === 'RESERVADA').length,
      cuenta: mesas.filter((m) => m.cuenta).length,
      pend: mesas.filter((m) => m.pend > 0).length,
    };
    const fmap = { all: () => true, libre: (m) => m.estado === 'LIBRE', ocup: (m) => m.estado === 'OCUPADA', resv: (m) => m.estado === 'RESERVADA', cuenta: (m) => m.cuenta, pend: (m) => m.pend > 0 };
    const filtered = mesas.filter(fmap[filter]).filter((m) => !q || m.n.includes(q.replace(/\D/g, '')));
    const totalSalon = mesas.reduce((a, m) => a + (m.total || 0), 0);

    return (
      <div data-screen-label="Mesas">
        <div className="page-h">
          <div>
            <h1>Mesas</h1>
            <p className="sub">{counts.ocup} ocupadas · {counts.libre} libres · {counts.resv} reservadas · {D.fmt(totalSalon)} en salón</p>
          </div>
          <StateSwitch value={demo} onChange={setDemo} />
        </div>

        <div className="row wrap gap10" style={{ marginBottom: 16 }}>
          <FilterChips value={filter} onChange={setFilter} options={[
            { value: 'all', label: 'Todas', count: counts.all }, { value: 'libre', label: 'Libres', count: counts.libre },
            { value: 'ocup', label: 'Ocupadas', count: counts.ocup }, { value: 'resv', label: 'Reservadas', count: counts.resv },
            { value: 'cuenta', label: 'Con cuenta', count: counts.cuenta }, { value: 'pend', label: 'Con pendientes', count: counts.pend },
          ]} />
          <span className="spacer" />
          <SearchInput value={q} onChange={setQ} placeholder="Buscar mesa…" width={180} />
        </div>

        {demo === 'loading' && <SkeletonCards count={12} />}
        {demo === 'error' && <ErrorState message="El servicio de Mesas no responde (timeout 5s)." onRetry={() => setDemo('ready')} />}
        {demo === 'empty' && <EmptyState icon="mesas" title="Sin mesas que coincidan" message="Ajusta los filtros o crea una nueva mesa para empezar la operación." action={<button className="btn btn-primary" onClick={() => setFilter('all')}>Ver todas las mesas</button>} />}
        {demo === 'ready' && (filtered.length === 0 ? (
          <EmptyState icon="search" title="Sin resultados" message={`Ninguna mesa coincide con “${q || filter}”.`} action={<button className="btn btn-ghost" onClick={() => { setQ(''); setFilter('all'); }}>Limpiar filtros</button>} />
        ) : (
          <div className="mesa-grid">
            {filtered.map((m) => <MesaCard key={m.n} m={m} selected={sel === m.n} onClick={() => setSel(m.n)} />)}
          </div>
        ))}

        {sel && <MesaDrawer mesa={mesas.find((m) => m.n === sel)} app={app} onClose={() => setSel(null)} />}
      </div>
    );
  }

  function MesaCard({ m, selected, onClick }) {
    const st = D.MESA_ST[m.estado];
    return (
      <button className={`mesa-card ${st.cls} ${selected ? 'sel' : ''}`} onClick={onClick}>
        <div className="mesa-top">
          <div>
            <div className="mesa-num">M{m.n}</div>
            <div className="mesa-cap"><Icon name="usuarios" size={13} />{m.cap} pers · {m.zona}</div>
          </div>
          <StatusBadge map={D.MESA_ST} value={m.estado} />
        </div>
        {m.estado === 'OCUPADA' && (
          <>
            <div className="mesa-meta">
              <div className="mesa-mi"><div className="k">Cuenta</div><div className="v num">{D.fmt(m.total)}</div></div>
              <div className="mesa-mi"><div className="k">Tiempo</div><div className="v num">{m.min} min</div></div>
            </div>
            <div className="mesa-line" style={{ color: m.pend ? 'var(--warn-text)' : 'var(--muted)' }}>
              <Icon name={m.pend ? 'flame' : 'check'} size={13} />{m.pend ? `${m.pend} en cocina` : 'Sin pendientes'}
            </div>
          </>
        )}
        {m.estado === 'RESERVADA' && <div className="mesa-line" style={{ color: 'var(--info-text)' }}><Icon name="clock" size={13} />Reserva {m.resv}</div>}
        {m.estado === 'LIBRE' && <div className="mesa-line muted"><Icon name="check" size={13} />Disponible ahora</div>}
        {m.estado === 'LIMPIEZA' && <div className="mesa-line" style={{ color: 'var(--warn-text)' }}><Icon name="refresh" size={13} />En limpieza</div>}
        {m.estado === 'BLOQUEADA' && <div className="mesa-line muted"><Icon name="lock" size={13} />Fuera de servicio</div>}
      </button>
    );
  }

  // ---------------- Mesa detail drawer ----------------
  function MesaDrawer({ mesa, app, onClose }) {
    const { store, setStore, toast, go } = app;
    const C = window.COMMERCE;
    const [confirm, setConfirm] = useState(null);
    const [voidItem, setVoidItem] = useState(null);
    const [synced, setSynced] = useState(true);
    const st = D.MESA_ST[mesa.estado];
    const cuenta = mesa.cuenta ? store.cuentas[mesa.cuenta] : null;
    const pedidos = store.pedidos.filter((p) => p.mesa === mesa.n && p.estado !== 'CANCELADO');

    const events = [
      mesa.estado === 'OCUPADA' && { t: 'Cuenta abierta', time: `${cuenta ? cuenta.abierta : '19:00'} · ${mesa.mozo}`, active: false },
      pedidos.length && { t: `${pedidos.length} pedido(s) registrados`, time: 'Hace 14 min', active: false },
      mesa.pend > 0 && { t: `${mesa.pend} ítem(s) en preparación`, time: 'Cocina · ahora', active: true },
      mesa.estado === 'RESERVADA' && { t: 'Reserva confirmada', time: mesa.resv, active: true },
    ].filter(Boolean);

    const setEstado = (estado, extra = {}) => {
      setStore((s) => ({ ...s, mesas: s.mesas.map((m) => m.n === mesa.n ? { ...m, estado, ...extra } : m) }));
    };

    const actions = [];
    if (mesa.estado === 'OCUPADA') {
      actions.push(<button key="add" className="btn btn-ghost btn-block" onClick={() => { go('crear-pedido', { mesa: mesa.n }); onClose(); }}><Icon name="plus" size={16} /> Agregar pedido</button>);
      actions.push(<button key="pay" className="btn btn-primary btn-block" onClick={() => { go('caja', { cuenta: mesa.cuenta, mesa: mesa.n }); onClose(); }}><Icon name="money" size={16} /> Cobrar</button>);
    } else if (mesa.estado === 'LIBRE') {
      actions.push(<button key="open" className="btn btn-primary btn-block" onClick={() => { go('crear-pedido', { mesa: mesa.n }); onClose(); }}><Icon name="plus" size={16} /> Abrir cuenta · Crear pedido</button>);
    } else if (mesa.estado === 'LIMPIEZA') {
      actions.push(<button key="free" className="btn btn-success btn-block" onClick={() => { setEstado('LIBRE'); toast('ok', 'Mesa liberada', `M${mesa.n} disponible.`); onClose(); }}><Icon name="check" size={16} /> Marcar libre</button>);
    } else if (mesa.estado === 'RESERVADA') {
      actions.push(<button key="seat" className="btn btn-primary btn-block" onClick={() => { setEstado('OCUPADA', { total: 0, pend: 0, min: 0 }); toast('ok', 'Mesa ocupada', `Reserva sentada en M${mesa.n}.`); onClose(); }}><Icon name="serve" size={16} /> Sentar reserva</button>);
    } else {
      actions.push(<button key="unblock" className="btn btn-ghost btn-block" onClick={() => { setEstado('LIBRE'); toast('ok', 'Mesa habilitada', `M${mesa.n} disponible.`); onClose(); }}><Icon name="check" size={16} /> Habilitar mesa</button>);
    }

    return (
      <Drawer title={`Mesa ${mesa.n}`} subtitle={`${mesa.cap} personas · ${mesa.zona}${mesa.mozo ? ' · ' + mesa.mozo : ''}`} onClose={onClose}
        headExtra={<StatusBadge map={D.MESA_ST} value={mesa.estado} />}
        footer={mesa.estado === 'OCUPADA'
          ? <><button className="btn btn-ghost" onClick={() => setConfirm('clean')} title="Marcar limpieza"><Icon name="refresh" size={16} /></button>{actions}</>
          : actions}>

        {!synced && <Banner kind="warn" icon="sync" action={<button className="btn btn-sm btn-soft" onClick={() => setSynced(true)}>Reintentar</button>}>Actualizando cuenta… consistencia eventual.</Banner>}

        {cuenta ? (
          <>
            <div className="panel" style={{ marginBottom: 16 }}>
              <div className="panel-h"><h3>Cuenta activa</h3><Badge kind="info" dot>{cuenta.id}</Badge><span className="spacer" /><StatusBadge map={D.CTA_ST} value={cuenta.estado} /></div>
              <div style={{ padding: '6px 16px 12px' }}>
                {cuenta.items.map((it, i) => (
                  <div className="kv" key={i} style={{ borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                    <span className="k" style={{ textDecoration: it.anulado ? 'line-through' : 'none', opacity: it.anulado ? 0.55 : 1 }}><b className="num" style={{ color: 'var(--accent-text)', marginRight: 6 }}>{it.q}×</b>{it.n} {it.anulado ? <span className="badge badge-danger" style={{ marginLeft: 6, fontSize: 10 }}>ANULADO</span> : <span className="badge badge-muted" style={{ marginLeft: 6, fontSize: 10 }}>{D.PED_ST[it.estado].label}</span>}</span>
                    <span className="row gap8"><span className="v num" style={{ textDecoration: it.anulado ? 'line-through' : 'none', opacity: it.anulado ? 0.55 : 1 }}>{D.fmt(it.precio * it.q)}</span>{!it.anulado && <button className="icon-btn" style={{ width: 26, height: 26 }} title="Anular ítem" onClick={() => setVoidItem({ ...it, i })}><Icon name="trash" size={13} /></button>}</span>
                  </div>
                ))}
                <div className="kv" style={{ paddingTop: 12 }}><span className="k" style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Total</span><span className="v num" style={{ fontSize: 20, fontWeight: 800 }}>{D.fmt(mesa.total)}</span></div>
              </div>
            </div>
          </>
        ) : mesa.estado === 'LIBRE' ? (
          <EmptyState icon="pedidos" title="Sin cuenta abierta" message="Esta mesa está libre. Crea un pedido para abrir una cuenta." action={<button className="btn btn-primary" onClick={() => { go('crear-pedido', { mesa: mesa.n }); onClose(); }}><Icon name="plus" size={16} /> Crear pedido</button>} />
        ) : null}

        {pedidos.length > 0 && (
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel-h"><h3>Pedidos</h3><Badge kind="muted">{pedidos.length}</Badge></div>
            <div style={{ padding: '4px 16px 12px' }}>
              {pedidos.map((p) => (
                <div className="kv" key={p.id} style={{ borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <span className="k"><b className="mono" style={{ fontSize: 12 }}>{p.id}</b> · {p.items.length} ítems · {p.area}</span>
                  <StatusBadge map={D.PED_ST} value={p.estado} dot={false} />
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length > 0 && (
          <div className="panel">
            <div className="panel-h"><h3>Actividad reciente</h3></div>
            <div style={{ padding: '16px 18px 8px' }}>
              <div className="timeline">
                {events.map((e, i) => (
                  <div className={`tl-item ${e.active ? 'active' : ''}`} key={i}>
                    <div className="tl-t">{e.t}</div><div className="tl-time">{e.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {voidItem && <C.VoidItemModal item={voidItem} onClose={() => setVoidItem(null)} onConfirm={({ reason, authBy }) => {
          setStore((s) => {
            const cta = s.cuentas[mesa.cuenta];
            const items = cta.items.map((x, idx) => idx === voidItem.i ? { ...x, anulado: true, motivo: reason, authBy } : x);
            return { ...s, cuentas: { ...s.cuentas, [mesa.cuenta]: { ...cta, items } }, mesas: s.mesas.map((m) => m.n === mesa.n ? { ...m, total: Math.max(0, +(m.total - voidItem.precio * voidItem.q).toFixed(2)) } : m) };
          });
          toast('info', 'Ítem anulado', `${voidItem.n} · ${reason} · aut. ${authBy}`);
          setVoidItem(null);
        }} />}

        {confirm === 'clean' && (
          <ConfirmModal tone="warn" title={`¿Marcar M${mesa.n} en limpieza?`} message="La mesa quedará bloqueada para nuevos pedidos hasta que se libere."
            confirmLabel="Marcar limpieza" onClose={() => setConfirm(null)}
            onConfirm={() => { setEstado('LIMPIEZA', { total: 0, pend: 0, cuenta: null }); toast('info', 'Mesa en limpieza', `M${mesa.n} marcada para limpieza.`); setConfirm(null); onClose(); }} />
        )}
      </Drawer>
    );
  }

  // =====================================================================
  // CREAR PEDIDO
  // =====================================================================
  function CrearPedido({ app }) {
    const { store, setStore, toast, go, params } = app;
    const C = window.COMMERCE;
    const [canal, setCanal] = useState(params.canal || 'SALON');
    const salonMesa = params.mesa || (store.mesas.find((m) => m.estado === 'OCUPADA') || store.mesas[0]).n;
    const [mesaN, setMesaN] = useState(salonMesa);
    const mesa = store.mesas.find((m) => m.n === mesaN);
    const [cliente, setCliente] = useState('');
    const [prov, setProv] = useState('Rappi');
    const [dir, setDir] = useState('');
    const [cat, setCat] = useState('Entradas');
    const [q, setQ] = useState('');
    const [cart, setCart] = useState([]); // {uid, id, n, precio, area, q, note, mods:[], extra}
    const [sending, setSending] = useState(false);
    const [errProd, setErrProd] = useState(null);
    const [modProduct, setModProduct] = useState(null);

    const prods = store.productos.filter((p) => (q ? p.nombre.toLowerCase().includes(q.toLowerCase()) : p.cat === cat));
    const uid = () => Math.random().toString(36).slice(2, 9);

    const addLine = (p, cfg) => {
      const { mods = [], extra = 0, qty = 1, note = '' } = cfg || {};
      setCart((c) => {
        if (!mods.length) { const ex = c.find((i) => i.id === p.id && (!i.mods || !i.mods.length)); if (ex) return c.map((i) => i.uid === ex.uid ? { ...i, q: i.q + qty } : i); }
        return [...c, { uid: uid(), id: p.id, n: p.nombre, precio: p.precio, area: p.area, q: qty, note, mods, extra }];
      });
    };
    const add = (p) => {
      if (!p.disp || p.stock === 0) { setErrProd(p.id); setTimeout(() => setErrProd(null), 2200); toast('err', 'Producto no disponible', `${p.nombre} sin stock.`); return; }
      if (C.hasMods(p.id)) { setModProduct(p); return; }
      addLine(p, { qty: 1 });
    };
    const setQty = (u, qv) => setCart((c) => qv === 0 ? c.filter((i) => i.uid !== u) : c.map((i) => i.uid === u ? { ...i, q: qv } : i));
    const setNote = (u, note) => setCart((c) => c.map((i) => i.uid === u ? { ...i, note } : i));
    const lineTotal = (i) => (i.precio + (i.extra || 0)) * i.q;
    const subtotal = cart.reduce((a, i) => a + lineTotal(i), 0);
    const totalItems = cart.reduce((a, i) => a + i.q, 0);

    const enviar = () => {
      setSending(true);
      setTimeout(() => {
        const seq = store.pedidos.length;
        const baseId = canal === 'SALON' ? 'PED-' + (2042 + seq) : canal === 'LLEVAR' ? 'LL-' + (15 + seq) : 'DEL-' + (22 + seq);
        const byArea = {};
        cart.forEach((i) => { (byArea[i.area] = byArea[i.area] || []).push({ q: i.q, n: i.n, note: i.note || undefined, mods: i.mods && i.mods.length ? i.mods.map((m) => m.label) : undefined }); });
        const meta = canal === 'SALON' ? { mesa: mesaN, mozo: 'Camila' }
          : canal === 'LLEVAR' ? { mesa: null, cliente: cliente || 'Mostrador', mozo: 'Mostrador' }
          : { mesa: null, cliente: cliente || 'Cliente', prov, dir, mozo: 'App' };
        const newPeds = Object.entries(byArea).map(([area, items], k) => ({ id: baseId + (k ? '-' + area[0] : ''), canal, estado: 'PENDIENTE', area, min: 0, items, ...meta }));
        setStore((s) => ({
          ...s,
          pedidos: [...newPeds, ...s.pedidos],
          mesas: canal === 'SALON' ? s.mesas.map((m) => m.n === mesaN ? { ...m, estado: 'OCUPADA', total: (m.total || 0) + subtotal, pend: (m.pend || 0) + totalItems, cuenta: m.cuenta || 'CTA-' + (123 + seq), min: m.min || 1 } : m) : s.mesas,
        }));
        setSending(false); setCart([]);
        const dest = canal === 'SALON' ? `M${mesaN}` : canal === 'LLEVAR' ? 'Para llevar' : `Delivery · ${prov}`;
        toast('ok', 'Pedido enviado', `${totalItems} ítems a cocina/barra · ${dest}.`);
        if (canal === 'SALON') setTimeout(() => toast('info', 'Actualizando cuenta…', 'Consolidando con consistencia eventual.'), 500);
        go(canal === 'SALON' ? 'mesas' : 'pedidos');
      }, 1100);
    };

    const canSend = cart.length > 0 && !sending && (canal !== 'DELIVERY' || (cliente && dir));
    const ch = C.CANALES[canal];

    return (
      <div data-screen-label="Crear pedido" style={{ display: 'flex', gap: 18, height: '100%' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="page-h">
            <button className="btn btn-ghost btn-sm" onClick={() => go(canal === 'SALON' ? 'mesas' : 'pedidos')}><Icon name="chevL" size={16} /> Volver</button>
            <div>
              <h1>Nuevo pedido</h1>
              <p className="sub">{canal === 'SALON' ? `Mesa ${mesaN} · ${mesa.zona} · ${mesa.cap} personas` : ch.label}</p>
            </div>
          </div>

          {/* CANAL selector + contextual fields */}
          <div className="panel" style={{ padding: 12, marginBottom: 14 }}>
            <div className="row wrap gap10">
              <span className="ap-lbl" style={{ margin: 0 }}>Canal</span>
              <div className="seg">
                {Object.entries(C.CANALES).map(([k, v]) => <button key={k} className={canal === k ? 'on' : ''} onClick={() => setCanal(k)}><Icon name={v.icon} size={14} /> {v.label}</button>)}
              </div>
              {canal === 'SALON' && (
                <div className="input" style={{ width: 'auto', padding: '6px 10px' }}><Icon name="mesas" size={15} /><select value={mesaN} onChange={(e) => setMesaN(e.target.value)} style={{ fontWeight: 700 }}>{store.mesas.map((m) => <option key={m.n} value={m.n}>Mesa {m.n} · {m.zona}</option>)}</select></div>
              )}
              {canal === 'LLEVAR' && (
                <div className="input" style={{ width: 220, padding: '6px 10px' }}><Icon name="user" size={15} /><input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Cliente (opcional)" /></div>
              )}
              {canal === 'DELIVERY' && (
                <>
                  <div className="seg">{C.PROVEEDORES.map((p) => <button key={p} className={prov === p ? 'on' : ''} onClick={() => setProv(p)}>{p}</button>)}</div>
                  <div className="input" style={{ width: 170, padding: '6px 10px' }}><Icon name="user" size={15} /><input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Cliente *" /></div>
                  <div className="input" style={{ flex: 1, minWidth: 200, padding: '6px 10px' }}><Icon name="serve" size={15} /><input value={dir} onChange={(e) => setDir(e.target.value)} placeholder="Dirección de entrega *" /></div>
                </>
              )}
            </div>
          </div>

          <div className="row wrap gap8" style={{ marginBottom: 14 }}>
            {D.cats.map((c) => <button key={c} className={`chip ${cat === c && !q ? 'on' : ''}`} onClick={() => { setCat(c); setQ(''); }}>{c}</button>)}
            <span className="spacer" />
            <SearchInput value={q} onChange={setQ} placeholder="Buscar producto…" width={200} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div className="prod-grid">
              {prods.map((p) => {
                const out = !p.disp || p.stock === 0;
                const low = p.ctrl && p.stock != null && p.stock <= 6 && p.stock > 0;
                return (
                  <button key={p.id} className="prod-card" disabled={out} onClick={() => add(p)} style={errProd === p.id ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 3px var(--danger-soft)' } : null}>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                      <span className="badge badge-muted" style={{ fontSize: 10 }}>{p.area}</span>
                      {out ? <span className="badge badge-danger" style={{ fontSize: 10 }}>SIN STOCK</span> : low ? <span className="badge badge-warn" style={{ fontSize: 10 }}>{p.stock} und</span> : !p.ctrl ? <span className="badge badge-ok" style={{ fontSize: 10 }}>Libre</span> : null}
                    </div>
                    <div className="pn" style={{ marginTop: 9 }}>{p.nombre}</div>
                    <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div className="pp num">{D.fmt(p.precio)}</div>
                      {C.hasMods(p.id) && <span className="badge badge-accent" style={{ fontSize: 9.5 }}>OPCIONES</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CART */}
        <div className="panel desktop-only" style={{ width: 348, flex: 'none', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-h"><Icon name={ch.icon} size={18} /><h3>Pedido actual</h3><span className={`badge ${ch.badge}`} style={{ fontSize: 10 }}>{ch.label}</span>{totalItems > 0 && <Badge kind="accent">{totalItems}</Badge>}</div>
          {cart.length === 0 ? (
            <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 24 }}>
              <EmptyState icon="pedidos" title="Carrito vacío" message="Toca un producto para agregarlo. Los marcados con OPCIONES abren modificadores." />
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px' }}>
              {cart.map((i) => (
                <div className="cart-item" key={i.uid}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ci-n">{i.n}</div>
                    <div className="ci-m">{i.area} · {D.fmt(i.precio)}{i.extra > 0 && <span style={{ color: 'var(--accent-text)' }}> +{D.fmt(i.extra)}</span>}</div>
                    {i.mods && i.mods.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                        {i.mods.map((m, k) => <span key={k} className="badge badge-muted" style={{ fontSize: 9.5 }}>{m.label}</span>)}
                      </div>
                    )}
                    <input className="input" style={{ padding: '5px 9px', marginTop: 7, fontSize: 12.5 }} placeholder="Nota…" value={i.note} onChange={(e) => setNote(i.uid, e.target.value)} />
                  </div>
                  <div className="col" style={{ alignItems: 'flex-end', gap: 8 }}>
                    <span className="num" style={{ fontWeight: 800 }}>{D.fmt(lineTotal(i))}</span>
                    <Stepper value={i.q} onChange={(v) => setQty(i.uid, v)} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
            <div className="kv"><span className="k">Subtotal (IGV incl.)</span><span className="v num">{D.fmt(subtotal)}</span></div>
            <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 10 }} disabled={!canSend} onClick={enviar}>
              {sending ? <><Spinner size={16} /> Enviando…</> : <><Icon name="arrowR" size={18} /> Enviar pedido</>}
            </button>
            {canal === 'DELIVERY' && (!cliente || !dir) && <div className="field-err" style={{ marginTop: 8, justifyContent: 'center' }}><Icon name="info" size={13} /> Cliente y dirección obligatorios.</div>}
          </div>
        </div>

        {modProduct && <C.ModifierModal product={modProduct} onClose={() => setModProduct(null)} onAdd={(cfg) => { addLine(modProduct, cfg); setModProduct(null); toast('ok', 'Agregado al pedido', `${modProduct.nombre} con opciones.`); }} />}
      </div>
    );
  }

  // =====================================================================
  // PEDIDOS
  // =====================================================================
  function Pedidos({ app }) {
    const { store, setStore, toast } = app;
    const C = window.COMMERCE;
    const [estado, setEstado] = useState('todos');
    const [area, setArea] = useState('todos');
    const [canal, setCanal] = useState('todos');
    const [sel, setSel] = useState(null);
    const peds = store.pedidos
      .filter((p) => estado === 'todos' || p.estado === estado)
      .filter((p) => area === 'todos' || p.area === area)
      .filter((p) => canal === 'todos' || (p.canal || 'SALON') === canal)
      .sort((a, b) => b.min - a.min);
    const cnt = (st) => store.pedidos.filter((p) => p.estado === st).length;
    const origin = (p) => {
      const c = p.canal || 'SALON';
      if (c === 'SALON') return { label: `M${p.mesa}`, badge: null };
      return { label: p.cliente || C.CANALES[c].label, badge: c };
    };

    const next = { PENDIENTE: 'EN_PREPARACION', EN_PREPARACION: 'LISTO', LISTO: 'ENTREGADO' };
    const advance = (p) => {
      const n = next[p.estado]; if (!n) return;
      setStore((s) => ({ ...s, pedidos: s.pedidos.map((x) => x.id === p.id ? { ...x, estado: n } : x) }));
      toast('ok', 'Estado actualizado', `${p.id} → ${D.PED_ST[n].label}`);
    };

    return (
      <div data-screen-label="Pedidos">
        <div className="page-h">
          <div><h1>Pedidos</h1><p className="sub">{cnt('PENDIENTE')} pendientes · {cnt('EN_PREPARACION')} en preparación · {cnt('LISTO')} listos · {cnt('ENTREGADO')} despachados</p></div>
          <span className="spacer" />
          <button className="btn btn-ghost" onClick={() => app.go('crear-pedido', { canal: 'LLEVAR' })}><Icon name="inbox" size={16} /> Para llevar</button>
          <button className="btn btn-primary" onClick={() => app.go('crear-pedido', { canal: 'DELIVERY' })}><Icon name="serve" size={16} /> Delivery</button>
        </div>
        <div className="row wrap gap10" style={{ marginBottom: 16 }}>
          <FilterChips value={estado} onChange={setEstado} options={[
            { value: 'todos', label: 'Todos', count: store.pedidos.length },
            { value: 'PENDIENTE', label: 'Pendientes', count: cnt('PENDIENTE') },
            { value: 'EN_PREPARACION', label: 'En preparación', count: cnt('EN_PREPARACION') },
            { value: 'LISTO', label: 'Listos', count: cnt('LISTO') },
            { value: 'ENTREGADO', label: 'Despachados', count: cnt('ENTREGADO') },
          ]} />
          <span className="spacer" />
          <Segmented value={canal} onChange={setCanal} options={[{ value: 'todos', label: 'Canal' }, { value: 'SALON', label: 'Salón' }, { value: 'LLEVAR', label: 'Llevar' }, { value: 'DELIVERY', label: 'Delivery' }]} />
          <Segmented value={area} onChange={setArea} options={[{ value: 'todos', label: 'Todo' }, { value: 'COCINA', label: 'Cocina' }, { value: 'BARRA', label: 'Barra' }]} />
        </div>

        {peds.length === 0 ? (
          <EmptyState icon="pedidos" title="Sin pedidos en esta vista" message="No hay pedidos para los filtros seleccionados." />
        ) : (
          <div className="table-wrap">
            <table className="dt">
              <thead><tr><th>Pedido</th><th>Origen</th><th>Ítems</th><th>Área</th><th>Resp.</th><th>{estado === 'ENTREGADO' ? 'Despachado' : 'Tiempo'}</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {peds.map((p) => {
                  const o = origin(p);
                  return (
                  <tr key={p.id} className="dt-row-click" onClick={() => setSel(p)}>
                    <td><b className="mono" style={{ fontSize: 12.5 }}>{p.id}</b></td>
                    <td><span className="row gap6"><b>{o.label}</b>{o.badge && <span className={`badge ${C.CANALES[o.badge].badge}`} style={{ fontSize: 9.5 }}>{p.prov || C.CANALES[o.badge].label}</span>}</span></td>
                    <td className="t2">{p.items.reduce((a, i) => a + i.q, 0)} ítems</td>
                    <td><Badge kind="muted">{p.area}</Badge></td>
                    <td className="t2">{p.mozo}</td>
                    <td>{p.despachadoAt ? <span className="num t2">{p.despachadoAt}</span> : <span className="num row gap6" style={{ fontWeight: 700, color: p.late ? 'var(--danger-text)' : p.min > 20 ? 'var(--warn-text)' : 'var(--text)' }}>{p.late && <Icon name="alertTri" size={14} />}{p.min} min</span>}</td>
                    <td><StatusBadge map={D.PED_ST} value={p.estado} /></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {next[p.estado] && <button className="btn btn-soft btn-sm" onClick={() => advance(p)}>{D.PED_ST[next[p.estado]].label} <Icon name="chevR" size={14} /></button>}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {sel && <PedidoDrawer pedido={sel} app={app} onClose={() => setSel(null)} onAdvance={advance} next={next} />}
      </div>
    );
  }

  function PedidoDrawer({ pedido, app, onClose, onAdvance, next }) {
    const { setStore, toast } = app;
    const C = window.COMMERCE;
    const [confirmCancel, setConfirmCancel] = useState(false);
    const p = app.store.pedidos.find((x) => x.id === pedido.id) || pedido;
    const canal = p.canal || 'SALON';
    const sub = canal === 'SALON' ? `Mesa ${p.mesa}` : `${C.CANALES[canal].label}${p.cliente ? ' · ' + p.cliente : ''}`;
    const history = [
      { t: 'Creado', time: `Hace ${p.min} min · ${p.mozo}`, active: true },
      p.estado !== 'PENDIENTE' && { t: 'En preparación', time: 'Cocina', active: true },
      (p.estado === 'LISTO' || p.estado === 'ENTREGADO') && { t: 'Listo', time: 'Cocina', active: true },
      p.estado === 'ENTREGADO' && { t: 'Despachado', time: p.despachadoAt || 'Salón', active: true },
      p.estado === 'CANCELADO' && { t: 'Cancelado · ' + (p.cancel || ''), time: '', active: true },
    ].filter(Boolean);
    return (
      <Drawer title={p.id} subtitle={`${sub} · ${p.area} · ${p.mozo}`} onClose={onClose}
        headExtra={<StatusBadge map={D.PED_ST} value={p.estado} />}
        footer={p.estado !== 'CANCELADO' && p.estado !== 'ENTREGADO' ? <>
          <button className="btn btn-ghost" onClick={() => setConfirmCancel(true)}><Icon name="x" size={16} /> Cancelar</button>
          {next[p.estado] && <button className="btn btn-primary btn-block" onClick={() => { onAdvance(p); }}>Avanzar a {D.PED_ST[next[p.estado]].label}</button>}
        </> : null}>
        {canal !== 'SALON' && (
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel-h"><Icon name={C.CANALES[canal].icon} size={17} /><h3>{C.CANALES[canal].label}</h3>{p.prov && <Badge kind="purple">{p.prov}</Badge>}</div>
            <div style={{ padding: '8px 16px 12px' }}>
              <div className="kv"><span className="k">Cliente</span><span className="v">{p.cliente || '—'}</span></div>
              {p.dir && <div className="kv"><span className="k">Dirección</span><span className="v" style={{ textAlign: 'right', maxWidth: 220 }}>{p.dir}</span></div>}
            </div>
          </div>
        )}
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-h"><h3>Ítems</h3></div>
          <div style={{ padding: '8px 16px 12px' }}>
            {p.items.map((it, i) => (
              <div className="kv" key={i} style={{ borderBottom: i < p.items.length - 1 ? '1px solid var(--border)' : 0, alignItems: 'flex-start' }}>
                <span className="k"><b className="num" style={{ color: 'var(--accent-text)', marginRight: 6 }}>{it.q}×</b>{it.n}
                  {it.mods && it.mods.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>{it.mods.map((m, k) => <span key={k} className="badge badge-muted" style={{ fontSize: 9.5 }}>{m}</span>)}</div>}
                  {it.note && <div style={{ color: 'var(--warn-text)', fontSize: 12, fontWeight: 600, marginTop: 4 }}><Icon name="info" size={12} /> {it.note}</div>}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-h"><h3>Historial de estado</h3></div>
          <div style={{ padding: '16px 18px 6px' }}>
            <div className="timeline">{history.map((h, i) => <div className={`tl-item ${h.active ? 'active' : ''}`} key={i}><div className="tl-t">{h.t}</div><div className="tl-time">{h.time}</div></div>)}</div>
          </div>
        </div>
        {confirmCancel && <ConfirmModal tone="danger" title={`¿Cancelar ${p.id}?`} message="El pedido se marcará como CANCELADO. Esta acción queda registrada en el historial." confirmLabel="Cancelar pedido" cancelLabel="Volver"
          onClose={() => setConfirmCancel(false)} onConfirm={() => { setStore((s) => ({ ...s, pedidos: s.pedidos.map((x) => x.id === p.id ? { ...x, estado: 'CANCELADO', cancel: 'Cancelado por mozo' } : x) })); toast('info', 'Pedido cancelado', p.id); setConfirmCancel(false); onClose(); }} />}
      </Drawer>
    );
  }

  // =====================================================================
  // COCINA / KDS
  // =====================================================================
  function Cocina({ app }) {
    const { store, setStore, toast } = app;
    const C = window.COMMERCE;
    const [full, setFull] = useState(false);
    const [dispatch, setDispatch] = useState(false);
    const cols = [
      { key: 'PENDIENTE', label: 'Pendiente', icon: 'clock', next: 'EN_PREPARACION', nextLabel: 'Empezar' },
      { key: 'EN_PREPARACION', label: 'En preparación', icon: 'flame', next: 'LISTO', nextLabel: 'Marcar listo' },
      { key: 'LISTO', label: 'Listo', icon: 'checkCircle', next: 'ENTREGADO', nextLabel: 'Entregado' },
    ];
    const kitchen = store.pedidos.filter((p) => p.area === 'COCINA' && ['PENDIENTE', 'EN_PREPARACION', 'LISTO'].includes(p.estado));
    const advance = (p, to) => { setStore((s) => ({ ...s, pedidos: s.pedidos.map((x) => x.id === p.id ? { ...x, estado: to } : x) })); };

    const Board = (
      <div className="kds">
        {cols.map((c) => {
          const items = kitchen.filter((p) => p.estado === c.key).sort((a, b) => b.min - a.min);
          return (
            <div className="kds-col" key={c.key}>
              <div className="kds-col-h"><Icon name={c.icon} size={17} /> {c.label}<span className="cc num">{items.length}</span></div>
              <div className="kds-list">
                {items.length === 0 ? <div style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 600, fontSize: 13, padding: 24 }}>Sin pedidos</div> :
                  items.map((p) => {
                    const late = p.min > 28, warn = p.min > 18 && p.min <= 28;
                    const oc = p.canal || 'SALON';
                    const head = oc === 'SALON' ? `M${p.mesa}` : (p.cliente || C.CANALES[oc].label);
                    return (
                      <div key={p.id} className={`kds-card ${late ? 'late' : warn ? 'warn' : 'fresh'}`}>
                        <h4>{head} {oc !== 'SALON' && <span className={`badge ${C.CANALES[oc].badge}`} style={{ fontSize: 9.5 }}>{p.prov || C.CANALES[oc].label}</span>} {late ? <Badge kind="danger" dot>{p.min}m · DEMORA</Badge> : <span className="muted num" style={{ fontSize: 13, fontWeight: 700, marginLeft: 'auto' }}>{p.min} min</span>}</h4>
                        <div className="muted" style={{ fontSize: 11.5, fontWeight: 700, marginTop: 3 }}>{p.id} · {p.mozo}</div>
                        <div className="kds-items">
                          {p.items.map((it, i) => <div className="kds-item" key={i}><span className="q num">{it.q}×</span><span style={{ flex: 1 }}>{it.n}{it.mods && it.mods.length > 0 && <div className="note" style={{ color: 'var(--accent-text)' }}>{it.mods.join(' · ')}</div>}{it.note && <div className="note"><Icon name="info" size={12} /> {it.note}</div>}</span></div>)}
                        </div>
                        <button className="btn btn-primary btn-block btn-lg" onClick={() => advance(p, c.next)}>{c.nextLabel} <Icon name="chevR" size={18} /></button>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    );

    if (full) {
      return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'var(--bg)', padding: 18, display: 'flex', flexDirection: 'column' }}>
          <div className="row" style={{ marginBottom: 14 }}><Icon name="cocina" size={22} /><h1 style={{ margin: 0, fontSize: 20 }}>Cocina · KDS</h1><span className="spacer" /><button className="btn btn-ghost" onClick={() => setFull(false)}><Icon name="x" size={16} /> Salir de pantalla completa</button></div>
          <div style={{ flex: 1, minHeight: 0 }}>{Board}</div>
        </div>
      );
    }
    return (
      <div data-screen-label="Cocina" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="page-h">
          <div><h1>Cocina · KDS</h1><p className="sub">{kitchen.filter((p) => p.estado === 'PENDIENTE').length} por preparar · {kitchen.filter((p) => p.min > 28).length} con demora</p></div>
          <span className="spacer" />
          <button className="btn btn-ghost" onClick={() => setDispatch(true)}><Icon name="history" size={16} /> Despachados</button>
          <button className="btn btn-ghost desktop-only" onClick={() => setFull(true)}><Icon name="expand" size={16} /> Pantalla completa</button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>{Board}</div>
        {dispatch && <DespachadosDrawer app={app} onClose={() => setDispatch(false)} />}
      </div>
    );
  }

  function DespachadosDrawer({ app, onClose }) {
    const C = window.COMMERCE;
    const list = app.store.pedidos.filter((p) => p.area === 'COCINA' && p.estado === 'ENTREGADO').sort((a, b) => (b.despachadoAt || '').localeCompare(a.despachadoAt || ''));
    return (
      <Drawer title="Despachados" subtitle={`${list.length} pedidos entregados · hoy`} onClose={onClose}>
        {list.length === 0 ? <EmptyState icon="history" title="Aún sin despachos" message="Los pedidos entregados aparecerán aquí." /> : (
          <div className="col gap10">
            {list.map((p) => {
              const oc = p.canal || 'SALON';
              const head = oc === 'SALON' ? `Mesa ${p.mesa}` : (p.cliente || C.CANALES[oc].label);
              return (
                <div className="card" key={p.id} style={{ padding: 13 }}>
                  <div className="row" style={{ justifyContent: 'space-between', marginBottom: 7 }}>
                    <span className="row gap8"><b className="mono" style={{ fontSize: 12.5 }}>{p.id}</b><span className={`badge ${C.CANALES[oc].badge}`} style={{ fontSize: 9.5 }}>{head}</span></span>
                    <span className="row gap6 num" style={{ fontWeight: 700, color: 'var(--ok-text)' }}><Icon name="checkCircle" size={14} /> {p.despachadoAt || '—'}</span>
                  </div>
                  <div className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>{p.items.map((it) => `${it.q}× ${it.n}`).join(' · ')}</div>
                </div>
              );
            })}
          </div>
        )}
      </Drawer>
    );
  }

  Object.assign(window, { Mesas, CrearPedido, Pedidos, Cocina });
})();
