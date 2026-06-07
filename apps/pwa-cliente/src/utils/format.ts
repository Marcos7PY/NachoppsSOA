// utils/format.ts — helpers de formato compartidos (moneda PEN, tiempos)

/** Formatea un monto en Soles: 42 → "S/ 42.00" */
export function fmt(n: number): string {
  return 'S/ ' + Number(n || 0).toFixed(2);
}

/** ISO de hace `m` minutos */
export function minAgo(m: number): string {
  return new Date(Date.now() - m * 60000).toISOString();
}

/**
 * Fecha local del local (Lima, UTC-5) en formato YYYY-MM-DD.
 * Usar en vez de `new Date().toISOString().slice(0,10)`, que devuelve UTC y
 * adelanta el día desde ~19:00 hora de Lima.
 */
export function fechaLocalISO(date: Date = new Date()): string {
  // en-CA produce el formato YYYY-MM-DD; timeZone lo fija a Lima.
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(date);
}

/** Hora HH:mm (24h) de un ISO */
export function horaOf(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/** Minutos transcurridos (entero) desde un ISO respecto a `now` (ms) */
export function elapsedMin(iso: string, now: number = Date.now()): number {
  return Math.round((now - new Date(iso).getTime()) / 60000);
}

/** Etiqueta legible "hace 5m" / "hace 1h 20m" */
export function elapsedLabel(iso: string, now: number = Date.now()): string {
  const m = elapsedMin(iso, now);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}
