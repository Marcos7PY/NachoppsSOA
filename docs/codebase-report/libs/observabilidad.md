# Librería Compartida: `@org/observabilidad`

**Ruta:** `libs/observabilidad`
**Responsabilidad:** Proporcionar configuración transversal para telemetría (OpenTelemetry), métricas (Prometheus), logs (Winston) y utilidades comunes ligadas al contexto de la request (decorador de usuario).

## Exportaciones Principales (`src/index.ts`)

### 1. `ObservabilidadModule`
- **Archivo:** `libs/observabilidad/src/lib/observabilidad.module.ts`
- **Decoradores:** `@Global()`, `@Module(...)`
- **Importaciones que registra:**
  - `PrometheusModule.register({ defaultMetrics: { enabled: true }, path: '/telemetry/metrics' })`
  - `WinstonModule.forRoot({ transports: [ new winston.transports.Console({ format: winston.format.combine(winston.format.timestamp(), winston.format.json()) }) ] })`
- **Providers:** Registra `MetricsInterceptor` como un interceptor global de la aplicación (`APP_INTERCEPTOR`).
- **Exporta:** `PrometheusModule`, `WinstonModule`.

### 2. `initTracing(serviceName: string): NodeSDK`
- **Archivo:** `libs/observabilidad/src/lib/tracing.ts`
- **Firma:** `export function initTracing(serviceName: string): NodeSDK`
- **Funcionamiento paso a paso:**
  1. Instancia `OTLPTraceExporter` apuntando a `process.env.OTEL_EXPORTER_OTLP_ENDPOINT` o por defecto a `http://localhost:4318/v1/traces`.
  2. Instancia `NodeSDK` pasándole el nombre del servicio, el exporter, y las auto-instrumentaciones de Node (`getNodeAutoInstrumentations()`).
  3. Ejecuta `sdk.start()`.
  4. Atrapa el evento `process.on('SIGTERM')` para invocar `sdk.shutdown()` de forma elegante.
  5. Retorna la instancia de SDK.

### 3. `MetricsInterceptor`
- **Archivo:** `libs/observabilidad/src/lib/metrics.interceptor.ts`
- **Firma:** `export class MetricsInterceptor implements NestInterceptor`
- **Funcionamiento paso a paso:**
  1. En el constructor, inicializa un `Counter` (nombre `http_requests_total`) y un `Histogram` (nombre `http_request_duration_seconds`) de `prom-client` con *labels* `['method', 'route', 'status_code']`.
  2. Implementa `intercept(context, next)` que extrae la petición HTTP.
  3. Inicia un timer (`startTimer()`).
  4. Usa el operador `tap` de RxJS para interceptar la respuesta exitosa (`next`) o el error (`error`).
  5. Incrementa el contador global y detiene el timer registrando la ruta, método y código de estado real.

### 4. `@UsuarioActual()`
- **Archivo:** `libs/observabilidad/src/lib/user.decorator.ts`
- **Firma:** `export const UsuarioActual = createParamDecorator(...)`
- **Funcionamiento paso a paso:**
  1. Verifica que el contexto sea 'http'.
  2. Extrae el header `authorization`. Si no existe o no empieza con `Bearer `, retorna `null`.
  3. Extrae la parte central del JWT (base64 payload).
  4. Decodifica el Base64 en un objeto JSON nativamente **sin verificar la firma** (debido a que se asume que Kong API Gateway ya lo validó o es para fines de auditoría pasiva).
  5. Retorna `payload.sub` (el UUID del usuario) o `null` si hay error.
