// commerce.jsx — Peru fiscal + commerce logic for NachoPps.
// IGV/comprobante, modificadores estructurados, descuentos/cortesías, anulación con autorización.
(function () {
  const { useState } = React;
  const Icon = window.Icon;
  const D = window.DATA;
  const { Badge, Modal, Stepper } = window;

  const IGV = 0.18;
  const taxBreak = (total) => { const base = total / (1 + IGV); return { base, igv: total - base }; };

  // ---------- canales ----------
  const CANALES = {
    SALON:    { label: 'Salón',      icon: 'mesas',    badge: 'badge-muted' },
    LLEVAR:   { label: 'Para llevar', icon: 'inbox',    badge: 'badge-info' },
    DELIVERY: { label: 'Delivery',    icon: 'serve',    badge: 'badge-purple' },
  };
  const PROVEEDORES = ['Rappi', 'PedidosYa', 'Propio'];

  // ---------- modificadores ----------
  const MOD_GROUPS = {
    termino: { label: 'Término', type: 'single', required: true, options: [
      { id: 'rojo', label: 'Rojo / jugoso' }, { id: 'medio', label: 'Término medio' },
      { id: 'tresc', label: 'Tres cuartos' }, { id: 'bien', label: 'Bien cocido' }] },
    guarnicion: { label: 'Guarnición', type: 'single', required: true, options: [
      { id: 'papas', label: 'Papas fritas' }, { id: 'arroz', label: 'Arroz blanco' },
      { id: 'mixto', label: 'Papas + ensalada' }, { id: 'pure', label: 'Puré de papa' }] },
    quitar: { label: 'Quitar ingredientes', type: 'multi', options: [
      { id: 'culantro', label: 'Sin culantro' }, { id: 'cebolla', label: 'Sin cebolla' },
      { id: 'aji', label: 'Sin ají' }, { id: 'sal', label: 'Sin sal' }] },
    extras: { label: 'Extras', type: 'multi', options: [
      { id: 'aji', label: 'Extra ají', price: 2 }, { id: 'doble', label: 'Doble proteína', price: 12 },
      { id: 'queso', label: 'Extra queso', price: 5 }, { id: 'choclo', label: 'Choclo extra', price: 5 }] },
    mitad: { label: 'Mitad y mitad — elige 2', type: 'pick2', options: [
      { id: 'anti', label: 'Anticuchos' }, { id: 'molle', label: 'Mollejitas' },
      { id: 'chich', label: 'Chicharrón' }, { id: 'salchi', label: 'Salchicha huachana' }] },
  };
  const PRODUCT_MODS = {
    p1: ['guarnicion', 'quitar', 'extras'],   // Lomo Saltado
    p4: ['termino', 'guarnicion'],            // Tacu Tacu con Lomo
    p7: ['termino', 'extras'],                // Anticuchos
    p5: ['quitar', 'extras'],                 // Ceviche
    p19: ['mitad', 'extras'],                 // Piqueo Mixto
  };
  const hasMods = (id) => !!PRODUCT_MODS[id];

  // ---------- descuentos ----------
  const DESCUENTOS = [
    { id: 'hh', label: 'Happy Hour −15%', sub: 'Barra y tragos', type: 'pct', value: 15 },
    { id: '2x1', label: '2×1 en tragos', sub: 'Promo nocturna', type: '2x1' },
    { id: 'cupon', label: 'Cupón S/ 20', sub: 'Código promocional', type: 'fixed', value: 20 },
    { id: 'cortesia', label: 'Cortesía 100%', sub: 'Invitación de la casa', type: 'pct', value: 100, auth: true },
  ];
  const calcDescuento = (d, total) => {
    if (d.type === 'pct') return +(total * d.value / 100).toFixed(2);
    if (d.type === 'fixed') return Math.min(d.value, total);
    if (d.type === '2x1') return +(total * 0.18).toFixed(2); // demo: ~un trago gratis
    return 0;
  };

  const VOID_REASONS = ['Cortesía de la casa', 'Error de cocina', 'Cliente insatisfecho', 'Producto agotado', 'Cobrado por error', 'Otro'];

  // ============================================================
  // ModifierModal — configure structured modifiers before adding
  // ============================================================
  function ModifierModal({ product, onAdd, onClose }) {
    const groups = (PRODUCT_MODS[product.id] || []).map((k) => ({ key: k, ...MOD_GROUPS[k] }));
    const [sel, setSel] = useState(() => {
      const s = {}; groups.forEach((g) => { s[g.key] = (g.type === 'multi' || g.type === 'pick2') ? [] : null; }); return s;
    });
    const [qty, setQty] = useState(1);
    const [note, setNote] = useState('');

    const toggle = (g, opt) => {
      setSel((s) => {
        if (g.type === 'single') return { ...s, [g.key]: opt.id };
        const arr = s[g.key] || [];
        const has = arr.includes(opt.id);
        if (g.type === 'pick2' && !has && arr.length >= 2) return s;
        return { ...s, [g.key]: has ? arr.filter((x) => x !== opt.id) : [...arr, opt.id] };
      });
    };
    const isSel = (g, opt) => g.type === 'single' ? sel[g.key] === opt.id : (sel[g.key] || []).includes(opt.id);

    const summary = [];
    let extra = 0;
    groups.forEach((g) => {
      const optById = (id) => g.options.find((o) => o.id === id);
      if (g.type === 'single') { if (sel[g.key]) { const o = optById(sel[g.key]); summary.push({ group: g.label, label: o.label, price: o.price || 0 }); extra += o.price || 0; } }
      else (sel[g.key] || []).forEach((id) => { const o = optById(id); summary.push({ group: g.label, label: o.label, price: o.price || 0 }); extra += o.price || 0; });
    });
    const valid = groups.every((g) => {
      if (g.type === 'single' && g.required) return !!sel[g.key];
      if (g.type === 'pick2') return (sel[g.key] || []).length === 2;
      return true;
    });

    return (
      <Modal onClose={onClose} width={460}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="badge badge-muted" style={{ fontSize: 10 }}>{product.area}</span>
          <div style={{ flex: 1 }}><b style={{ fontSize: 17, fontWeight: 800 }}>{product.nombre}</b><div className="muted mono" style={{ fontSize: 12.5, fontWeight: 600 }}>{D.fmt(product.precio)}{extra > 0 && <span style={{ color: 'var(--accent-text)' }}> + {D.fmt(extra)}</span>}</div></div>
          <button className="icon-btn" style={{ width: 30, height: 30, border: 0, background: 'none' }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div style={{ padding: 20, maxHeight: '52vh', overflowY: 'auto' }}>
          {groups.map((g) => (
            <div key={g.key} style={{ marginBottom: 18 }}>
              <div className="row" style={{ marginBottom: 9 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>{g.label}</span>
                {g.required && <span className="badge badge-accent" style={{ fontSize: 9.5 }}>OBLIGATORIO</span>}
                {g.type === 'multi' && <span className="muted" style={{ fontSize: 11.5, fontWeight: 600 }}>· opcional, varios</span>}
                {g.type === 'pick2' && <span className="muted" style={{ fontSize: 11.5, fontWeight: 600 }}>· elige 2</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {g.options.map((o) => {
                  const on = isSel(g, o);
                  return (
                    <button key={o.id} onClick={() => toggle(g, o)} className="row" style={{
                      justifyContent: 'space-between', padding: '10px 12px', borderRadius: 'var(--r)', textAlign: 'left',
                      border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`, background: on ? 'var(--accent-soft)' : 'var(--surface)',
                      color: on ? 'var(--accent-text)' : 'var(--text)', fontWeight: 600, fontSize: 13,
                    }}>
                      <span className="row gap8">
                        <span style={{ width: 16, height: 16, borderRadius: g.type === 'single' ? '50%' : 5, border: `2px solid ${on ? 'var(--accent)' : 'var(--border-strong)'}`, background: on ? 'var(--accent)' : 'transparent', display: 'grid', placeItems: 'center', flex: 'none' }}>{on && <Icon name="check" size={10} style={{ color: '#fff' }} />}</span>
                        {o.label}
                      </span>
                      {o.price ? <span className="mono" style={{ fontWeight: 700, fontSize: 12 }}>+{D.fmt(o.price)}</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="field"><label>Nota para cocina</label><div className="input" style={{ padding: '8px 11px' }}><Icon name="edit" size={15} /><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. servir al centro…" /></div></div>
        </div>
        <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <Stepper value={qty} min={1} max={20} onChange={setQty} />
          <button className="btn btn-primary btn-block" disabled={!valid} onClick={() => onAdd({ mods: summary, extra, qty, note })}>
            <Icon name="plus" size={16} /> Agregar · {D.fmt((product.precio + extra) * qty)}
          </button>
        </div>
      </Modal>
    );
  }

  // ============================================================
  // DiscountModal — apply discount / cortesía (auth when needed)
  // ============================================================
  function DiscountModal({ subtotal, onApply, onClose }) {
    const [pick, setPick] = useState(null);
    const [pin, setPin] = useState('');
    const d = DESCUENTOS.find((x) => x.id === pick);
    const monto = d ? calcDescuento(d, subtotal) : 0;
    const needAuth = d && d.auth;
    const canApply = d && (!needAuth || pin.length >= 4);
    return (
      <Modal onClose={onClose} width={420}>
        <div className="modal-body">
          <div className="modal-icon" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}><Icon name="tag" size={22} /></div>
          <h3>Descuento o cortesía</h3>
          <p>Selecciona una promoción para la cuenta.</p>
          <div className="col gap8" style={{ marginTop: 16 }}>
            {DESCUENTOS.map((x) => {
              const on = pick === x.id;
              return (
                <button key={x.id} onClick={() => { setPick(x.id); setPin(''); }} className="row" style={{ justifyContent: 'space-between', padding: '11px 13px', borderRadius: 'var(--r)', border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`, background: on ? 'var(--accent-soft)' : 'var(--surface)', textAlign: 'left' }}>
                  <span><b style={{ fontSize: 13.5, display: 'block', color: on ? 'var(--accent-text)' : 'var(--text)' }}>{x.label}</b><span className="muted" style={{ fontSize: 11.5, fontWeight: 600 }}>{x.sub}{x.auth ? ' · requiere autorización' : ''}</span></span>
                  <span className="mono" style={{ fontWeight: 800, color: 'var(--danger-text)' }}>−{D.fmt(calcDescuento(x, subtotal))}</span>
                </button>
              );
            })}
          </div>
          {needAuth && (
            <div className="field" style={{ marginTop: 14 }}>
              <label>Autorización del responsable (PIN)</label>
              <div className="input"><Icon name="lock" size={15} /><input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" maxLength={6} inputMode="numeric" /></div>
              <span className="muted" style={{ fontSize: 11.5, fontWeight: 600 }}>La cortesía 100% queda registrada a nombre de quien autoriza.</span>
            </div>
          )}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost btn-block" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary btn-block" disabled={!canApply} onClick={() => onApply({ label: d.label, monto, auth: needAuth ? 'Camila R.' : null })}>Aplicar −{D.fmt(monto)}</button>
        </div>
      </Modal>
    );
  }

  // ============================================================
  // VoidItemModal — anular ítem con motivo + autorización
  // ============================================================
  function VoidItemModal({ item, onConfirm, onClose }) {
    const [reason, setReason] = useState('');
    const [pin, setPin] = useState('');
    const can = reason && pin.length >= 4;
    return (
      <Modal onClose={onClose} width={420}>
        <div className="modal-body">
          <div className="modal-icon" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}><Icon name="trash" size={22} /></div>
          <h3>Anular ítem</h3>
          <p><b>{item.q}× {item.n}</b> — {D.fmt(item.precio * item.q)}. Quedará registrado con motivo y autorización.</p>
          <div className="field" style={{ marginTop: 16 }}>
            <label>Motivo</label>
            <div className="input"><Icon name="warning" size={15} /><select value={reason} onChange={(e) => setReason(e.target.value)}><option value="">Selecciona un motivo…</option>{VOID_REASONS.map((r) => <option key={r}>{r}</option>)}</select></div>
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <label>Autorización (PIN del responsable)</label>
            <div className="input"><Icon name="lock" size={15} /><input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" maxLength={6} inputMode="numeric" /></div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost btn-block" onClick={onClose}>Cancelar</button>
          <button className="btn btn-danger btn-block" disabled={!can} onClick={() => onConfirm({ reason, authBy: 'Camila R.' })}>Anular ítem</button>
        </div>
      </Modal>
    );
  }

  // ============================================================
  // ReceiptPreview — comprobante electrónico (mono ticket)
  // ============================================================
  function ReceiptPreview({ comp }) {
    const { base, igv } = taxBreak(comp.total);
    return (
      <div style={{ fontFamily: 'var(--mono)', fontSize: 12, background: 'var(--surface-2)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--r)', padding: '16px 18px', lineHeight: 1.7 }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>NACHOPPS S.A.C.</div>
          <div className="muted">RUC 20603451287</div>
          <div className="muted">Av. Sáenz Peña 234 · Barranco, Lima</div>
        </div>
        <div style={{ borderTop: '1px dashed var(--border-strong)', borderBottom: '1px dashed var(--border-strong)', padding: '8px 0', textAlign: 'center', margin: '8px 0' }}>
          <b>{comp.tipo === 'FACTURA' ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA'}</b>
          <div style={{ fontWeight: 700 }}>{comp.serie}-{String(comp.numero).padStart(8, '0')}</div>
        </div>
        {comp.cliente && <div className="muted" style={{ marginBottom: 6 }}>{comp.tipo === 'FACTURA' ? 'RUC' : 'Cliente'}: {comp.doc || '—'}<br />{comp.cliente}</div>}
        {comp.items.map((it, i) => (
          <div key={i} className="row" style={{ justifyContent: 'space-between' }}>
            <span>{it.q}× {it.n}{it.anulado ? ' (ANULADO)' : ''}</span>
            <span style={{ textDecoration: it.anulado ? 'line-through' : 'none' }}>{D.fmt(it.precio * it.q)}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px dashed var(--border-strong)', marginTop: 8, paddingTop: 8 }}>
          {comp.descuento > 0 && <div className="row" style={{ justifyContent: 'space-between', color: 'var(--danger-text)' }}><span>Descuento {comp.descLabel}</span><span>−{D.fmt(comp.descuento)}</span></div>}
          <div className="row" style={{ justifyContent: 'space-between' }}><span>Op. Gravada</span><span>{D.fmt(base)}</span></div>
          <div className="row" style={{ justifyContent: 'space-between' }}><span>IGV (18%)</span><span>{D.fmt(igv)}</span></div>
          <div className="row" style={{ justifyContent: 'space-between', fontWeight: 700, fontSize: 14, marginTop: 4 }}><span>TOTAL</span><span>{D.fmt(comp.total)}</span></div>
        </div>
        <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}><span className="muted">{comp.metodo}</span><span className="muted">{comp.hora}</span></div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10.5 }} className="muted">Representación impresa de comprobante electrónico<br />Autorizado mediante Resolución SUNAT</div>
      </div>
    );
  }

  window.COMMERCE = {
    IGV, taxBreak, CANALES, PROVEEDORES, MOD_GROUPS, PRODUCT_MODS, hasMods,
    DESCUENTOS, calcDescuento, VOID_REASONS,
    ModifierModal, DiscountModal, VoidItemModal, ReceiptPreview,
  };
})();
