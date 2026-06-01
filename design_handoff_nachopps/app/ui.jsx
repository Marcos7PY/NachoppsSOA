// ui.jsx — shared UI primitives for NachoPps. Exports to window.
(function () {
  const { useState, useEffect, useRef } = React;
  const Icon = window.Icon;

  // ---------- Badge ----------
  function Badge({ children, kind = 'muted', dot = false, className = '' }) {
    return <span className={`badge badge-${kind} ${dot ? 'dot' : ''} ${className}`}>{children}</span>;
  }
  // status badge from a map entry {label, badge}
  function StatusBadge({ map, value, dot = true }) {
    const s = map[value]; if (!s) return null;
    const kind = s.badge.replace('badge-', '');
    return <Badge kind={kind} dot={dot}>{s.label}</Badge>;
  }

  // ---------- Spinner ----------
  const Spinner = ({ size }) => <span className="spinner" style={size ? { width: size, height: size } : null} />;

  // ---------- Banner ----------
  function Banner({ kind = 'info', icon, children, action }) {
    return (
      <div className={`banner ${kind}`}>
        {icon && <Icon name={icon} size={17} />}
        <span>{children}</span>
        <span className="spacer" />
        {action}
      </div>
    );
  }

  // ---------- SearchInput ----------
  function SearchInput({ value, onChange, placeholder = 'Buscar…', width }) {
    return (
      <div className="search-box" style={width ? { width } : null}>
        <Icon name="search" size={16} />
        <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        {value && <button className="icon-btn" style={{ width: 22, height: 22, border: 0, background: 'none' }} onClick={() => onChange('')}><Icon name="x" size={14} /></button>}
      </div>
    );
  }

  // ---------- Segmented ----------
  function Segmented({ options, value, onChange }) {
    return (
      <div className="seg">
        {options.map((o) => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          return <button key={val} className={value === val ? 'on' : ''} onClick={() => onChange(val)}>{lbl}</button>;
        })}
      </div>
    );
  }

  // ---------- Filter chips ----------
  function FilterChips({ options, value, onChange }) {
    return (
      <div className="filters">
        {options.map((o) => (
          <button key={o.value} className={`chip ${value === o.value ? 'on' : ''}`} onClick={() => onChange(o.value)}>
            {o.label}{o.count != null && <span className="n">{o.count}</span>}
          </button>
        ))}
      </div>
    );
  }

  // ---------- Stepper ----------
  function Stepper({ value, onChange, min = 0, max = 99 }) {
    return (
      <div className="stepper">
        <button disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}><Icon name="minus" size={15} /></button>
        <span className="qv">{value}</span>
        <button disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}><Icon name="plus" size={15} /></button>
      </div>
    );
  }

  // ---------- Drawer ----------
  function Drawer({ title, subtitle, onClose, children, footer, headExtra }) {
    useEffect(() => {
      const h = (e) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
    }, []);
    return (
      <>
        <div className="scrim" onClick={onClose} />
        <aside className="drawer" role="dialog">
          <div className="drawer-h">
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2>{title}</h2>
              {subtitle && <div className="muted" style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2 }}>{subtitle}</div>}
            </div>
            {headExtra}
            <button className="icon-btn" onClick={onClose}><Icon name="x" /></button>
          </div>
          <div className="drawer-body">{children}</div>
          {footer && <div className="drawer-foot">{footer}</div>}
        </aside>
      </>
    );
  }

  // ---------- Modal ----------
  function Modal({ children, onClose, width }) {
    useEffect(() => {
      const h = (e) => e.key === 'Escape' && onClose && onClose();
      window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
    }, []);
    return (
      <div className="modal-wrap">
        <div className="scrim" onClick={onClose} />
        <div className="modal" style={width ? { width } : null} role="dialog">{children}</div>
      </div>
    );
  }

  // ---------- ConfirmModal ----------
  const CONFIRM_TONES = {
    danger: { ic: 'alertTri', bg: 'var(--danger-soft)', fg: 'var(--danger)', btn: 'btn-danger' },
    warn: { ic: 'warning', bg: 'var(--warn-soft)', fg: 'var(--warn-text)', btn: 'btn-primary' },
    accent: { ic: 'money', bg: 'var(--accent-soft)', fg: 'var(--accent)', btn: 'btn-primary' },
    ok: { ic: 'checkCircle', bg: 'var(--ok-soft)', fg: 'var(--ok)', btn: 'btn-success' },
  };
  function ConfirmModal({ tone = 'danger', title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm, onClose, loading, extra }) {
    const t = CONFIRM_TONES[tone] || CONFIRM_TONES.danger;
    return (
      <Modal onClose={loading ? null : onClose}>
        <div className="modal-body">
          <div className="modal-icon" style={{ background: t.bg, color: t.fg }}><Icon name={t.ic} size={24} /></div>
          <h3>{title}</h3>
          <p>{message}</p>
          {extra}
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost btn-block" onClick={onClose} disabled={loading}>{cancelLabel}</button>
          <button className={`btn ${t.btn} btn-block`} onClick={onConfirm} disabled={loading}>
            {loading ? <><Spinner size={15} /> Procesando…</> : confirmLabel}
          </button>
        </div>
      </Modal>
    );
  }

  // ---------- EmptyState ----------
  function EmptyState({ icon = 'inbox', title, message, action }) {
    return (
      <div className="empty">
        <div className="e-ic"><Icon name={icon} size={28} /></div>
        <h3>{title}</h3>
        {message && <p>{message}</p>}
        {action}
      </div>
    );
  }

  // ---------- ErrorState ----------
  function ErrorState({ title = 'No se pudo cargar', message = 'Ocurrió un error al consultar el servicio.', onRetry }) {
    return (
      <div className="empty">
        <div className="e-ic" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}><Icon name="alertTri" size={28} /></div>
        <h3>{title}</h3>
        <p>{message}</p>
        {onRetry && <button className="btn btn-ghost" onClick={onRetry}><Icon name="refresh" size={16} /> Reintentar</button>}
      </div>
    );
  }

  // ---------- Skeleton helpers ----------
  const Skel = ({ w = '100%', h = 14, r = 7, style }) => <div className="skel" style={{ width: w, height: h, borderRadius: r, ...style }} />;
  function SkeletonCards({ count = 8 }) {
    return (
      <div className="mesa-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div className="mesa-card" key={i} style={{ pointerEvents: 'none' }}>
            <div className="mesa-top"><div><Skel w={54} h={26} /><Skel w={80} h={12} style={{ marginTop: 8 }} /></div><Skel w={70} h={20} r={7} /></div>
            <div style={{ display: 'flex', gap: 16, paddingTop: 11, borderTop: '1px solid var(--border)' }}><Skel w={60} h={28} /><Skel w={60} h={28} /></div>
          </div>
        ))}
      </div>
    );
  }
  function SkeletonRows({ cols = 5, rows = 6 }) {
    return (
      <div className="table-wrap">
        <table className="dt"><tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>{Array.from({ length: cols }).map((_, c) => <td key={c}><Skel w={c === 0 ? '60%' : '80%'} /></td>)}</tr>
          ))}
        </tbody></table>
      </div>
    );
  }

  // ---------- Toast (presentational) ----------
  const TOAST_IC = { ok: 'checkCircle', err: 'alertTri', info: 'info', warn: 'warning' };
  function Toast({ t, onDismiss }) {
    useEffect(() => { const id = setTimeout(() => onDismiss(t.id), t.duration || 3800); return () => clearTimeout(id); }, []);
    const colorVar = { ok: 'var(--ok)', err: 'var(--danger)', info: 'var(--info)', warn: 'var(--warn-text)' }[t.kind] || 'var(--info)';
    return (
      <div className={`toast ${t.kind}`}>
        <span className="t-ic" style={{ color: colorVar }}><Icon name={TOAST_IC[t.kind] || 'info'} size={20} /></span>
        <div style={{ flex: 1 }}>
          <b>{t.title}</b>
          {t.msg && <p>{t.msg}</p>}
        </div>
        <button className="icon-btn" style={{ width: 24, height: 24, border: 0, background: 'none' }} onClick={() => onDismiss(t.id)}><Icon name="x" size={15} /></button>
      </div>
    );
  }
  function ToastHost({ toasts, onDismiss }) {
    return <div className="toast-host">{toasts.map((t) => <Toast key={t.id} t={t} onDismiss={onDismiss} />)}</div>;
  }

  // ---------- Loading wrapper: cycles loading -> content, supports error/empty demo ----------
  function useDemoLoad(deps = [], ms = 650) {
    const [state, setState] = useState('loading');
    useEffect(() => { setState('loading'); const id = setTimeout(() => setState('ready'), ms); return () => clearTimeout(id); }, deps);
    return [state, setState];
  }

  Object.assign(window, {
    Badge, StatusBadge, Spinner, Banner, SearchInput, Segmented, FilterChips, Stepper,
    Drawer, Modal, ConfirmModal, EmptyState, ErrorState, Skel, SkeletonCards, SkeletonRows,
    Toast, ToastHost, useDemoLoad,
  });
})();
