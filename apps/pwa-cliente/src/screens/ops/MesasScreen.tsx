// screens/ops/MesasScreen.tsx — Grid de mesas con datos reales
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useMesasQuery } from '../../hooks/queries/useMesasQuery';
import { useCuentasQuery } from '../../hooks/queries/useCuentasQuery';
import { usePedidosQuery } from '../../hooks/queries/usePedidosQuery';
import type { MesaVM, EstadoMesa } from '../../types/mesa.types';
import type { PedidoVM } from '../../types/pedido.types';

// ─── Constantes de filtro ───────────────────────────────────────
const FILTROS: { key: EstadoMesa | 'TODAS' | 'CUENTA'; label: string }[] = [
  { key: 'TODAS', label: 'Todas' },
  { key: 'LIBRE', label: 'Libres' },
  { key: 'OCUPADA', label: 'Ocupadas' },
  { key: 'RESERVADA', label: 'Reservadas' },
  { key: 'CUENTA', label: 'Con cuenta' },
];

export function MesasScreen() {
  const navigate = useNavigate();
  const online = useOnlineStatus();
  const { mesas, loading, error, fetch, optimisticCambiarEstado } = useMesasQuery();
  const { pedidos } = usePedidosQuery();
  const [filtro, setFiltro] = useState<EstadoMesa | 'TODAS' | 'CUENTA'>('TODAS');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalMesa, setModalMesa] = useState<MesaVM | null>(null);
  const { cuentaActiva, cargar: cargarCuenta } = useCuentasQuery(selectedId ?? undefined);

  // Ya no necesitamos useEffect para fetch on mount ni window focus, 
  // React Query lo maneja automáticamente.

  const mesasSalon = mesas.filter((m) => m.numeroRaw < 90);
  const pedidosActivosPorMesa = pedidos.reduce<Record<string, PedidoVM[]>>(
    (acc, pedido) => {
      if (pedido.estado === 'PAGADO' || pedido.estado === 'CANCELADO') {
        return acc;
      }
      acc[pedido.mesaId] = [...(acc[pedido.mesaId] ?? []), pedido];
      return acc;
    },
    {},
  );
  const mesaTieneConsumo = (mesa: MesaVM) =>
    Boolean(mesa.cuentaAsociada || pedidosActivosPorMesa[mesa.id]?.length);
  const mesasFiltradas =
    filtro === 'TODAS'
      ? mesasSalon
      : filtro === 'CUENTA'
        ? mesasSalon.filter(mesaTieneConsumo)
        : mesasSalon.filter((m) => m.estado === filtro);

  const conteos: Record<string, number> = {
    TODAS: mesasSalon.length,
    LIBRE: mesasSalon.filter((m) => m.estado === 'LIBRE').length,
    OCUPADA: mesasSalon.filter((m) => m.estado === 'OCUPADA').length,
    RESERVADA: mesasSalon.filter((m) => m.estado === 'RESERVADA').length,
    CUENTA: mesasSalon.filter(mesaTieneConsumo).length,
  };
  const itemsCuentaActiva =
    cuentaActiva && modalMesa && cuentaActiva.mesaId === modalMesa.id
      ? cuentaActiva.pedidos.flatMap((pedido) => pedido.items)
      : [];

  const handleCambiarEstado = async (mesa: MesaVM, nuevoEstado: EstadoMesa) => {
    if (!online) return;
    await optimisticCambiarEstado(mesa.id, nuevoEstado);
    setModalMesa(null);
  };

  // ─── Loading ────────────────────────────────────────────────
  if (loading && mesas.length === 0) {
    return (
      <div>
        <div className="page-h">
          <div>
            <h1>Mesas</h1>
            <div className="sub">Cargando…</div>
          </div>
        </div>
        <div className="mesa-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="mesa-card" style={{ minHeight: 130 }}>
              <div
                className="skel"
                style={{ width: 60, height: 32, marginBottom: 12 }}
              />
              <div
                className="skel"
                style={{ width: '80%', height: 14, marginBottom: 8 }}
              />
              <div className="skel" style={{ width: '50%', height: 14 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────
  if (error) {
    return (
      <div>
        <div className="page-h">
          <div>
            <h1>Mesas</h1>
          </div>
        </div>
        <div className="banner err" style={{ marginBottom: 16 }}>
          <AlertIcon />
          <span>{error}</span>
          <span className="spacer" />
          <button className="btn btn-sm btn-ghost" onClick={() => void fetch()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ─── Empty ──────────────────────────────────────────────────
  if (mesas.length === 0) {
    return (
      <div>
        <div className="page-h">
          <div>
            <h1>Mesas</h1>
          </div>
        </div>
        <div className="empty">
          <div className="e-ic">
            <GridIcon />
          </div>
          <h3>Sin mesas registradas</h3>
          <p>No hay mesas configuradas en el sistema todavía.</p>
        </div>
      </div>
    );
  }

  // ─── Data ───────────────────────────────────────────────────
  return (
    <div>
      <div className="page-h">
        <div>
          <h1>Mesas</h1>
          <div className="sub">
            {mesasSalon.length} mesas · {conteos.LIBRE} libres
          </div>
        </div>
        <span className="spacer" />
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => void fetch()}
          title="Refrescar"
        >
          <RefreshIcon />
        </button>
      </div>

      {/* Filtros */}
      <div className="filters" style={{ marginBottom: 18 }}>
        {FILTROS.map((f) => (
          <button
            key={f.key}
            className={`chip ${filtro === f.key ? 'on' : ''}`}
            onClick={() => setFiltro(f.key)}
          >
            {f.label}
            <span className="n">{conteos[f.key]}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mesa-grid">
        {mesasFiltradas.map((mesa) => {
          const pedidosMesa = pedidosActivosPorMesa[mesa.id] ?? [];
          const totalMesa = pedidosMesa.reduce(
            (sum, pedido) => sum + Number(pedido.total),
            0,
          );
          const totalPendientes = pedidosMesa.reduce(
            (sum, pedido) =>
              sum +
              pedido.items.filter(
                (item) =>
                  item.estado !== 'LISTO' &&
                  item.estado !== 'ENTREGADO' &&
                  item.estado !== 'PAGADO',
              ).length,
            0,
          );
          const primerPedido = [...pedidosMesa].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          )[0];
          const tieneConsumo = mesaTieneConsumo(mesa);
          const badgeKind =
            mesa.estado === 'LIBRE'
              ? 'badge-ok'
              : mesa.estado === 'OCUPADA'
                ? 'badge-accent'
                : 'badge-info';
          return (
            <div
              key={mesa.id}
              className={`mesa-card ${mesa.estadoClass} ${selectedId === mesa.id ? 'sel' : ''}`}
              style={{ cursor: 'pointer', textAlign: 'left' }}
              onClick={() => {
                navigate(
                  `/app/crear-pedido?mesaId=${mesa.id}&mesaNumero=${mesa.numero}&canal=SALON`,
                );
              }}
            >
              <div className="mesa-top">
                <div>
                  <div className="mesa-num">M{mesa.numero}</div>
                  <div className="mesa-cap">
                    <PeopleIcon /> {mesa.capacidad} pers · {mesa.zona}
                  </div>
                </div>
                <span
                  className={`badge dot ${badgeKind}`}
                  style={{ cursor: 'pointer', zIndex: 10 }}
                  onClick={async (e) => {
                    e.stopPropagation();
                    setSelectedId(mesa.id);
                    setModalMesa(mesa);
                    await cargarCuenta(mesa.id);
                  }}
                  title="Detalles y Estado"
                >
                  {mesa.estadoLabel}
                </span>
              </div>
              {mesa.estado === 'OCUPADA' ? (
                tieneConsumo ? (
                  <div
                    style={{
                      display: 'grid',
                      gap: 7,
                      marginTop: 12,
                      borderTop: '1px solid var(--border-soft)',
                      paddingTop: 10,
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 12,
                      }}
                    >
                      <div>
                        <div
                          className="muted"
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                          }}
                        >
                          Cuenta
                        </div>
                        <div
                          className="mono"
                          style={{ fontWeight: 900, fontSize: 15 }}
                        >
                          S/ {totalMesa.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div
                          className="muted"
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                          }}
                        >
                          Tiempo
                        </div>
                        <div
                          className="mono"
                          style={{ fontWeight: 900, fontSize: 15 }}
                        >
                          {primerPedido?.tiempoTranscurrido ?? 'Ahora'}
                        </div>
                      </div>
                    </div>
                    <div
                      className="mesa-line"
                      style={{
                        color:
                          totalPendientes > 0
                            ? 'var(--warn-text)'
                            : 'var(--muted)',
                      }}
                    >
                      {totalPendientes > 0 ? <ClockIcon /> : <CheckIcon />}
                      {totalPendientes > 0
                        ? `${totalPendientes} en cocina`
                        : 'Sin pendientes'}
                    </div>
                  </div>
                ) : (
                  <div className="mesa-line" style={{ color: 'var(--muted)' }}>
                    <ReceiptIcon /> Sin cuenta
                  </div>
                )
              ) : mesa.estado === 'RESERVADA' ? (
                <div
                  className="mesa-line"
                  style={{ color: 'var(--info-text)' }}
                >
                  <ClockIcon /> Reservada
                </div>
              ) : (
                <div className="mesa-line muted">
                  <CheckIcon /> Disponible ahora
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Drawer de detalle */}
      {modalMesa && (
        <>
          <div className="scrim" onClick={() => setModalMesa(null)} />
          <aside className="drawer" role="dialog">
            <div className="drawer-h">
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2>Mesa {modalMesa.numero}</h2>
                <div
                  className="muted"
                  style={{ fontSize: 12.5, fontWeight: 600, marginTop: 2 }}
                >
                  {modalMesa.capacidad} personas · {modalMesa.zona}
                </div>
              </div>
              <span
                className={`badge dot ${
                  modalMesa.estado === 'LIBRE'
                    ? 'badge-ok'
                    : modalMesa.estado === 'OCUPADA'
                      ? 'badge-accent'
                      : 'badge-info'
                }`}
              >
                {modalMesa.estadoLabel}
              </span>
              <button
                className="icon-btn"
                onClick={() => setModalMesa(null)}
                aria-label="Cerrar"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="drawer-body">
              {/* Consumo de Cuenta Activa */}
              {modalMesa.estado === 'OCUPADA' && (
                <div className="panel" style={{ marginBottom: 16 }}>
                  <div className="panel-h">
                    <h3>Cuenta Activa</h3>
                    {cuentaActiva && (
                      <span className="badge badge-info dot">
                        {cuentaActiva.id}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '12px 16px' }}>
                    {itemsCuentaActiva.length > 0 ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gap: 6,
                            maxHeight: 180,
                            overflowY: 'auto',
                            paddingRight: 4,
                          }}
                        >
                          {itemsCuentaActiva.map((it, idx) => (
                            <div
                              key={it.id || idx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: 13,
                                borderBottom: '1px solid var(--border-soft)',
                                paddingBottom: 6,
                              }}
                            >
                              <span>
                                <strong style={{ color: 'var(--accent-text)' }}>
                                  {it.cantidad}×
                                </strong>{' '}
                                {it.nombre}
                              </span>
                              <span
                                className="mono"
                                style={{ fontWeight: 'bold' }}
                              >
                                S/{' '}
                                {(
                                  Number(it.precioUnitario) * it.cantidad
                                ).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderTop: '1px solid var(--border)',
                            paddingTop: 10,
                            fontWeight: 'bold',
                            fontSize: 14,
                            marginTop: 4,
                          }}
                        >
                          <span>Total Consumo:</span>
                          <span
                            className="mono"
                            style={{ color: 'var(--accent)', fontSize: 16 }}
                          >
                            S/ {Number(cuentaActiva?.total ?? 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="muted"
                        style={{
                          textAlign: 'center',
                          fontSize: 12.5,
                          padding: 8,
                        }}
                      >
                        {loading
                          ? 'Cargando consumo…'
                          : 'Sin consumos registrados en esta sesión.'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Detalle de Mesa */}
              <div className="panel" style={{ marginBottom: 16 }}>
                <div className="panel-h">
                  <h3>Detalle de mesa</h3>
                </div>
                <div style={{ padding: '6px 16px 12px' }}>
                  <div
                    className="kv"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <span className="k">Estado</span>
                    <span className="v">{modalMesa.estadoLabel}</span>
                  </div>
                  <div
                    className="kv"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <span className="k">Zona</span>
                    <span className="v">{modalMesa.zona}</span>
                  </div>
                  <div
                    className="kv"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <span className="k">Capacidad</span>
                    <span className="v">{modalMesa.capacidad} personas</span>
                  </div>
                  <div className="kv">
                    <span className="k">Cuenta</span>
                    <span className="v">
                      {modalMesa.cuentaAsociada ? (
                        <span className="badge badge-info dot">Activa</span>
                      ) : (
                        <span className="muted">Sin cuenta abierta</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-h">
                  <h3>Cambiar estado</h3>
                </div>
                <div
                  style={{
                    padding: 14,
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  {modalMesa.estado !== 'LIBRE' && (
                    <button
                      className="btn btn-sm btn-ghost"
                      disabled={!online}
                      onClick={() => handleCambiarEstado(modalMesa, 'LIBRE')}
                    >
                      Marcar libre
                    </button>
                  )}
                  {modalMesa.estado !== 'OCUPADA' && (
                    <button
                      className="btn btn-sm btn-ghost"
                      disabled={!online}
                      onClick={() => handleCambiarEstado(modalMesa, 'OCUPADA')}
                    >
                      Marcar ocupada
                    </button>
                  )}
                  {modalMesa.estado !== 'RESERVADA' && (
                    <button
                      className="btn btn-sm btn-ghost"
                      disabled={!online}
                      onClick={() =>
                        handleCambiarEstado(modalMesa, 'RESERVADA')
                      }
                    >
                      Marcar reservada
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="drawer-foot">
              {modalMesa.estado === 'OCUPADA' && (
                <button
                  className="btn btn-ghost btn-block"
                  onClick={() => {
                    const m = modalMesa;
                    setModalMesa(null);
                    navigate(`/app/caja?mesaId=${m.id}`);
                  }}
                >
                  Ver cuenta / Caja
                </button>
              )}
              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  const m = modalMesa;
                  setModalMesa(null);
                  navigate(
                    `/app/crear-pedido?mesaId=${m.id}&mesaNumero=${m.numero}&canal=SALON`,
                  );
                }}
              >
                <PlusIcon />{' '}
                {modalMesa.estado === 'OCUPADA'
                  ? 'Agregar pedido'
                  : 'Abrir cuenta'}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

// ─── Inline SVG icons ──────────────────────────────────────────

function AlertIcon() {
  return (
    <svg
      className="ic"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      className="ic"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      className="ic"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      className="ic"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="ic"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="ic"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5v14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="ic"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg
      className="ic"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2Z" />
      <path d="M8 10h8" />
      <path d="M8 14h4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="ic"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
