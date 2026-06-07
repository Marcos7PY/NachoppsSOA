# Plan de implementación — Cierre de brecha Front/Back

Documento derivado de `informe-conexion-front-back.md` (arquitectura) e `informe-pwa-nachopps.md` (detalle del front)
Workspace: `C:\Users\MARCOS\Desktop\BackActual`
Objetivo: resolver **todos** los hallazgos de ambos informes (21 ítems, de crítico a bajo), en orden de dependencia y con criterios de aceptación verificables.

---

## 1. Objetivo y alcance

Cerrar la frontera front/back sin agregar features nuevas, atacando primero lo que **bloquea** (compilación) y lo que es **peligroso** (autenticación y WebSocket), después la **deuda estructural** (contratos) y por último **rendimiento, calidad de datos y despliegue**.

El plan no toca la arquitectura de eventos (outbox, RabbitMQ, DLQ, idempotencia), que el informe considera robusta. Solo la endurece donde hay riesgo de escala o de doble publicación.

## 2. Cómo trabajar este plan

- Una rama por tarea: `fix/<id-tarea>-<slug>` (ej. `fix/f1-t1-mesa-numeroraw`).
- Cada tarea define un **criterio de aceptación** y un **comando de verificación**. No se cierra hasta que ambos pasan.
- Comando guía transversal (debe quedar en verde al final de cada fase):
  ```powershell
  npm exec nx run pwa-cliente:typecheck
  npm exec nx run-many -t test
  npm exec nx run-many -t lint
  ```
- Los fragmentos de código son **patrones ilustrativos**: hay que adaptarlos a la firma real de cada archivo.

## 3. Resumen de fases y prioridad real

| Fase | Tema | Severidad dominante | Urgencia real |
|---|---|---|---|
| 1 | Estabilización (compilar) | Crítico | **Inmediata** (bloquea release) |
| 2 | Seguridad de sesión y WebSocket | Crítico / Alto | **Inmediata** (riesgo en prod) |
| 3 | Contratos / fuente única de tipos | Alto | Alta (es la causa raíz de la Fase 1) |
| 4 | Rendimiento, paginación, calidad de datos | Medio / Bajo | Media |
| 5 | Despliegue y configuración | Alto / Mejorable | Media (antes de producción) |
| 6 | Offline / POS resiliente | Mejora | Opcional (alcance mayor) |

> **Nota de causalidad:** el bug de la Fase 1 (`MesaVM.numero`) es un *síntoma* de la duplicación de contratos de la Fase 3. La Fase 1 desbloquea, pero si la Fase 3 se posterga, estos errores reaparecerán. No dejar la Fase 3 para "algún día".
>
> **Nota de seguridad:** el agujero del WebSocket (Fase 2) es lo único realmente *peligroso* en producción. La Fase 1 es bloqueante pero no peligrosa. Trata F2-T3/F2-T4 con la misma urgencia que el compilado.

---

## Fase 1 — Estabilización inmediata (desbloquear compilación)

Meta: dejar `pwa-cliente:typecheck` en verde.

### F1-T1 · Lógica numérica de mesas usa `numeroRaw` `[Crítico]`
- **Problema:** `MesaVM.numero` es `string` (presentación) pero las pantallas hacen comparaciones numéricas con él.
- **Archivos:** `apps/pwa-cliente/src/screens/ops/MesasScreen.tsx`, `apps/pwa-cliente/src/screens/ops/DeliveryScreen.tsx`
- **Patrón:**
  ```tsx
  // Antes (falla: 'numero' es string)
  if (m.numero < 90) { /* ... */ }
  if (m.numero === 99) { /* ... */ }

  // Después: la lógica numérica usa numeroRaw; 'numero' queda solo para mostrar
  if (m.numeroRaw < 90) { /* ... */ }
  if (m.numeroRaw === 99) { /* ... */ }
  ```
