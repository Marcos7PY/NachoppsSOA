import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildHelmetOptions } from './helmet.config';

describe('buildHelmetOptions', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  // ─── Swagger habilitado (dev por defecto) ──────────────────────

  it('devuelve un objeto con contentSecurityPolicy', () => {
    const opts = buildHelmetOptions({ swaggerEnabled: true });
    expect(opts.contentSecurityPolicy).toBeDefined();
  });

  it('en modo swagger incluye unsafe-inline en scriptSrc', () => {
    const opts = buildHelmetOptions({ swaggerEnabled: true });
    const csp = opts.contentSecurityPolicy as { useDefaults: boolean; directives: Record<string, unknown> };
    expect(csp.directives['scriptSrc']).toContain("'unsafe-inline'");
  });

  it('en modo swagger upgradeInsecureRequests es null', () => {
    const opts = buildHelmetOptions({ swaggerEnabled: true });
    const csp = opts.contentSecurityPolicy as { directives: Record<string, unknown> };
    expect(csp.directives['upgradeInsecureRequests']).toBeNull();
  });

  it('en modo swagger crossOriginEmbedderPolicy es false', () => {
    const opts = buildHelmetOptions({ swaggerEnabled: true });
    expect(opts.crossOriginEmbedderPolicy).toBe(false);
  });

  // ─── Producción (swagger deshabilitado) ───────────────────────

  it('en prod NO incluye unsafe-inline en scriptSrc', () => {
    const opts = buildHelmetOptions({ swaggerEnabled: false });
    const csp = opts.contentSecurityPolicy as { directives: Record<string, unknown> };
    expect(csp.directives['scriptSrc']).not.toContain("'unsafe-inline'");
    expect(csp.directives['scriptSrc']).toContain("'self'");
  });

  it('en prod upgradeInsecureRequests es un array (activa la directiva)', () => {
    const opts = buildHelmetOptions({ swaggerEnabled: false });
    const csp = opts.contentSecurityPolicy as { directives: Record<string, unknown> };
    expect(Array.isArray(csp.directives['upgradeInsecureRequests'])).toBe(true);
  });

  it('styleSrc siempre incluye unsafe-inline (CSS inline de Swagger + PWA)', () => {
    const devOpts = buildHelmetOptions({ swaggerEnabled: true });
    const prodOpts = buildHelmetOptions({ swaggerEnabled: false });
    for (const opts of [devOpts, prodOpts]) {
      const csp = opts.contentSecurityPolicy as { directives: Record<string, unknown> };
      expect(csp.directives['styleSrc']).toContain("'unsafe-inline'");
    }
  });

  it('frameAncestors siempre es none (anti-clickjacking)', () => {
    const opts = buildHelmetOptions({ swaggerEnabled: false });
    const csp = opts.contentSecurityPolicy as { directives: Record<string, unknown> };
    expect(csp.directives['frameAncestors']).toContain("'none'");
  });

  it('objectSrc siempre es none', () => {
    const opts = buildHelmetOptions({ swaggerEnabled: false });
    const csp = opts.contentSecurityPolicy as { directives: Record<string, unknown> };
    expect(csp.directives['objectSrc']).toContain("'none'");
  });

  // ─── Inferencia desde NODE_ENV ────────────────────────────────

  it('sin parámetros en NODE_ENV=production infiere swagger=false', () => {
    process.env.NODE_ENV = 'production';
    const opts = buildHelmetOptions();
    const csp = opts.contentSecurityPolicy as { directives: Record<string, unknown> };
    expect(csp.directives['scriptSrc']).not.toContain("'unsafe-inline'");
  });

  it('sin parámetros en NODE_ENV=development infiere swagger=true', () => {
    process.env.NODE_ENV = 'development';
    const opts = buildHelmetOptions();
    const csp = opts.contentSecurityPolicy as { directives: Record<string, unknown> };
    expect(csp.directives['scriptSrc']).toContain("'unsafe-inline'");
  });
});
