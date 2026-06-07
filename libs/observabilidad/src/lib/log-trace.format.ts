import * as winston from 'winston';
import { context, trace } from '@opentelemetry/api';

/**
 * Inyecta el contexto de traza de OpenTelemetry en cada línea de log JSON
 * (plan 5.1): `trace_id`, `span_id` y `correlationId` (= trace_id). Así los logs
 * estructurados se correlacionan con las trazas en Grafana/Loki/Jaeger.
 *
 * El trace context se propaga entre servicios vía headers AMQP/HTTP (OTel
 * propagation), por lo que un mismo `correlationId` recorre toda la saga.
 */
export const otelTraceFormat = winston.format((info) => {
  const span = trace.getSpan(context.active());
  const sc = span?.spanContext();
  if (sc?.traceId) {
    info.trace_id = sc.traceId;
    info.span_id = sc.spanId;
    info.correlationId = sc.traceId;
  }
  const service = process.env.OTEL_SERVICE_NAME ?? process.env.SERVICE_NAME;
  if (service) info.service = service;
  return info;
});
