/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */
// screens/reportes/ReportesScreen.tsx - Resumen diario y métricas reales

import { useReportesQuery } from '../../hooks/queries/useReportesQuery';

export function ReportesScreen() {
  const { resumen, loading, error, fetch } = useReportesQuery();

  return (
    <div>
      <div className="page-h">
        <div>
          <h1>Reportes</h1>
          <div className="sub">Métricas reales del turno y ventas del día</div>
        </div>
        <span className="spacer" />
        <button className="btn btn-ghost btn-sm" onClick={() => fetch()} title="Refrescar">
          <RefreshIcon />
        </button>
      </div>

      {error && (
        <div className="banner err module-feedback">
          <AlertIcon />
          <span>{error}</span>
        </div>
      )}

      {!resumen && (loading ? (
        <div className="grid-stats">
          {[1, 2, 3].map((row) => (
            <div key={row} className="stat">
              <div className="skel stat-skel-title" />
              <div className="skel stat-skel-value" />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="e-ic"><ChartIcon /></div>
          <h3>Sin resumen disponible</h3>
          <p>El módulo se mantiene vacío hasta recibir datos reales de reportes.</p>
        </div>
      ))}
      {resumen && (
        <div className="report-stack">
          <div className="grid-stats">
            <div className="stat">
              <div className="k">Ingresos del día</div>
              <div className="v">{resumen.ingresosLabel}</div>
              <div className="d">{resumen.fechaLabel}</div>
            </div>
            <div className="stat">
              <div className="k">Ventas cerradas</div>
              <div className="v">{resumen.totalVentas}</div>
              <div className="d">Cuentas registradas</div>
            </div>
            <div className="stat">
              <div className="k">Ticket promedio</div>
              <div className="v">{resumen.ticketPromedioLabel}</div>
              <div className="d">Calculado desde ingresos reales</div>
            </div>
          </div>

          <div className="module-grid">
            <section className="panel">
              <div className="panel-h"><h3>Ventas por hora</h3></div>
              {resumen.ventasPorHora.length === 0 ? (
                <div className="empty empty-compact">
                  <div className="e-ic"><ChartIcon /></div>
                  <h3>Sin desglose horario</h3>
                  <p>El backend actual no devuelve ventas por hora.</p>
                </div>
              ) : (
                <div className="bars">
                  {(() => {
                    const max = Math.max(...resumen.ventasPorHora.map((y) => y.total)) || 1;
                    return resumen.ventasPorHora.map((item) => {
                      const peak = item.total === max && item.total > 0;
                      return (
                        <div key={item.hora} className="bar-col" title={`${item.hora} · S/ ${item.total.toFixed(2)}`}>
                          <div className="bar" style={{ height: `${Math.max(8, (item.total / max) * 100)}%`, background: peak ? 'var(--accent)' : 'var(--accent-soft)' }} />
                          <span className="bar-lbl">{item.hora}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </section>

            <section className="panel">
              <div className="panel-h"><h3>Top productos</h3></div>
              {resumen.topProductos.length === 0 ? (
                <div className="empty empty-compact">
                  <div className="e-ic"><ListIcon /></div>
                  <h3>Sin top productos</h3>
                  <p>El backend actual no devuelve ranking de productos.</p>
                </div>
              ) : (
                <div className="table-wrap table-wrap-flat">
                  <table className="dt">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Ingresos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumen.topProductos.map((item) => (
                        <tr key={item.productoId ?? item.nombre}>
                          <td><strong>{item.nombre}</strong></td>
                          <td>{item.cantidad}</td>
                          <td>{item.ingresos == null ? 'Sin dato' : `S/ ${item.ingresos.toFixed(2)}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function AlertIcon() {
  return <svg className="ic" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
}

function ChartIcon() {
  return <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m19 9-5 5-4-4-3 3" /></svg>;
}

function ListIcon() {
  return <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></svg>;
}

function RefreshIcon() {
  return <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>;
}
