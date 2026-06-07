import { Counter, Gauge, Histogram, register } from 'prom-client';

/**
 * Devuelve un Gauge ya registrado o crea uno nuevo en el registro por defecto.
 *
 * prom-client lanza si se registra dos veces un métrico con el mismo nombre; en
 * un proceso de servicio el provider es singleton, pero en los tests se
 * instancian los processors varias veces (y varios specs comparten el registro
 * global de Vitest). Este patrón "get-or-create" mantiene la idempotencia.
 */
export function getOrCreateGauge(
  name: string,
  help: string,
  labelNames: string[] = [],
): Gauge<string> {
  const existing = register.getSingleMetric(name) as Gauge<string> | undefined;
  if (existing) return existing;
  return new Gauge({ name, help, labelNames });
}

/** Counter idempotente para métricas de negocio (plan 5.2). */
export function getOrCreateCounter(
  name: string,
  help: string,
  labelNames: string[] = [],
): Counter<string> {
  const existing = register.getSingleMetric(name) as Counter<string> | undefined;
  if (existing) return existing;
  return new Counter({ name, help, labelNames });
}

/** Histogram idempotente para métricas de negocio (plan 5.2). */
export function getOrCreateHistogram(
  name: string,
  help: string,
  buckets: number[],
  labelNames: string[] = [],
): Histogram<string> {
  const existing = register.getSingleMetric(name) as Histogram<string> | undefined;
  if (existing) return existing;
  return new Histogram({ name, help, labelNames, buckets });
}