- **Aceptación:** desaparecen los errores de `DeliveryScreen.tsx(50,66,67)` y `MesasScreen.tsx(46)`. Ninguna comparación/aritmética usa `m.numero`.

### F1-T2 · Guard de `cuentaActiva` antes de render `[Crítico/Bajo]`
- **Problema:** `MesasScreen.tsx(286)` usa `cuentaActiva.total` y `cuentaActiva` puede ser `null`.
- **Patrón:**
  ```tsx
  {cuentaActiva ? <Total value={cuentaActiva.total} /> : <SinCuenta />}
  ```
- **Aceptación:** se va el error `'cuentaActiva' is possibly 'null'`.

### F1-T3 · Eliminar variable no usada `[Bajo]`
- **Archivo/línea:** `DeliveryScreen.tsx(16,9)` — `paramMesaNumero` declarada y nunca leída.
- **Acción:** eliminar la declaración (o consumirla si debía usarse en un filtro de la pantalla; confirmar la intención original antes de borrar).
- **Aceptación:** sin warnings de variable no usada.

### F1-T4 · Typecheck en verde y en CI `[Crítico]`
- **Acción:** correr `npm exec nx run pwa-cliente:typecheck` hasta verde. Añadir el target a la pipeline para que un PR no pueda mergear con typecheck roto.
- **Aceptación:** el comando termina con código 0; CI bloquea regresiones de tipos.

---

## Fase 2 — Seguridad de sesión y WebSocket

Meta: una sola fuente de verdad para la sesión y un WebSocket que autentique por sí mismo.

### F2-T1 · Migrar la PWA a cookie-only `[Alto]`
- **Problema:** el token vive a la vez en cookie HttpOnly **y** en `localStorage` (expuesto a XSS).
- **Detalle real del front:** la clave de `localStorage` es `nachopps.access_token`; `setAuthToken/getAuthToken/clearAuthToken` viven en `client.ts`; `auth.api.ts:login()` llama a `setAuthToken` solo "si la respuesta trae `access_token`"; y `authStore.restore()` (bootstrap en `main.tsx`) también usa el JWT de `localStorage`. Los tres caminos deben pasar a cookie-only.
- **Archivos:** `apps/pwa-cliente/src/api/auth.api.ts`, `apps/pwa-cliente/src/api/client.ts`, `apps/pwa-cliente/src/store/auth.store.ts`, `apps/pwa-cliente/src/main.tsx`
- **Patrón:**
  ```ts
  // client.ts — Antes
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // client.ts — Después: la cookie HttpOnly viaja sola gracias a credentials:'include'
  const headers = { 'Content-Type': 'application/json' };
  // fetch(url, { headers, credentials: 'include' });
  ```
  - En `auth.api.ts`: quitar `localStorage.setItem('access_token', ...)` y cualquier lectura posterior.
  - Mantener `credentials: 'include'` y el manejo de `401` (`auth:expired`).
  - Dejar `Authorization: Bearer` **solo** para clientes no-browser / llamadas service-to-service.
- **Aceptación:** no hay rastros de `nachopps.access_token` en `localStorage` (el tema `nachopps-theme` sí se mantiene); la sesión funciona end-to-end solo con la cookie.

### F2-T2 · Protección CSRF (consecuencia de cookie-only) `[Mejorable / derivado]`
- **Por qué:** al pasar a cookie-only, las operaciones que cambian estado quedan expuestas a CSRF.
- **Acciones:**
  - `SameSite=strict` si front y back comparten dominio; `SameSite=none; Secure` solo si son dominios distintos (ver F5-T4).
  - Patrón double-submit cookie (token CSRF en cookie legible + header `X-CSRF-Token`) para `POST/PATCH/DELETE`.
- **Aceptación:** una petición cross-site sin token CSRF a un endpoint de mutación es rechazada.

