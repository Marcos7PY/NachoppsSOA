// screens-admin.jsx — Inventario, Reportes, Usuarios, Estado del sistema
(function () {
  const { useState, useEffect, useMemo } = React;
  const Icon = window.Icon;
  const D = window.DATA;
  const { Badge, StatusBadge, Spinner, Banner, SearchInput, Segmented, FilterChips, Stepper,
    Drawer, Modal, ConfirmModal, EmptyState, ErrorState } = window;

  // =====================================================================
  // INVENTARIO
  // =====================================================================
  function Inventario({ app }) {
    const { store, setStore, toast } = app;
    const [filtro, setFiltro] = useState('todos');
    const [cat, setCat] = useState('todas');
    const [q, setQ] = useState('');
    const [edit, setEdit] = useState(null); // product or 'new'
    const [reponer, setReponer] = useState(null);

    const prods = store.productos
      .filter((p) => cat === 'todas' || p.cat === cat)
      .filter((p) => filtro === 'todos'
        || (filtro === 'bajo' && p.ctrl && p.stock != null && p.stock <= 6 && p.stock > 0)
        || (filtro === 'sin' && p.stock === 0)
        || (filtro === 'disp' && p.disp)
        || (filtro === 'nodisp' && !p.disp))
      .filter((p) => !q || p.nombre.toLowerCase().includes(q.toLowerCase()));

    const lowCount = store.productos.filter((p) => p.ctrl && p.stock != null && p.stock <= 6).length;
    const toggleDisp = (p) => { setStore((s) => ({ ...s, productos: s.productos.map((x) => x.id === p.id ? { ...x, disp: !x.disp } : x) })); toast(p.disp ? 'info' : 'ok', p.disp ? 'Marcado no disponible' : 'Marcado disponible', p.nombre); };

    return (
      <div data-screen-label="Inventario">
        <div className="page-h">
          <div><h1>Inventario</h1><p className="sub">{store.productos.length} productos · {lowCount} con stock bajo</p></div>
          <span className="spacer" />
          <button className="btn btn-primary" onClick={() => setEdit('new')}><Icon name="plus" size={16} /> Nuevo producto</button>
        </div>

        {lowCount > 0 && <Banner kind="warn" icon="warning" action={<button className="btn btn-sm btn-soft" onClick={() => setFiltro('bajo')}>Ver productos</button>}><b>{lowCount} productos</b> requieren reposición de stock.</Banner>}

        <div className="row wrap gap10" style={{ margin: '16px 0' }}>
          <FilterChips value={filtro} onChange={setFiltro} options={[
            { value: 'todos', label: 'Todos', count: store.productos.length },
            { value: 'bajo', label: 'Bajo stock', count: store.productos.filter((p) => p.ctrl && p.stock <= 6 && p.stock > 0).length },
            { value: 'sin', label: 'Sin stock', count: store.productos.filter((p) => p.stock === 0).length },
            { value: 'nodisp', label: 'No disponibles', count: store.productos.filter((p) => !p.disp).length },
          ]} />
          <span className="spacer" />
          <Segmented value={cat} onChange={setCat} options={[{ value: 'todas', label: 'Todas' }, ...D.cats.map((c) => ({ value: c, label: c }))]} />
          <SearchInput value={q} onChange={setQ} placeholder="Buscar producto…" width={180} />
        </div>

        {prods.length === 0 ? <EmptyState icon="inventario" title="Sin productos" message="No hay productos para estos filtros." /> : (
          <div className="table-wrap">
            <table className="dt">
              <thead><tr><th>Producto</th><th>Categoría</th><th>Área</th><th style={{ textAlign: 'right' }}>Precio</th><th>Stock</th><th>Disponible</th><th></th></tr></thead>
              <tbody>
                {prods.map((p) => {
                  const out = p.stock === 0, low = p.ctrl && p.stock != null && p.stock <= 6 && p.stock > 0;
                  return (
                    <tr key={p.id}>
                      <td><b>{p.nombre}</b></td>
                      <td className="t2">{p.cat}</td>
                      <td><Badge kind="muted">{p.area}</Badge></td>
                      <td className="num" style={{ textAlign: 'right', fontWeight: 700 }}>{D.fmt(p.precio)}</td>
                      <td>{!p.ctrl ? <span className="muted" style={{ fontWeight: 600 }}>Sin control</span> : out ? <Badge kind="danger" dot>SIN STOCK</Badge> : low ? <Badge kind="warn" dot>{p.stock} und</Badge> : <span className="num" style={{ fontWeight: 700 }}>{p.stock} und</span>}</td>
                      <td><button className="seg" style={{ padding: 2 }} onClick={() => toggleDisp(p)}><span className={p.disp ? 'on' : ''} style={{ padding: '4px 9px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: p.disp ? 'var(--ok-soft)' : 'transparent', color: p.disp ? 'var(--ok-text)' : 'var(--muted)' }}>{p.disp ? 'Sí' : 'No'}</span></button></td>
                      <td className="row gap6" onClick={(e) => e.stopPropagation()}>
                        {p.ctrl && <button className="btn btn-soft btn-sm" onClick={() => setReponer(p)}><Icon name="plus" size={14} /> Reponer</button>}
                        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setEdit(p)}><Icon name="edit" size={15} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {edit && <EditProducto app={app} prod={edit === 'new' ? null : edit} onClose={() => setEdit(null)} />}
        {reponer && <ReponerStock app={app} prod={reponer} onClose={() => setReponer(null)} />}
      </div>
    );
  }

  function EditProducto({ app, prod, onClose }) {
    const { setStore, toast } = app;
    const [f, setF] = useState(prod || { nombre: '', cat: 'Fondos', area: 'COCINA', precio: '', stock: '', ctrl: true, disp: true });
    const [err, setErr] = useState(null);
    const upd = (k, v) => { setF({ ...f, [k]: v }); setErr(null); };
    const save = () => {
      if (!f.nombre.trim()) return setErr('nombre');
      if (f.ctrl && (f.stock === '' || Number(f.stock) < 0)) return setErr('stock');
      setStore((s) => {
        if (prod) return { ...s, productos: s.productos.map((x) => x.id === prod.id ? { ...f, precio: Number(f.precio), stock: f.ctrl ? Number(f.stock) : null } : x) };
        return { ...s, productos: [{ ...f, id: 'p' + (s.productos.length + 1), precio: Number(f.precio) || 0, stock: f.ctrl ? Number(f.stock) || 0 : null }, ...s.productos] };
      });
      toast('ok', prod ? 'Producto actualizado' : 'Producto creado', f.nombre); onClose();
    };
    return (
      <Drawer title={prod ? 'Editar producto' : 'Nuevo producto'} onClose={onClose}
        footer={<><button className="btn btn-ghost btn-block" onClick={onClose}>Cancelar</button><button className="btn btn-primary btn-block" onClick={save}>Guardar</button></>}>
        <div className="col gap16">
          <div className="field"><label>Nombre</label><div className={`input ${err === 'nombre' ? 'invalid' : ''}`}><Icon name="tag" size={16} /><input value={f.nombre} onChange={(e) => upd('nombre', e.target.value)} placeholder="Nombre del producto" /></div>{err === 'nombre' && <div className="field-err"><Icon name="alertTri" size={13} /> El nombre es obligatorio.</div>}</div>
          <div className="row gap12">
            <div className="field" style={{ flex: 1 }}><label>Categoría</label><div className="input"><select value={f.cat} onChange={(e) => upd('cat', e.target.value)}>{D.cats.map((c) => <option key={c}>{c}</option>)}</select></div></div>
            <div className="field" style={{ flex: 1 }}><label>Área</label><div className="input"><select value={f.area} onChange={(e) => upd('area', e.target.value)}><option>COCINA</option><option>BARRA</option></select></div></div>
          </div>
          <div className="field"><label>Precio (S/)</label><div className="input"><Icon name="money" size={16} /><input type="number" value={f.precio} onChange={(e) => upd('precio', e.target.value)} placeholder="0.00" /></div></div>
          <label className="row gap8" style={{ cursor: 'pointer', fontWeight: 600 }}><input type="checkbox" checked={f.ctrl} onChange={(e) => upd('ctrl', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} /> Controlar stock</label>
          {f.ctrl && <div className="field"><label>Stock actual</label><div className={`input ${err === 'stock' ? 'invalid' : ''}`}><Icon name="box" size={16} /><input type="number" value={f.stock} onChange={(e) => upd('stock', e.target.value)} placeholder="0" /></div>{err === 'stock' && <div className="field-err"><Icon name="alertTri" size={13} /> Stock inválido.</div>}</div>}
        </div>
      </Drawer>
    );
  }

  function ReponerStock({ app, prod, onClose }) {
    const { setStore, toast } = app;
    const [add, setAdd] = useState(20);
    return (
      <Modal onClose={onClose} width={380}>
        <div className="modal-body">
          <div className="modal-icon" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}><Icon name="box" size={24} /></div>
          <h3>Reponer stock</h3>
          <p>{prod.nombre} · stock actual <b>{prod.stock} und</b></p>
          <div className="row gap12" style={{ marginTop: 16, alignItems: 'center' }}>
            <Stepper value={add} min={1} max={500} onChange={setAdd} />
            <span className="muted" style={{ fontWeight: 600 }}>→ nuevo stock <b className="num" style={{ color: 'var(--text)' }}>{prod.stock + add} und</b></span>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost btn-block" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary btn-block" onClick={() => { setStore((s) => ({ ...s, productos: s.productos.map((x) => x.id === prod.id ? { ...x, stock: x.stock + add, disp: true } : x) })); toast('ok', 'Stock repuesto', `${prod.nombre} +${add} und`); onClose(); }}>Reponer +{add}</button>
        </div>
      </Modal>
    );
  }

  // =====================================================================
  // REPORTES
  // =====================================================================
  function Reportes({ app }) {
    const [secs, setSecs] = useState(8);
    const [rango, setRango] = useState('hoy');
    useEffect(() => { const id = setInterval(() => setSecs((s) => s + 1), 1000); return () => clearInterval(id); }, []);
    const maxV = Math.max(...D.ventasPorHora.map((d) => d.v));
    const kpis = [
      { k: 'Ventas del día', v: D.fmt(10870), d: '+12% vs ayer', up: true, ic: 'money' },
      { k: 'Transacciones', v: '64', d: '+8 hoy', up: true, ic: 'caja' },
      { k: 'Ticket promedio', v: D.fmt(169.8), d: '−3% vs ayer', up: false, ic: 'dollar' },
      { k: 'Mesas atendidas', v: '38', d: '14 activas', up: true, ic: 'mesas' },
      { k: 'Reservas del día', v: '6', d: '4 confirmadas', up: true, ic: 'reservas' },
    ];
    return (
      <div data-screen-label="Reportes">
        <div className="page-h">
          <div><h1>Reportes</h1><p className="sub row gap6"><span className="conn-dot" style={{ background: 'var(--ok)', width: 7, height: 7 }} /> Datos actualizados hace {secs}s</p></div>
          <span className="spacer" />
          <Segmented value={rango} onChange={setRango} options={[{ value: 'hoy', label: 'Hoy' }, { value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mes' }]} />
          <button className="btn btn-ghost"><Icon name="download" size={16} /> Exportar</button>
        </div>

        <div className="grid-stats" style={{ marginBottom: 16 }}>
          {kpis.map((k) => (
            <div className="stat" key={k.k}>
              <div className="k"><Icon name={k.ic} size={15} /> {k.k}</div>
              <div className="v num">{k.v}</div>
              <div className={`d ${k.up ? 'up' : 'down'}`}><Icon name={k.up ? 'arrowR' : 'chevD'} size={13} style={{ transform: k.up ? 'rotate(-45deg)' : 'none' }} /> {k.d}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 }} className="rep-grid">
          <div className="panel">
            <div className="panel-h"><h3>Ventas por hora</h3><span className="spacer" /><span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>S/ · hoy</span></div>
            <div style={{ padding: '8px 18px 18px' }}>
              <div className="bars">
                {D.ventasPorHora.map((d) => (
                  <div className="bar-col" key={d.h} title={D.fmt(d.v)}>
                    <div className="bar" style={{ height: `${(d.v / maxV) * 100}%` }} />
                    <div className="bar-lbl num">{d.h}h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-h"><h3>Por método de pago</h3></div>
            <div style={{ padding: '14px 18px' }}>
              {D.metodoVentas.map((m) => (
                <div key={m.m} style={{ marginBottom: 14 }}>
                  <div className="row" style={{ justifyContent: 'space-between', marginBottom: 5 }}><b style={{ fontSize: 13 }}>{m.m}</b><span className="num muted" style={{ fontWeight: 700 }}>{D.fmt(m.v)} · {m.pct}%</span></div>
                  <div style={{ height: 8, borderRadius: 6, background: 'var(--surface-3)', overflow: 'hidden' }}><div style={{ width: m.pct + '%', height: '100%', background: 'var(--accent)', borderRadius: 6 }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-h"><h3>Productos más vendidos</h3><span className="spacer" /><button className="btn btn-ghost btn-sm"><Icon name="download" size={14} /> CSV</button></div>
          <table className="dt">
            <thead><tr><th>#</th><th>Producto</th><th style={{ textAlign: 'right' }}>Unidades</th><th style={{ textAlign: 'right' }}>Ventas</th></tr></thead>
            <tbody>
              {D.topProductos.map((p, i) => (
                <tr key={p.n}><td><b className="num muted">{i + 1}</b></td><td><b>{p.n}</b></td><td className="num" style={{ textAlign: 'right', fontWeight: 700 }}>{p.q}</td><td className="num" style={{ textAlign: 'right', fontWeight: 700 }}>{D.fmt(p.v)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // =====================================================================
  // USUARIOS
  // =====================================================================
  function Usuarios({ app }) {
    const { store, setStore, toast } = app;
    const [q, setQ] = useState('');
    const [rol, setRol] = useState('todos');
    const [create, setCreate] = useState(false);
    const [showPerms, setShowPerms] = useState(false);
    const users = store.usuarios.filter((u) => rol === 'todos' || u.rol === rol).filter((u) => !q || u.nombre.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q));
    const toggleActivo = (u) => { setStore((s) => ({ ...s, usuarios: s.usuarios.map((x) => x.id === u.id ? { ...x, estado: x.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' } : x) })); toast('info', u.estado === 'ACTIVO' ? 'Usuario desactivado' : 'Usuario activado', u.nombre); };
    const changeRol = (u, r) => { setStore((s) => ({ ...s, usuarios: s.usuarios.map((x) => x.id === u.id ? { ...x, rol: r } : x) })); toast('ok', 'Rol actualizado', `${u.nombre} → ${r}`); };
    const ROL_BADGE = { Administrador: 'badge-accent', Gerente: 'badge-purple', Mesero: 'badge-info', Cajero: 'badge-ok', Cocina: 'badge-warn' };

    return (
      <div data-screen-label="Usuarios">
        <div className="page-h">
          <div><h1>Usuarios y permisos</h1><p className="sub">{store.usuarios.filter((u) => u.estado === 'ACTIVO').length} activos · {store.usuarios.length} totales</p></div>
          <span className="spacer" />
          <button className="btn btn-ghost" onClick={() => setShowPerms(true)}><Icon name="lock" size={16} /> Permisos por rol</button>
          <button className="btn btn-primary" onClick={() => setCreate(true)}><Icon name="plus" size={16} /> Nuevo usuario</button>
        </div>
        <div className="row wrap gap10" style={{ marginBottom: 16 }}>
          <Segmented value={rol} onChange={setRol} options={[{ value: 'todos', label: 'Todos' }, ...Object.keys(D.roles).map((r) => ({ value: r, label: r }))]} />
          <span className="spacer" />
          <SearchInput value={q} onChange={setQ} placeholder="Buscar usuario…" width={200} />
        </div>
        {users.length === 0 ? <EmptyState icon="usuarios" title="Sin usuarios" message="No se encontraron usuarios." /> : (
          <div className="table-wrap">
            <table className="dt">
              <thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Última actividad</th><th></th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="row gap10"><div className="ava" style={{ width: 32, height: 32, fontSize: 12 }}>{u.nombre.split(' ').map((x) => x[0]).join('').slice(0, 2)}</div><b>{u.nombre}</b></td>
                    <td className="t2">{u.email}</td>
                    <td><div className="input" style={{ padding: '4px 8px', display: 'inline-flex', width: 'auto' }}><select value={u.rol} onChange={(e) => changeRol(u, e.target.value)} style={{ fontWeight: 700, fontSize: 12.5 }}>{Object.keys(D.roles).map((r) => <option key={r}>{r}</option>)}</select></div></td>
                    <td><Badge kind={u.estado === 'ACTIVO' ? 'ok' : 'muted'} dot>{u.estado}</Badge></td>
                    <td className="t2">{u.ultimo}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => toggleActivo(u)}>{u.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {create && <CrearUsuario app={app} onClose={() => setCreate(false)} />}
        {showPerms && <PermisosRol onClose={() => setShowPerms(false)} badge={ROL_BADGE} />}
      </div>
    );
  }

  function CrearUsuario({ app, onClose }) {
    const { store, setStore, toast } = app;
    const [f, setF] = useState({ nombre: '', email: '', rol: 'Mesero' });
    const [err, setErr] = useState(null);
    const upd = (k, v) => { setF({ ...f, [k]: v }); setErr(null); };
    const save = () => {
      if (!f.nombre.trim()) return setErr('nombre');
      if (!/.+@.+\..+/.test(f.email)) return setErr('emailbad');
      if (store.usuarios.some((u) => u.email === f.email)) return setErr('dup');
      setStore((s) => ({ ...s, usuarios: [{ id: 'u' + (s.usuarios.length + 1), ...f, estado: 'ACTIVO', ultimo: 'Nunca' }, ...s.usuarios] }));
      toast('ok', 'Usuario creado', `${f.nombre} · ${f.rol}`); onClose();
    };
    return (
      <Drawer title="Nuevo usuario" onClose={onClose}
        footer={<><button className="btn btn-ghost btn-block" onClick={onClose}>Cancelar</button><button className="btn btn-primary btn-block" onClick={save}>Crear usuario</button></>}>
        {err === 'dup' && <Banner kind="err" icon="alertTri">Ya existe un usuario con el correo {f.email}.</Banner>}
        <div className="col gap16" style={{ marginTop: err === 'dup' ? 14 : 0 }}>
          <div className="field"><label>Nombre completo</label><div className={`input ${err === 'nombre' ? 'invalid' : ''}`}><Icon name="user" size={16} /><input value={f.nombre} onChange={(e) => upd('nombre', e.target.value)} placeholder="Nombre y apellido" /></div>{err === 'nombre' && <div className="field-err"><Icon name="alertTri" size={13} /> El nombre es obligatorio.</div>}</div>
          <div className="field"><label>Correo</label><div className={`input ${err === 'emailbad' || err === 'dup' ? 'invalid' : ''}`}><Icon name="mail" size={16} /><input value={f.email} onChange={(e) => upd('email', e.target.value)} placeholder="usuario@nachopps.pe" /></div>{err === 'emailbad' && <div className="field-err"><Icon name="alertTri" size={13} /> Correo inválido.</div>}</div>
          <div className="field"><label>Rol</label><div className="input"><Icon name="lock" size={16} /><select value={f.rol} onChange={(e) => upd('rol', e.target.value)}>{Object.keys(D.roles).map((r) => <option key={r}>{r}</option>)}</select></div></div>
          <div className="panel" style={{ padding: '12px 14px' }}>
            <div className="muted" style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Permisos de {f.rol}</div>
            {D.roles[f.rol].map((p) => <div key={p} className="row gap8" style={{ fontSize: 13, fontWeight: 600, padding: '3px 0' }}><Icon name="check" size={14} style={{ color: 'var(--ok)' }} /> {p}</div>)}
          </div>
        </div>
      </Drawer>
    );
  }

  function PermisosRol({ onClose, badge }) {
    return (
      <Drawer title="Permisos por rol" subtitle="Qué puede hacer cada rol" onClose={onClose}>
        <div className="col gap12">
          {Object.entries(D.roles).map(([rol, perms]) => (
            <div className="panel" key={rol}>
              <div className="panel-h"><Badge kind={badge[rol].replace('badge-', '')}>{rol}</Badge></div>
              <div style={{ padding: '10px 16px' }}>
                {perms.map((p) => <div key={p} className="row gap8" style={{ fontSize: 13.5, fontWeight: 600, padding: '4px 0' }}><Icon name="check" size={15} style={{ color: 'var(--ok)' }} /> {p}</div>)}
              </div>
            </div>
          ))}
        </div>
      </Drawer>
    );
  }

  // =====================================================================
  // ESTADO DEL SISTEMA (Observabilidad)
  // =====================================================================
  function Estado({ app }) {
    const { store } = app;
    const [refreshing, setRefreshing] = useState(false);
    const svcs = D.servicios;
    const down = svcs.filter((s) => s.estado === 'DOWN').length;
    const degraded = svcs.filter((s) => s.estado === 'DEGRADED').length;
    const overall = down ? 'down' : degraded ? 'degraded' : 'ok';
    const ST = { OK: { cls: 'ok', label: 'OK', badge: 'ok' }, DEGRADED: { cls: 'degraded', label: 'DEGRADADO', badge: 'warn' }, DOWN: { cls: 'down', label: 'CAÍDO', badge: 'danger' } };

    return (
      <div data-screen-label="Estado">
        <div className="page-h">
          <div><h1>Estado del sistema</h1><p className="sub">Salud de microservicios tras Kong · solo administrador</p></div>
          <span className="spacer" />
          <button className={`btn btn-ghost ${refreshing ? '' : ''}`} onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 900); }}>{refreshing ? <Spinner size={15} /> : <Icon name="refresh" size={16} />} Refrescar</button>
        </div>

        <div className="card" style={{ padding: 18, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', borderLeft: `4px solid ${overall === 'ok' ? 'var(--ok)' : overall === 'degraded' ? 'var(--warn)' : 'var(--danger)'}` }}>
          <div className="center" style={{ width: 48, height: 48, borderRadius: 12, background: overall === 'ok' ? 'var(--ok-soft)' : overall === 'degraded' ? 'var(--warn-soft)' : 'var(--danger-soft)', color: overall === 'ok' ? 'var(--ok)' : overall === 'degraded' ? 'var(--warn-text)' : 'var(--danger)' }}><Icon name={overall === 'ok' ? 'checkCircle' : 'alertTri'} size={24} /></div>
          <div style={{ flex: 1 }}>
            <b style={{ fontSize: 17 }}>{overall === 'ok' ? 'Todos los servicios operativos' : overall === 'degraded' ? 'Operación con degradación' : 'Incidente activo'}</b>
            <div className="muted" style={{ fontWeight: 600, fontSize: 13 }}>{down} caídos · {degraded} degradados · {svcs.length - down - degraded} OK</div>
          </div>
          <div className="row gap8"><span className="conn online row gap6"><span className="conn-dot" /> Backend conectado</span></div>
        </div>

        {down > 0 && <Banner kind="err" icon="wifiOff">El servicio de <b>Notificaciones</b> está caído. Reintentando conexión automáticamente.</Banner>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, margin: '16px 0' }}>
          {svcs.map((s) => {
            const st = ST[s.estado];
            return (
              <div className={`svc ${st.cls}`} key={s.key} style={{ alignItems: 'flex-start' }}>
                <span className="s-dot" style={{ marginTop: 4 }} />
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ justifyContent: 'space-between' }}><b>{s.n}</b><Badge kind={st.badge} dot>{st.label}</Badge></div>
                  <div className="muted row gap12" style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}><span>Latencia {s.lat}</span><span>Uptime {s.up}</span></div>
                  {s.msg && <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6, color: s.estado === 'DOWN' ? 'var(--danger-text)' : 'var(--warn-text)' }}>{s.msg}</div>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="panel">
          <div className="panel-h"><Icon name="queue" size={18} /><h3>Eventos en cola</h3><span className="spacer" /><span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>Cola de mensajería · DLQ</span></div>
          <div style={{ padding: '6px 16px 14px' }}>
            <div className="kv" style={{ borderBottom: '1px solid var(--border)' }}><span className="k row gap8"><Icon name="inbox" size={15} /> Eventos pendientes de procesar</span><span className="v num"><Badge kind="warn">12</Badge></span></div>
            <div className="kv" style={{ borderBottom: '1px solid var(--border)' }}><span className="k row gap8"><Icon name="alertTri" size={15} /> Mensajes en DLQ (cola de errores)</span><span className="v num"><Badge kind="danger">3</Badge></span></div>
            <div className="kv"><span className="k row gap8"><Icon name="check" size={15} /> Procesados última hora</span><span className="v num">1,842</span></div>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { Inventario, Reportes, Usuarios, Estado });
})();
