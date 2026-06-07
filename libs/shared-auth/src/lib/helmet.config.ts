import type { HelmetOptions } from 'helmet';

/**
 * Configuración de Helmet con una CSP explícita (plan 2.4).
 *
 * Los servicios exponen JSON + (en dev) Swagger UI. La CSP por defecto de
 * Helmet v8 rompe Swagger UI porque éste inyecta `<script>`/`<style>` inline y
 * activa `upgrade-insecure-requests` (que sobre http://localhost falla). Por eso:
 *
 *  - En dev (Swagger activo) permitimos inline en script/style y quitamos
 *    `upgrade-insecure-requests`.
 *  - En prod endurecemos: sin `unsafe-inline` en scripts y con upgrade a https.
 *
 * El resto de directivas son seguras para una API y para la PWA que la consume.
 */
export function buildHelmetOptions(opts?: { swaggerEnabled?: boolean }): HelmetOptions {
  const swagger = opts?.swaggerEnabled ?? process.env.NODE_ENV !== 'production';

  return {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        // Swagger UI necesita su bootstrap inline; fuera de dev no lo permitimos.
        scriptSrc: ["'self'", ...(swagger ? ["'unsafe-inline'"] : [])],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https:', 'data:'],
        connectSrc: ["'self'"],
        // `null` elimina la directiva por defecto en dev; `[]` la activa en prod.
        upgradeInsecureRequests: swagger ? null : [],
      },
    },
    // swagger-ui-dist sirve assets que CORP/COEP bloquearían.
    crossOriginEmbedderPolicy: false,
  };
}