### F2-T3 · Validar JWT en `NotificationsGateway` `[Crítico]`
- **Problema:** `handleConnection` no valida el token; quien llegue al gateway entra.
- **Archivo:** `apps/servicio-notificaciones/src/app/notifications.gateway.ts`
- **Patrón:**
  ```ts
  @WebSocketGateway({ path: '/api/socket.io' })
  export class NotificationsGateway implements OnGatewayConnection {
    constructor(private readonly jwt: JwtService) {}

    async handleConnection(socket: Socket) {
      try {
        const token = this.extractToken(socket);
        if (!token) throw new Error('missing token');
        socket.data.user = await this.jwt.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
      } catch {
        socket.emit('auth:error', { message: 'unauthorized' });
        socket.disconnect(true);
      }
    }

    private extractToken(socket: Socket): string | undefined {
      const fromAuth = socket.handshake.auth?.token as string | undefined;
      if (fromAuth) return fromAuth;
      const cookie = socket.handshake.headers.cookie ?? '';
      return cookie.match(/access_token=([^;]+)/)?.[1];
    }
  }
  ```
- **Aceptación:** una conexión sin token válido se cierra inmediatamente (probar conexión directa al puerto y vía Kong).

### F2-T4 · Quitar el token del query string `[Crítico]`
- **Problema:** el cliente manda el JWT en `auth.token` **y además** en `query.jwt` "por compatibilidad con middlewares que lean cualquiera". Pero ese middleware hoy no existe (el gateway no valida, ver F2-T3), así que `query.jwt` solo agrega superficie de fuga (los query strings quedan en logs/URLs) sin aportar nada.
- **Archivo:** `apps/pwa-cliente/src/services/socket.service.ts` (función `connect()`)
- **Patrón:**
  ```ts
  // Antes
  io(BASE_URL, { path: WS_PATH, query: { jwt: token } });
  // Después
  io(BASE_URL, { path: WS_PATH, withCredentials: true, auth: { token } });
  // o, si cookie-only: io(BASE_URL, { path: WS_PATH, withCredentials: true });
  ```
- **Aceptación:** no se envía el JWT por query string; el servidor lo lee de `handshake.auth` o cookie.

> La exposición del puerto interno `3008:3000` se corrige en **F5-T2**. Hasta entonces, F2-T3 es lo que te protege aunque alguien intente saltarse Kong.

---

## Fase 3 — Contratos y fuente única de tipos

Meta: que el front deje de mantener tipos paralelos y consuma una sola fuente compilable.

### F3-T1 · Decidir la fuente única `[Alto]`
- **Opciones:** (a) consumir `@org/contracts` directo, (b) generar cliente tipado desde OpenAPI, (c) mantener tipos locales + tests de contrato runtime.
- **Recomendación:** opción (a). Es un monorepo Nx con `contracts` ya existente; importar es lo más barato y elimina el drift de raíz. Los propios archivos locales (`mesa.types.ts`, `pedido.types.ts`) ya declaran estar "basados en" los contratos, señal de que se quiso compartir y faltó cablearlo.
- **Aceptación:** decisión documentada en el repo (ADR corto).

### F3-T2 · Conectar `pwa-cliente` a `@org/contracts` `[Alto]`
- **Acciones:** agregar la dependencia en el grafo Nx, importar DTOs/commands desde `@org/contracts`, y reemplazar progresivamente los tipos de `apps/pwa-cliente/src/types/*.ts`.
- **Aceptación:** el grafo Nx muestra `pwa-cliente -> contracts`; los `src/types/*` locales que dupliquen DTOs quedan eliminados o reducidos a tipos puramente de UI.

### F3-T3 · Reconciliar VM vs DTO `[Alto]`
- **Problema:** existe una capa ViewModel (`MesaVM`) que transforma el DTO (`numero: number` → `numero: string` + `numeroRaw: number`).
- **Acción:** definir un mapeo explícito `DTO -> VM` en una sola función, dejando claro qué campo es presentación y qué campo es dato. La VM puede seguir existiendo, pero **derivada** del contrato, no inventada.
- **Aceptación:** no hay campos de VM que contradigan el DTO sin pasar por el mapper.

