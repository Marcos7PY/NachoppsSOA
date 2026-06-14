import { describe, it, expect } from 'vitest';
import { otelTraceFormat } from './log-trace.format';

describe('otelTraceFormat (plan 5.1)', () => {
  it('sin span activo no agrega trace_id y respeta el resto del info', () => {
    const out = otelTraceFormat().transform({ level: 'info', message: 'hola' }) as Record<string, unknown>;
    expect(out).toBeTruthy();
    expect(out['trace_id']).toBeUndefined();
    expect(out['message']).toBe('hola');
  });

  it('agrega service cuando OTEL_SERVICE_NAME está definido', () => {
    const prev = process.env.OTEL_SERVICE_NAME;
    process.env.OTEL_SERVICE_NAME = 'servicio-x';
    const out = otelTraceFormat().transform({ level: 'info', message: 'm' }) as Record<string, unknown>;
    expect(out['service']).toBe('servicio-x');
    if (prev === undefined) delete process.env.OTEL_SERVICE_NAME;
    else process.env.OTEL_SERVICE_NAME = prev;
  });
});
