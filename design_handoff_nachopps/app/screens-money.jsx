// screens-money.jsx — Caja / Cobro + Reservas
(function () {
  const { useState, useEffect, useMemo } = React;
  const Icon = window.Icon;
  const D = window.DATA;
  const { Badge, StatusBadge, Spinner, Banner, SearchInput, Segmented, FilterChips, Stepper,
    Drawer, Modal, ConfirmModal, EmptyState, ErrorState } = window;

  // =====================================================================
  // CAJA / COBRO
  // =====================================================================
  function Caja({ app }) {
    const { store, setStore, toast, params, go } = app;
    const [tab, setTab] = useState('cobrar');
    const [selCuenta, setSelCuenta] = useState(params.cuenta || null);
    const openMesas = store.mesas.filter((m) => m.estado === 'OCUPADA' && m.cuenta);

    return (
      <div data-screen-label="Caja">
        <div className="page-h">
          <div><h1>Caja</h1><p className="sub">{openMesas.length} cuentas abiertas · cierre de turno 02:00</p></div>
          <div className="seg" style={{ marginLeft: 'auto' }}>
            {[['cobrar', 'Cobrar'], ['tx', 'Transacciones'], ['cierre', 'Cierre']].map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
          </div>
        </div>
        {tab === 'cobrar' && <CajaCobrar app={app} openMesas={openMesas} selCuenta={selCuenta} setSelCuenta={setSelCuenta} />}
        {tab === 'tx' && <CajaTx store={store} />}
        {tab === 'cierre' && <CajaCierre store={store} />}
      </div>
    );
  }

  function CajaCobrar({ app, openMesas, selCuenta, setSelCuenta }) {
    const [paid, setPaid] = useState(null);
    const mesa = openMesas.find((m) => m.cuenta === selCuenta) || openMesas[0];
    if (paid) return <PagoExitoso app={app} comp={paid} mesaN={paid.mesaN} cuenta={paid.cuenta} onNew={() => setPaid(null)} />;
    return (
      <div style={{ display: 'flex', gap: 18 }}>
        <div className="panel" style={{ width: 320, flex: 'none' }}>
          <div className="panel-h"><Icon name="caja" size={18} /><h3>Cuentas por cobrar</h3><Badge kind="accent">{openMesas.length}</Badge></div>
          <div style={{ maxHeight: 560, overflowY: 'auto' }}>
            {openMesas.map((m) => (
              <button key={m.cuenta} onClick={() => setSelCuenta(m.cuenta)} className="row" style={{ width: '100%', textAlign: 'left', padding: '13px 16px', border: 0, borderBottom: '1px solid var(--border)', background: (mesa && mesa.cuenta === m.cuenta) ? 'var(--accent-soft)' : 'transparent', gap: 12 }}>
                <div className="center" style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-3)', fontWeight: 800, fontSize: 15 }}>M{m.n}</div>
                <div style={{ flex: 1 }}><b style={{ display: 'block' }}>{m.cuenta}</b><span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>{m.mozo} · {m.pend ? `${m.pend} pendiente` : 'listo'}</span></div>
                <b className="num">{D.fmt(m.total)}</b>
              </button>
            ))}
          </div>
        </div>
        {mesa ? <CobroForm key={mesa.cuenta} app={app} mesa={mesa} onPaid={(c) => setPaid({ ...c, mesaN: mesa.n, cuenta: mesa.cuenta })} /> : <div className="panel" style={{ flex: 1 }}><EmptyState icon="money" title="Sin cuentas abiertas" message="No hay cuentas pendientes de cobro en este momento." /></div>}
      </div>
    );
  }

  function PagoExitoso({ app, comp, mesaN, cuenta, onNew }) {
    const C = window.COMMERCE;
    return (
      <div className="panel" style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', padding: '28px 24px 8px' }}>
          <div className="modal-icon" style={{ background: 'var(--ok-soft)', color: 'var(--ok)', margin: '0 auto 16px', width: 60, height: 60 }}><Icon name="checkCircle" size={32} /></div>
          <h2 style={{ fontSize: 23, fontWeight: 800, margin: '0 0 6px' }}>Pago exitoso</h2>
          <p className="muted" style={{ fontWeight: 600 }}>Cuenta {cuenta} cerrada · mesa liberada · comprobante emitido.</p>
        </div>
        <div style={{ padding: '8px 24px 0', display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Badge kind="ok" dot>PAGADA</Badge><Badge kind="warn" dot>M{mesaN} · LIMPIEZA</Badge><Badge kind="info">{comp.serie}-{String(comp.numero).padStart(8, '0')}</Badge>
        </div>
        <div style={{ maxWidth: 380, margin: '18px auto', padding: '0 24px' }}>
          <C.ReceiptPreview comp={comp} />
          <div className="row gap8" style={{ marginTop: 16 }}>
            <button className="btn btn-ghost btn-block" onClick={() => app.toast('info', 'Enviando comprobante…', 'A SUNAT y al correo del cliente.')}><Icon name="download" size={16} /> Imprimir / enviar</button>
            <button className="btn btn-primary btn-block" onClick={() => app.go('mesas')}><Icon name="mesas" size={16} /> Volver a mesas</button>
          </div>
          <button className="btn btn-soft btn-block" style={{ marginTop: 8 }} onClick={onNew}>Cobrar otra cuenta</button>
        </div>
      </div>
    );
  }

  function CobroForm({ app, mesa, onPaid }) {
    const { store, setStore, toast, go } = app;
    const C = window.COMMERCE;
    const baseTotal = mesa.total;
    const [metodo, setMetodo] = useState('YAPE');
    const [recibido, setRecibido] = useState('');
    const [tipoComp, setTipoComp] = useState('BOLETA');
    const [doc, setDoc] = useState('');
    const [razon, setRazon] = useState('');
    const [descuento, setDescuento] = useState(null); // {label, monto, auth}
    const [showDisc, setShowDisc] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [err, setErr] = useState(null);

    const total = Math.max(0, +(baseTotal - (descuento ? descuento.monto : 0)).toFixed(2));
    const { base, igv } = C.taxBreak(total);
    const recNum = parseFloat(recibido) || 0;
    const vuelto = recNum - total;
    const esEfectivo = metodo === 'EFECTIVO';
    const esFactura = tipoComp === 'FACTURA';
    const cuentaCerrada = mesa.pend > 0;

    const validate = () => {
      if (esFactura && !/^\d{11}$/.test(doc)) return setErr('ruc');
      if (esFactura && !razon.trim()) return setErr('razon');
      if (esEfectivo && recibido === '') return setErr('vacio');
      if (esEfectivo && recNum <= 0) return setErr('invalido');
      if (esEfectivo && recNum < total) return setErr('insuficiente');
      setErr(null); setConfirm(true);
    };

    const cobrar = () => {
      setConfirm(false); setProcessing(true);
      setTimeout(() => {
        const numero = store.correlativo[tipoComp] + 1;
        const items = (store.cuentas[mesa.cuenta] && store.cuentas[mesa.cuenta].items) || [{ q: 1, n: 'Consumo ' + mesa.cuenta, precio: baseTotal }];
        const hora = '19:' + (40 + store.transacciones.length % 20);
        const receipt = { tipo: tipoComp, serie: esFactura ? 'F001' : 'B001', numero, cliente: esFactura ? razon : (doc ? 'Cliente' : null), doc, items, descuento: descuento ? descuento.monto : 0, descLabel: descuento ? descuento.label : '', total, metodo, hora };
        setProcessing(false); onPaid(receipt);
        setStore((s) => ({
          ...s,
          correlativo: { ...s.correlativo, [tipoComp]: numero },
          mesas: s.mesas.map((m) => m.n === mesa.n ? { ...m, estado: 'LIMPIEZA', total: 0, pend: 0, cuenta: null } : m),
          transacciones: [{ id: 'TX-' + (9921 + s.transacciones.length), mesa: mesa.n, cuenta: mesa.cuenta, metodo, monto: total, hora, estado: 'PAGADA', comp: receipt.serie + '-' + String(numero).padStart(8, '0') }, ...s.transacciones],
        }));
        toast('ok', 'Pago registrado', `${receipt.serie}-${String(numero).padStart(8, '0')} · ${D.fmt(total)}`);
      }, 1300);
    };

    return (
      <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="panel-h"><h3>Cobrar {mesa.cuenta}</h3><Badge kind="info" dot>ABIERTA</Badge><span className="spacer" /><span className="muted" style={{ fontWeight: 600, fontSize: 13 }}>Mesa {mesa.n} · {mesa.mozo}</span></div>
        <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
          {cuentaCerrada && <Banner kind="warn" icon="warning">Hay {mesa.pend} ítem(s) en preparación. Confirma con el mozo antes de cerrar.</Banner>}

          <div style={{ textAlign: 'center', padding: '14px 0 18px' }}>
            <div className="muted" style={{ fontWeight: 700, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '.05em' }}>Total a cobrar</div>
            <div className="num" style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-.02em', marginTop: 4 }}>{D.fmt(total)}</div>
            {descuento && <div className="num muted" style={{ fontWeight: 600, textDecoration: 'line-through' }}>{D.fmt(baseTotal)}</div>}
          </div>

          {/* Comprobante */}
          <div className="field" style={{ marginBottom: 14 }}>
            <label>Comprobante electrónico</label>
            <div className="seg" style={{ width: '100%' }}>
              {[['BOLETA', 'Boleta'], ['FACTURA', 'Factura']].map(([k, l]) => <button key={k} className={tipoComp === k ? 'on' : ''} style={{ flex: 1 }} onClick={() => { setTipoComp(k); setErr(null); }}>{l}</button>)}
            </div>
            {esFactura ? (
              <div className="col gap10" style={{ marginTop: 10 }}>
                <div className={`input ${err === 'ruc' ? 'invalid' : ''}`}><Icon name="inventario" size={15} /><input value={doc} onChange={(e) => { setDoc(e.target.value.replace(/\D/g, '').slice(0, 11)); setErr(null); }} placeholder="RUC (11 dígitos)" inputMode="numeric" /></div>
                {err === 'ruc' && <div className="field-err"><Icon name="alertTri" size={13} /> RUC inválido (11 dígitos).</div>}
                <div className={`input ${err === 'razon' ? 'invalid' : ''}`}><Icon name="usuarios" size={15} /><input value={razon} onChange={(e) => { setRazon(e.target.value); setErr(null); }} placeholder="Razón social" /></div>
                {err === 'razon' && <div className="field-err"><Icon name="alertTri" size={13} /> Ingresa la razón social.</div>}
              </div>
            ) : (
              <div className="input" style={{ marginTop: 10 }}><Icon name="user" size={15} /><input value={doc} onChange={(e) => setDoc(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="DNI del cliente (opcional)" inputMode="numeric" /></div>
            )}
          </div>

          {/* Descuento / cortesía */}
          {descuento ? (
            <div className="row" style={{ justifyContent: 'space-between', padding: '10px 13px', borderRadius: 'var(--r)', background: 'var(--accent-soft)', marginBottom: 14 }}>
              <span className="row gap8"><Icon name="tag" size={15} style={{ color: 'var(--accent)' }} /><b style={{ fontSize: 13, color: 'var(--accent-text)' }}>{descuento.label}</b>{descuento.auth && <span className="badge badge-muted" style={{ fontSize: 9.5 }}>Aut. {descuento.auth}</span>}</span>
              <span className="row gap8"><b className="num" style={{ color: 'var(--danger-text)' }}>−{D.fmt(descuento.monto)}</b><button className="icon-btn" style={{ width: 24, height: 24, border: 0, background: 'none' }} onClick={() => setDescuento(null)}><Icon name="x" size={14} /></button></span>
            </div>
          ) : (
            <button className="btn btn-ghost btn-block" style={{ marginBottom: 14 }} onClick={() => setShowDisc(true)}><Icon name="tag" size={16} /> Aplicar descuento o cortesía</button>
          )}

          {/* IGV breakdown */}
          <div className="panel" style={{ padding: '8px 16px', marginBottom: 16, background: 'var(--surface-2)' }}>
            <div className="kv" style={{ padding: '5px 0' }}><span className="k">Op. Gravada</span><span className="v num">{D.fmt(base)}</span></div>
            <div className="kv" style={{ padding: '5px 0' }}><span className="k">IGV (18%)</span><span className="v num">{D.fmt(igv)}</span></div>
            <div className="kv" style={{ padding: '7px 0 4px', borderTop: '1px solid var(--border)' }}><span className="k" style={{ fontWeight: 800, color: 'var(--text)' }}>Total</span><span className="v num" style={{ fontWeight: 800 }}>{D.fmt(total)}</span></div>
          </div>

          <div className="field" style={{ marginBottom: 18 }}>
            <label>Método de pago</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
              {D.metodos.map((m) => (
                <button key={m} className={`btn ${metodo === m ? 'btn-primary' : 'btn-ghost'}`} style={{ padding: '13px' }} onClick={() => { setMetodo(m); setErr(null); }}>
                  <Icon name={m === 'EFECTIVO' ? 'money' : m === 'TARJETA' ? 'card' : m === 'YAPE' ? 'phone' : 'sync'} size={17} /> {m}
                </button>
              ))}
            </div>
          </div>

          {esEfectivo && (
            <div className="field" style={{ marginBottom: 14 }}>
              <label>Monto recibido</label>
              <div className={`input ${err && ['vacio', 'invalido', 'insuficiente'].includes(err) ? 'invalid' : ''}`} style={{ fontSize: 18 }}>
                <span style={{ fontWeight: 800, color: 'var(--muted)' }}>S/</span>
                <input type="number" value={recibido} onChange={(e) => { setRecibido(e.target.value); setErr(null); }} placeholder="0.00" style={{ fontSize: 18, fontWeight: 700 }} />
              </div>
              {err === 'vacio' && <div className="field-err"><Icon name="alertTri" size={13} /> Ingresa el monto recibido.</div>}
              {err === 'invalido' && <div className="field-err"><Icon name="alertTri" size={13} /> Monto inválido.</div>}
              {err === 'insuficiente' && <div className="field-err"><Icon name="alertTri" size={13} /> Monto insuficiente. Faltan {D.fmt(total - recNum)}.</div>}
              <div className="row" style={{ gap: 8, marginTop: 8 }}>
                {[total, 50, 100, 200].map((v, i) => <button key={i} className="chip" onClick={() => { setRecibido(String(v)); setErr(null); }}>{i === 0 ? 'Exacto' : D.fmt(v)}</button>)}
              </div>
            </div>
          )}

          {esEfectivo && recNum >= total && (
            <div className="panel" style={{ background: 'var(--ok-soft)', border: 0, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: 'var(--ok-text)' }}>Vuelto</span>
              <span className="num" style={{ fontSize: 22, fontWeight: 800, color: 'var(--ok-text)' }}>{D.fmt(vuelto)}</span>
            </div>
          )}
        </div>

        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-primary btn-lg btn-block" disabled={processing} onClick={validate}>
            {processing ? <><Spinner size={16} /> Registrando pago…</> : <><Icon name="check" size={18} /> Cobrar · {D.fmt(total)}</>}
          </button>
        </div>

        {showDisc && <C.DiscountModal subtotal={baseTotal} onClose={() => setShowDisc(false)} onApply={(d) => { setDescuento(d); setShowDisc(false); toast('info', 'Descuento aplicado', d.label); }} />}

        {confirm && (
          <ConfirmModal tone="accent" title="Confirmar cobro" message={`Vas a registrar ${D.fmt(total)} vía ${metodo} y emitir ${esFactura ? 'factura' : 'boleta'} para ${mesa.cuenta}. La mesa se liberará.`}
            confirmLabel="Cobrar y emitir" onClose={() => setConfirm(false)} onConfirm={cobrar}
            extra={<div className="panel" style={{ marginTop: 14, padding: '4px 14px' }}>
              <div className="kv"><span className="k">Comprobante</span><span className="v">{esFactura ? 'Factura' : 'Boleta'}{esFactura ? ' · RUC ' + doc : ''}</span></div>
              <div className="kv"><span className="k">Op. Gravada / IGV</span><span className="v num">{D.fmt(base)} / {D.fmt(igv)}</span></div>
              {descuento && <div className="kv"><span className="k">Descuento</span><span className="v num" style={{ color: 'var(--danger-text)' }}>−{D.fmt(descuento.monto)}</span></div>}
              {esEfectivo && <div className="kv"><span className="k">Recibido / Vuelto</span><span className="v num">{D.fmt(recNum)} / {D.fmt(vuelto)}</span></div>}
            </div>} />
        )}
      </div>
    );
  }

  function CajaTx({ store }) {
    const [metodo, setMetodo] = useState('todos');
    const [estado, setEstado] = useState('todos');
    const [q, setQ] = useState('');
    const tx = store.transacciones
      .filter((t) => metodo === 'todos' || t.metodo === metodo)
      .filter((t) => estado === 'todos' || t.estado === estado)
      .filter((t) => !q || t.mesa.includes(q) || t.id.toLowerCase().includes(q.toLowerCase()));
    return (
      <div>
        <div className="row wrap gap10" style={{ marginBottom: 14 }}>
          <Segmented value={metodo} onChange={setMetodo} options={[{ value: 'todos', label: 'Todos' }, ...D.metodos.map((m) => ({ value: m, label: m }))]} />
          <Segmented value={estado} onChange={setEstado} options={[{ value: 'todos', label: 'Estado' }, { value: 'PAGADA', label: 'Pagadas' }, { value: 'ANULADA', label: 'Anuladas' }]} />
          <span className="spacer" />
          <SearchInput value={q} onChange={setQ} placeholder="Buscar TX o mesa…" width={200} />
        </div>
        {tx.length === 0 ? <EmptyState icon="caja" title="Sin transacciones" message="No hay transacciones para estos filtros." /> : (
          <div className="table-wrap">
            <table className="dt">
              <thead><tr><th>Transacción</th><th>Mesa</th><th>Cuenta</th><th>Método</th><th>Hora</th><th>Estado</th><th style={{ textAlign: 'right' }}>Monto</th></tr></thead>
              <tbody>
                {tx.map((t) => (
                  <tr key={t.id}>
                    <td><b className="mono" style={{ fontSize: 12.5 }}>{t.id}</b></td>
                    <td><b>M{t.mesa}</b></td>
                    <td className="mono t2" style={{ fontSize: 12.5 }}>{t.cuenta}</td>
                    <td><Badge kind="muted">{t.metodo}</Badge></td>
                    <td className="t2 num">{t.hora}</td>
                    <td><StatusBadge map={D.CTA_ST} value={t.estado} /></td>
                    <td className="num" style={{ textAlign: 'right', fontWeight: 800, textDecoration: t.estado === 'ANULADA' ? 'line-through' : 'none', color: t.estado === 'ANULADA' ? 'var(--muted)' : 'var(--text)' }}>{D.fmt(t.monto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  function CajaCierre({ store }) {
    const pagadas = store.transacciones.filter((t) => t.estado === 'PAGADA');
    const total = pagadas.reduce((a, t) => a + t.monto, 0);
    const porMetodo = D.metodos.map((m) => ({ m, v: pagadas.filter((t) => t.metodo === m).reduce((a, t) => a + t.monto, 0), n: pagadas.filter((t) => t.metodo === m).length }));
    return (
      <div>
        <div className="grid-stats" style={{ marginBottom: 16 }}>
          <div className="stat"><div className="k"><Icon name="money" size={15} /> Total cobrado</div><div className="v num">{D.fmt(total)}</div></div>
          <div className="stat"><div className="k"><Icon name="caja" size={15} /> Transacciones</div><div className="v num">{pagadas.length}</div></div>
          <div className="stat"><div className="k"><Icon name="x" size={15} /> Anuladas</div><div className="v num">{store.transacciones.filter((t) => t.estado === 'ANULADA').length}</div></div>
          <div className="stat"><div className="k"><Icon name="dollar" size={15} /> Ticket promedio</div><div className="v num">{D.fmt(total / (pagadas.length || 1))}</div></div>
        </div>
        <div className="panel">
          <div className="panel-h"><h3>Desglose por método</h3><span className="spacer" /><button className="btn btn-ghost btn-sm"><Icon name="download" size={15} /> Exportar cierre</button></div>
          <div style={{ padding: '8px 16px 14px' }}>
            {porMetodo.map((p) => (
              <div className="kv" key={p.m} style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="k row gap8"><Badge kind="muted">{p.m}</Badge><span className="muted">{p.n} transacciones</span></span>
                <span className="v num">{D.fmt(p.v)}</span>
              </div>
            ))}
            <div className="kv" style={{ paddingTop: 12 }}><span className="k" style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Total turno</span><span className="v num" style={{ fontSize: 20, fontWeight: 800 }}>{D.fmt(total)}</span></div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================================
  // RESERVAS
  // =====================================================================
  function Reservas({ app }) {
    const { store, setStore, toast } = app;
    const [view, setView] = useState('agenda');
    const [filtro, setFiltro] = useState('todos');
    const [create, setCreate] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(null);

    const res = store.reservas.filter((r) => filtro === 'todos' || r.estado === filtro).sort((a, b) => a.hora.localeCompare(b.hora));
    const cnt = (st) => store.reservas.filter((r) => r.estado === st).length;

    const setEstado = (id, estado) => setStore((s) => ({ ...s, reservas: s.reservas.map((r) => r.id === id ? { ...r, estado } : r) }));

    return (
      <div data-screen-label="Reservas">
        <div className="page-h">
          <div><h1>Reservas</h1><p className="sub">Hoy · {cnt('CONFIRMADA')} confirmadas · {cnt('PENDIENTE')} pendientes</p></div>
          <span className="spacer" />
          <button className="btn btn-primary" onClick={() => setCreate(true)}><Icon name="plus" size={16} /> Nueva reserva</button>
        </div>
        <div className="row wrap gap10" style={{ marginBottom: 16 }}>
          <FilterChips value={filtro} onChange={setFiltro} options={[
            { value: 'todos', label: 'Todas', count: store.reservas.length },
            { value: 'PENDIENTE', label: 'Pendientes', count: cnt('PENDIENTE') },
            { value: 'CONFIRMADA', label: 'Confirmadas', count: cnt('CONFIRMADA') },
            { value: 'CANCELADA', label: 'Canceladas', count: cnt('CANCELADA') },
          ]} />
        </div>

        {res.length === 0 ? <EmptyState icon="reservas" title="Sin reservas" message="No hay reservas para este filtro." action={<button className="btn btn-primary" onClick={() => setCreate(true)}><Icon name="plus" size={16} /> Crear reserva</button>} /> : (
          <div className="col gap10">
            {res.map((r) => (
              <div className="card" key={r.id} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div className="center" style={{ width: 64, flex: 'none', flexDirection: 'column' }}>
                  <div className="num" style={{ fontSize: 22, fontWeight: 800 }}>{r.hora}</div>
                  <div className="muted" style={{ fontSize: 11, fontWeight: 700 }}>HOY</div>
                </div>
                <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div className="row gap8"><b style={{ fontSize: 15.5 }}>{r.cliente}</b><StatusBadge map={D.RES_ST} value={r.estado} /></div>
                  <div className="muted row gap12" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 3 }}>
                    <span className="row gap6"><Icon name="usuarios" size={13} />{r.personas} personas</span>
                    <span className="row gap6"><Icon name="phone" size={13} />{r.tel}</span>
                    <span className="row gap6"><Icon name="mesas" size={13} />{r.mesa ? 'Mesa ' + r.mesa : 'Sin asignar'}</span>
                  </div>
                </div>
                <div className="row gap8">
                  {r.estado === 'PENDIENTE' && <button className="btn btn-success btn-sm" onClick={() => { setEstado(r.id, 'CONFIRMADA'); toast('ok', 'Reserva confirmada', `${r.cliente} · ${r.hora}`); }}><Icon name="check" size={15} /> Confirmar</button>}
                  {!r.mesa && r.estado !== 'CANCELADA' && <button className="btn btn-ghost btn-sm" onClick={() => toast('info', 'Asignar mesa', 'Selector de mesa disponible.')}><Icon name="mesas" size={15} /> Asignar</button>}
                  <button className="btn btn-ghost btn-sm" onClick={() => toast('info', 'Contactando…', `Llamando a ${r.tel}`)}><Icon name="phone" size={15} /></button>
                  {r.estado !== 'CANCELADA' && <button className="btn btn-ghost btn-sm" onClick={() => setConfirmCancel(r)}><Icon name="x" size={15} /></button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {create && <CrearReserva app={app} onClose={() => setCreate(false)} />}
        {confirmCancel && <ConfirmModal tone="danger" title="¿Cancelar reserva?" message={`Se cancelará la reserva de ${confirmCancel.cliente} (${confirmCancel.hora}). El cliente será notificado.`} confirmLabel="Cancelar reserva" cancelLabel="Volver"
          onClose={() => setConfirmCancel(null)} onConfirm={() => { setEstado(confirmCancel.id, 'CANCELADA'); toast('info', 'Reserva cancelada', confirmCancel.cliente); setConfirmCancel(null); }} />}
      </div>
    );
  }

  function CrearReserva({ app, onClose }) {
    const { store, setStore, toast } = app;
    const [f, setF] = useState({ cliente: '', tel: '', hora: '20:30', personas: 2, mesa: '' });
    const [conflict, setConflict] = useState(false);
    const [saving, setSaving] = useState(false);
    const upd = (k, v) => { setF({ ...f, [k]: v }); setConflict(false); };

    const save = () => {
      // simulate conflict if mesa already reserved at same hora
      const clash = store.reservas.some((r) => r.estado !== 'CANCELADA' && r.mesa && r.mesa === f.mesa && r.hora === f.hora);
      if (clash) { setConflict(true); return; }
      setSaving(true);
      setTimeout(() => {
        setStore((s) => ({ ...s, reservas: [...s.reservas, { id: 'R-' + (507 + s.reservas.length), cliente: f.cliente || 'Cliente', tel: f.tel || '—', hora: f.hora, personas: f.personas, mesa: f.mesa || null, estado: 'PENDIENTE' }] }));
        setSaving(false); toast('ok', 'Reserva creada', `${f.cliente} · ${f.hora} · ${f.personas} pers`); onClose();
      }, 800);
    };

    return (
      <Drawer title="Nueva reserva" subtitle="Hoy · validación de slot" onClose={onClose}
        footer={<><button className="btn btn-ghost btn-block" onClick={onClose}>Cancelar</button><button className="btn btn-primary btn-block" disabled={saving} onClick={save}>{saving ? <><Spinner size={15} /> Guardando…</> : 'Crear reserva'}</button></>}>
        {conflict && <Banner kind="err" icon="alertTri">Ya existe una reserva activa para la Mesa {f.mesa} a las {f.hora}.</Banner>}
        <div className="col gap16" style={{ marginTop: conflict ? 14 : 0 }}>
          <div className="field"><label>Cliente</label><div className="input"><Icon name="user" size={16} /><input value={f.cliente} onChange={(e) => upd('cliente', e.target.value)} placeholder="Nombre del cliente" /></div></div>
          <div className="field"><label>Teléfono</label><div className="input"><Icon name="phone" size={16} /><input value={f.tel} onChange={(e) => upd('tel', e.target.value)} placeholder="999 999 999" /></div></div>
          <div className="row gap12">
            <div className="field" style={{ flex: 1 }}><label>Hora</label><div className="input"><Icon name="clock" size={16} /><input type="time" value={f.hora} onChange={(e) => upd('hora', e.target.value)} /></div></div>
            <div className="field" style={{ flex: 1 }}><label>Comensales</label><div style={{ marginTop: 2 }}><Stepper value={f.personas} min={1} max={20} onChange={(v) => upd('personas', v)} /></div></div>
          </div>
          <div className="field"><label>Mesa preferida</label>
            <div className="input"><Icon name="mesas" size={16} />
              <select value={f.mesa} onChange={(e) => upd('mesa', e.target.value)}>
                <option value="">Sin preferencia</option>
                {store.mesas.map((m) => <option key={m.n} value={m.n}>Mesa {m.n} · {m.cap} pers · {m.zona}</option>)}
              </select>
            </div>
            <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>Prueba Mesa 04 a las 20:30 para ver el conflicto de slot.</span>
          </div>
        </div>
      </Drawer>
    );
  }

  Object.assign(window, { Caja, Reservas });
})();