### F3-T4 · Tests de contrato `[Alto]`
- **Acción:** tests que validen, para los endpoints principales (`auth/login`, `mesas`, `pedidos`, `cuentas`), que la respuesta real cumple el schema de `@org/contracts`.
- **Aceptación:** los tests fallan si el backend cambia un DTO sin actualizar el contrato.

### F3-T5 · Identidad real de los ítems de pedido `[Alto · verificar ya]`
- **Problema (nuevo, del detalle del front):** `pedido.mapper` asigna a cada ítem un `id` con `crypto.randomUUID()` cuando el DTO no trae uno. Pero el KDS hace `avanzarItem(itemId)` → `PATCH /pedidos/items/:itemId/estado`: si el id se generó en el cliente, el backend no lo conoce y el avance de ítem **falla o impacta al ítem equivocado**.
- **Acción:** garantizar que `PedidoItemDto` en `@org/contracts` incluya el `id` real del backend; eliminar el fallback `randomUUID()` como identidad de negocio (puede quedar solo como `key` de React, nunca como id que se manda al backend).
- **Aceptación:** todo ítem recibido del backend trae su `id`; `avanzarItem` siempre apunta al ítem correcto. **Verificar contra la respuesta real de `GET /pedidos` cuanto antes** — puede ser un bug activo del KDS, no solo deuda.

### F3-T6 · Estandarizar el envoltorio de respuestas de lista `[Medio]`
- **Problema (nuevo, del detalle del front):** el backend a veces responde listas como array plano y a veces envueltas (`{ mesas: [...] }`); el front lo absorbe con `unwrapArray`/`unwrapEntity` (`response.ts`). Es deuda de contrato disfrazada de utilidad.
- **Acción:** definir en `@org/contracts` un envoltorio único —idealmente `{ data, nextCursor }`, coherente con la paginación de F4-T4— y alinear todos los endpoints. Mantener `unwrap*` solo como capa transitoria.
- **Aceptación:** todos los listados responden con la misma forma; `unwrap*` queda obsoleto.

---

## Fase 4 — Rendimiento, paginación y calidad de datos

Meta: evitar ráfagas de refetch, acotar listados y hacer que los reportes digan la verdad.

### F4-T1 · Debounce/coalescing de invalidaciones por socket `[Medio]`
- **Problema:** un evento dispara varios `GET` y bajo carga genera ráfagas.
- **Detalle real del front:** la función es `invalidateForPattern(pattern)` (ya usa `Promise.allSettled`). Mapeo actual: `pedido.*` → pedidos+mesas+cuentas; `cuenta.*`/`pago.*` → mesas+pedidos+cuentas; `mesa.*` → mesas+pedidos. El único evento de socket escuchado es `pedidoUpdate`. El debounce envuelve `invalidateForPattern`.
- **Archivo:** `apps/pwa-cliente/src/services/socket.service.ts`
- **Patrón:**
  ```ts
  const pending = new Set<string>();
  let timer: ReturnType<typeof setTimeout> | null = null;

  function scheduleInvalidate(key: string, flush: (keys: string[]) => void) {
    pending.add(key);
    if (timer) return;
    timer = setTimeout(() => {
      const keys = [...pending];
      pending.clear();
      timer = null;
      flush(keys); // un refetch por store, una sola vez en la ventana
    }, 300); // 250–500 ms
  }
  ```
- **Aceptación:** N eventos en <300 ms producen como máximo un refetch por store.

### F4-T2 · Patch local desde el payload del socket `[Medio]`
- **Acción:** cuando el evento ya trae el dato suficiente (ej. nuevo estado de una mesa), actualizar el store en memoria en vez de refetchear.
- **Aceptación:** eventos con payload completo no generan `GET` adicional.

### F4-T3 · Cache temporal y dedup en stores `[Medio]`
- **Problema:** los stores hacen `fetch()` en montaje/foco sin TTL ni dedup.
- **Patrón:**
  ```ts
  let lastFetchedAt = 0;
  let inFlight: Promise<T[]> | null = null;
  const TTL = 5_000;

  async function load(force = false) {
    if (!force && Date.now() - lastFetchedAt < TTL) return store.value;
    if (inFlight) return inFlight; // dedup: reusar la request en vuelo
    inFlight = api.get().then((data) => {
      store.set(data);
      lastFetchedAt = Date.now();
      return data;
    }).finally(() => { inFlight = null; });
    return inFlight;
  }
  ```
- **Aceptación:** dos montajes simultáneos comparten una sola request; no se refetchea dentro del TTL.

### F4-T4 · Paginación por cursor en listados `[Medio]`
- **Endpoints:** `GET /pedidos`, `GET /reservas`, `GET /inventario/productos`, `GET /identidad/usuarios`, `GET /caja`.
- **Patrón backend:**
  ```ts
  export class ListQueryDto {
    @IsOptional() @IsInt() @Min(1) @Max(100) @Type(() => Number) limit = 20;
    @IsOptional() @IsString() cursor?: string;
  }

  async list({ limit, cursor }: ListQueryDto) {
    const rows = await this.prisma.pedido.findMany({
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    });
    const hasMore = rows.length > limit;
    return { data: rows.slice(0, limit), nextCursor: hasMore ? rows[limit - 1].id : null };
  }
  ```
  - Añadir filtros por `estado`/`fecha` y `updatedSince` para sync incremental.
  - Front: enviar `limit` y consumir `nextCursor` (scroll/paginado).
- **Aceptación:** ningún listado devuelve la tabla completa; existe `limit` con tope (`notificaciones` ya lo hace a 50, alinear el resto).

### F4-T5 · Endurecer el outbox `[Medio]`
- **Acciones:**
  - Índice: `CREATE INDEX IF NOT EXISTS outbox_status_created_idx ON outbox (status, "createdAt");` (o `@@index([status, createdAt])` en Prisma).
  - Métricas de backlog por servicio (cantidad de `PENDING`).
  - Claim atómico para varias réplicas:
    ```ts
    const batch = await prisma.$queryRaw`
      UPDATE outbox SET status = 'PROCESSING', "claimedAt" = NOW()
      WHERE id IN (
        SELECT id FROM outbox WHERE status = 'PENDING'
        ORDER BY "createdAt" LIMIT ${BATCH_SIZE}
        FOR UPDATE SKIP LOCKED
      ) RETURNING *;
    `;
    ```
  - Batch size configurable por servicio.
- **Aceptación:** con dos instancias, ningún mensaje se publica dos veces; el backlog es observable.

### F4-T6 · Reportes con datos reales `[Medio · solo backend]`
- **Problema:** `servicio-reportes` calcula `topProductos` con una lista estática.
- **El front ya está preparado:** `ReportesScreen` muestra estados vacíos cuando no llegan `topProductos` ni ventas-por-hora, y `reporte.mapper` calcula `ticketPromedio` de forma segura (`null` si no hay ventas). Este arreglo **no requiere tocar el front**, solo emitir los datos reales desde el backend.
- **Acción:** emitir los ítems del ticket en `CuentaCerradaPayload` y mantener una proyección de ventas por producto.
  ```ts
  interface CuentaCerradaPayload {
    cuentaId: string; mesaId: string; total: number;
    items: { productoId: string; nombre: string; cantidad: number; subtotal: number }[]; // nuevo
  }
  // consumidor en reportes -> upsert en proyeccion ventas_por_producto
  ```
- **Aceptación:** `topProductos` proviene de ventas reales agregadas, no de factores derivados del total.

### F4-T7 · `DELETE /reservas/:id` sin body `[Medio]`
- **Acción:** mover cualquier filtro/parámetro del body a path o query (los proxies pueden descartar el body de un DELETE).
- **Aceptación:** el endpoint funciona sin depender de un body.

### F4-T8 · Constantes compartidas para routing keys `[Bajo]`
- **Problema:** colas/bindings mezclan strings literales y `RoutingKeys`.
- **Acción:** consolidar todas las claves en constantes/enum en `@org/shared-rabbitmq` y reemplazar literales.
- **Aceptación:** no quedan strings literales de routing keys fuera del módulo compartido.

### F4-T9 · Mensajes de error consistentes en stores `[Bajo]`
- **Acción:** centralizar el mapeo de errores (incluyendo `429` y `auth:expired`) en una función reutilizable; mensajes accionables, no genéricos.
- **Aceptación:** los stores muestran errores consistentes desde un único mapper.

### F4-T10 · Datos de cliente de delivery/llevar como campos reales `[Medio]`
- **Problema (nuevo, del detalle del front):** en `DeliveryScreen`/`CrearPedidoScreen`, el nombre, teléfono y dirección del cliente se serializan dentro de `notas` del **primer ítem** con el formato `[DELIVERY] Cliente: ... | Tel: ... | Dir: ...`, y el panel de despachos los recupera parseando ese string. Es frágil: se rompe si las notas contienen `|`, no valida, no es consultable y mezcla datos de cliente con notas de cocina.
- **Acción:** agregar campos estructurados al contrato del pedido/delivery (`cliente`, `telefono`, `direccion`, `proveedor`); dejar `notas` solo para indicaciones de cocina.
- **Aceptación:** el panel de despachos lee campos estructurados; ningún dato de cliente viaja dentro de `notas`.

### F4-T11 · Reemplazar el retry-polling tras crear pedido `[Medio]`
- **Problema (nuevo, del detalle del front):** `CrearPedidoScreen` ejecuta `revalidarMesaConCuenta` con `SYNC_RETRY_DELAYS_MS = [0, 500, 1000, 2000]` (hasta 4 reintentos de `fetchMesas` + `cargarCuenta` + `fetchPedidos` = **hasta 12 GET**) para esperar a que el backend cree la cuenta de forma asíncrona. Es un parche frágil sobre la consistencia eventual y una fuente de ráfagas.
- **Acción:** que `POST /pedidos` devuelva en su respuesta el estado resultante de mesa+cuenta (o al menos el `cuentaId`), o que el front se apoye en el evento de socket `cuenta.abierta` en vez de hacer polling. Con cualquiera de las dos, el bucle de reintentos desaparece.
- **Aceptación:** tras crear un pedido no hay reintentos por polling; la UI se actualiza con la respuesta del POST o con el evento de socket.

### F4-T12 · Limpieza de UI: componentes de dominio y elementos muertos `[Bajo]`
- **Problema (nuevo, del detalle del front):** `MesaCard`, `ItemKDS` y `PedidoRow` existen pero `MesasScreen`, `CocinaScreen` y `PedidosScreen` los reimplementan inline (doble mantenimiento). Además, el botón de búsqueda `⌘K` no hace nada y el nombre del local ("Resto Barranco") y los horarios de turno están hardcodeados en `Header`.
- **Acción:** usar los componentes de dominio en las pantallas (o eliminarlos si no se van a adoptar), implementar u ocultar `⌘K`, y mover nombre del local/turnos a configuración.
- **Aceptación:** una sola implementación por componente; sin UI muerta; nombre y turnos configurables.

---

## Fase 5 — Despliegue y configuración

Meta: dejar el routing y los secretos listos para producción.

### F5-T1 · Kong: upstreams a nombres internos de servicio `[Alto]`
- **Problema:** Kong usa `host.docker.internal` (sale al host, frágil en Linux/prod).
- **Archivo:** `infra/kong/kong.yml.template`
- **Patrón:**
  ```yaml
  # Antes
  url: http://host.docker.internal:3001/api/auth
  # Después (nombre del servicio en Compose + puerto INTERNO del contenedor)
  url: http://servicio-identidad:3000/api/auth
  ```
  > Confirmar el puerto interno real (el mapeo `3008:3000` sugiere `3000` para todos) y los nombres de servicio en `docker-compose.yml`.
- **Aceptación:** ninguna entrada de Kong usa `host.docker.internal`; el routing funciona dentro de la red Docker.

### F5-T2 · No publicar puertos internos (salvo dev) `[Alto/Mejorable]`
- **Problema:** `3008:3000` (y similares) permiten saltarse Kong.
- **Acción:** en `docker-compose.prod.yml` quitar los `ports` de los microservicios; exponer solo Kong (`8000`/`8001` según corresponda). Dejar los puertos publicados solo en el compose de desarrollo.
- **Aceptación:** en prod, solo Kong es alcanzable desde fuera; los servicios responden únicamente dentro de la red interna.

### F5-T3 · Separar secretos dev/prod `[Mejorable]`
- **Acción:** archivos de entorno por ambiente y secretos fuera del repo (gestor de secretos/variables de entorno del orquestador). `JWT_SECRET`, credenciales de DB y RabbitMQ no deben compartirse entre dev y prod.
- **Aceptación:** no hay secretos productivos versionados; cada ambiente tiene los suyos.

### F5-T4 · Revisar `SameSite` según dominios `[Mejorable]`
- **Acción:** si front y back se despliegan en dominios distintos, `SameSite=lax` no envía la cookie en navegación cross-site → usar `None; Secure` + CSRF (F2-T2). Si comparten dominio, preferir `strict`.
- **Aceptación:** la cookie viaja correctamente en el escenario de despliegue elegido y el comportamiento CSRF es coherente con F2-T2.

---

## Fase 6 — Offline / POS resiliente (alcance mayor, opcional)

Meta: soportar operación con red intermitente. **Es una feature, no un fix**: planificar aparte y solo si el negocio lo requiere.

### F6-T1 · Lectura offline con stale-while-revalidate `[Mejora]`
- **Acción:** cachear snapshots no sensibles (catálogos, mesas) con estrategia stale-while-revalidate en el service worker.
- **Aceptación:** las pantallas de lectura siguen mostrando datos (marcados como "puede estar desactualizado") sin red.

### F6-T2 · Escritura offline con cola idempotente `[Mejora grande]`
- **Depende de:** endpoints idempotentes (idempotency-key) y de la paginación/`updatedSince` de la Fase 4.
- **Acción:** cola local de mutaciones con clave de idempotencia que se reintenta al reconectar; resolución de conflictos definida.
- **Aceptación:** una mutación creada sin red se aplica exactamente una vez al recuperar conexión.

---

## 4. Matriz de trazabilidad (hallazgo del informe → tarea)

| # | Hallazgo del informe | Severidad | Tarea(s) | Fase |
|---|---|---|---|---|
| 1 | Front no compila por uso de `MesaVM.numero` | Crítico | F1-T1, F1-T2 | 1 |
| 2 | WebSocket backend no autentica conexiones directas | Crítico | F2-T3, F2-T4 (+ F5-T2) | 2/5 |
| 3 | Token duplicado: cookie HttpOnly + `localStorage` | Alto | F2-T1 | 2 |
| 4 | Contratos duplicados en el front | Alto | F3-T1, F3-T2, F3-T3, F3-T4 | 3 |
| 5 | Kong apunta a `host.docker.internal` | Alto | F5-T1 | 5 |
| 6 | Refetch excesivo por socket | Medio | F4-T1, F4-T2 | 4 |
| 7 | Listados sin paginación | Medio | F4-T4 | 4 |
| 8 | `DELETE /reservas/:id` con body | Medio | F4-T7 | 4 |
| 9 | `topProductos` con datos simulados | Medio | F4-T6 | 4 |
| 10 | `paramMesaNumero` declarado y no usado | Bajo | F1-T3 | 1 |
| 11 | Mensajes de error genéricos en stores | Bajo | F4-T9 | 4 |
| 12 | Bindings con strings en vez de constantes | Bajo | F4-T8 | 4 |
| 13 | Stores sin cache temporal (TTL/dedup) | Medio | F4-T3 | 4 |
| 14 | Outbox: backlog / claim atómico / índice | Medio | F4-T5 | 4 |
| 15 | Service worker ignora API (sin offline) | Mejora | F6-T1, F6-T2 | 6 |
| 16 | CSRF al migrar a cookie-only | Mejorable | F2-T2 | 2 |
| + | No exponer puertos internos en prod | Mejorable | F5-T2 | 5 |
| + | Separar secretos dev/prod | Mejorable | F5-T3 | 5 |
| + | Revisar `SameSite` por dominio | Mejorable | F5-T4 | 5 |
| 17 | Ítems de pedido con `id` generado en cliente (riesgo KDS) | Alto | F3-T5 | 3 |
| 18 | Envoltorio de listas inconsistente (array vs objeto) | Medio | F3-T6 | 3 |
| 19 | Datos de cliente de delivery dentro de `notas` | Medio | F4-T10 | 4 |
| 20 | Retry-polling tras `POST /pedidos` (consistencia eventual) | Medio | F4-T11 | 4 |
| 21 | Componentes de dominio duplicados inline / UI muerta | Bajo | F4-T12 | 4 |

## 5. Definition of Done global

- [ ] `pwa-cliente:typecheck` en verde y protegido en CI.
- [ ] Sesión con una sola fuente de verdad (cookie HttpOnly); sin JWT en `localStorage`.
- [ ] WebSocket valida JWT en el gateway; sin token en query string.
- [ ] `pwa-cliente` consume `@org/contracts`; existen tests de contrato.
- [ ] Listados con `limit`/`cursor` y filtros; refetch coalescido.
- [ ] Outbox con índice, métricas de backlog y claim atómico.
- [ ] Reportes calculan `topProductos` con ventas reales.
- [ ] Kong enruta por nombres de servicio; en prod solo Kong queda expuesto.
- [ ] Secretos separados por ambiente.
- [ ] Los ítems de pedido usan `id` del backend; el avance de ítem en el KDS apunta siempre al ítem correcto.
- [ ] Datos de cliente de delivery en campos estructurados (fuera de `notas`); sin retry-polling tras crear pedido.

## 6. Riesgos y notas

- **Adaptación de snippets:** todo fragmento es ilustrativo; verificar firmas reales (puerto interno de contenedores, nombre exacto de servicios Compose, forma de los DTOs) antes de aplicar.
- **CSRF acoplado a cookie-only:** no separar F2-T1 de F2-T2; entregarlas juntas.
- **Fase 3 como prevención:** sin la unificación de contratos, los errores de tipo de la Fase 1 volverán. Si hay que recortar tiempo, recortar la Fase 6 (opcional), no la 3.
- **Migraciones del outbox:** el índice y el campo `claimedAt`/estado `PROCESSING` requieren migración Prisma coordinada con el despliegue.
- **El informe del front sobrevende el offline:** su §1 dice "lectura de datos cacheados offline", pero el service worker ignora `/api` y `socket.io` (no cachea datos de negocio). Hoy, sin red, solo se sirve el shell estático: las pantallas se ven pero sin datos. Esa afirmación debería corregirse; el soporte real de lectura offline es justo lo que cubre la Fase 6.
- **`navigator.onLine` no es fiable:** `useOnlineStatus` deshabilita mutaciones offline usando `navigator.onLine`, que puede reportar "online" sin conectividad real. Sirve como señal, no como garantía; la cola idempotente de la Fase 6 lo reemplaza para escritura.
