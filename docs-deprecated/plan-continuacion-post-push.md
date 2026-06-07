# Plan de continuación post-push

Workspace: `C:\Users\MARCOS\Desktop\BackActual`
Rama base de continuación: `codex/desbloqueo-builds-backend`
Commit publicado: `c4741f9 fix: cerrar brecha front back y desbloquear builds backend`

Este documento resume lo que queda por implementar después del push de la rama `codex/desbloqueo-builds-backend`.
Sirve como handoff para continuar en otra sesión sin reabrir todo el análisis.

## 1. Estado ya cerrado

No repetir este trabajo salvo que una verificación falle:

- Builds backend desbloqueados.
- `libs/shared-rabbitmq` normalizado con `tsconfig.lib.json`.
- `apps/servicio-*/tsconfig.app.json` sin `references` conflictivas y con `nx.sync.ignoredDependencies`.
- `PrismaService.serviceName` alineado con la clase base.
- PWA compila y typecheck pasa.
- Tests actuales pasan.
- Sesión front migrada hacia cookie-only:
  - `client.ts` usa `credentials: 'include'`.
  - se elimina el token legacy `nachopps.access_token` de `localStorage`.
  - se adjunta `X-CSRF-Token` desde cookie legible en métodos mutantes.
- WebSocket de notificaciones valida JWT y el cliente ya no debe enviar JWT por query string.
- Kong ya no aparece usando `host.docker.internal`.

Verificaciones ya ejecutadas en verde:

```powershell
npm exec -- nx sync
npm exec -- nx run-many --target=build --projects=servicio-identidad,servicio-mesas,servicio-pedidos,servicio-cuentas,servicio-reservas,servicio-inventario,servicio-notificaciones,servicio-caja,servicio-reportes --skipNxCache --outputStyle=static
npm exec -- nx run pwa-cliente:typecheck --skipNxCache
npm exec -- nx run pwa-cliente:build --skipNxCache
npm exec -- nx run-many --target=test --outputStyle=static
```

## 2. Prioridad inmediata

### C1. Blindar con pruebas lo ya cambiado en auth, CSRF y WebSocket

Objetivo: no avanzar a contratos hasta que seguridad quede demostrada por tests.

Acciones:

- Agregar tests para `JwtAuthGuard` en `libs/shared-auth`:
  - `GET/HEAD/OPTIONS` no exigen CSRF.
  - `POST/PATCH/DELETE` con cookie pero sin `X-CSRF-Token` responden `403`.
  - `POST/PATCH/DELETE` con cookie y header iguales pasan.
  - `Authorization: Bearer ...` conserva el camino service-to-service sin CSRF.
- Agregar o completar tests equivalentes para `apps/servicio-identidad/src/auth/jwt-auth.guard.ts`.
- Probar `NotificationsGateway`:
  - conexión sin token se desconecta.
  - conexión con cookie `access_token` válida queda aceptada.
  - conexión con token inválido emite `auth:error` y se desconecta.
- Revisar si `auth/logout` debe exigir CSRF. Hoy limpia cookies sin guard; el riesgo principal es logout CSRF, no exfiltración. Decidir y documentar.
- Revisar si `auth/validate` debe seguir público para compatibilidad o moverse a uso interno/service-to-service.

Aceptación:

```powershell
npm exec -- nx run-many --target=test --outputStyle=static
npm exec -- nx run servicio-notificaciones:build --skipNxCache
```

### C2. Auditoría de cobertura de guards en endpoints mutantes

Objetivo: asegurar que todos los servicios que mutan estado usan el guard compartido o un equivalente con CSRF.

Acciones:

- Revisar controladores de:
  - `servicio-mesas`
  - `servicio-pedidos`
  - `servicio-cuentas`
  - `servicio-reservas`
  - `servicio-inventario`
  - `servicio-caja`
  - `servicio-reportes`
- Confirmar que todo `POST/PATCH/PUT/DELETE` sensible está protegido.
- Si hay endpoints públicos por diseño, documentar por qué y cubrir con test.

Aceptación:

- No hay mutaciones sensibles sin guard.
- Tests demuestran rechazo `403` para mutación cookie-only sin CSRF.

## 3. Contratos y tipos

### C3. Conectar PWA a `@org/contracts`

Objetivo: eliminar drift entre DTOs backend y tipos locales del front.

Acciones:

- Crear ADR corto en `docs/adr/` confirmando `@org/contracts` como fuente única.
- Agregar dependencia real del grafo Nx `pwa-cliente -> contracts`.
- Reemplazar progresivamente tipos duplicados en:
  - `apps/pwa-cliente/src/types/mesa.types.ts`
  - `apps/pwa-cliente/src/types/pedido.types.ts`
  - `apps/pwa-cliente/src/types/reporte.types.ts`
  - otros `src/types/*.ts` que dupliquen DTOs.
- Mantener tipos VM solo para presentación y derivarlos mediante mappers explícitos.

Aceptación:

```powershell
npm exec -- nx graph --print
npm exec -- nx run pwa-cliente:typecheck --skipNxCache
```

El grafo debe mostrar dependencia de `pwa-cliente` hacia `contracts`.

### C4. Corregir identidad real de ítems de pedido

Problema actual:

- `apps/pwa-cliente/src/mappers/pedido.mapper.ts` aún usa `crypto.randomUUID()` como fallback para `item.id`.
- `CocinaScreen` llama `avanzarItem(itemId)`, que termina en `PATCH /pedidos/items/:itemId/estado`.
- Si el id fue generado en el cliente, el backend no lo conoce.

Acciones:

- Garantizar que `PedidoItemDto` en `libs/contracts/src/domains/pedidos.ts` incluye `id` obligatorio real del backend.
- Verificar que `GET /pedidos` backend devuelve ese `id` real.
- Eliminar `crypto.randomUUID()` como identidad de negocio.
- Si hace falta una key visual, usar `reactKey` o composición local que nunca se mande al backend.
- Agregar test de mapper que falle si un item llega sin `id`.

Aceptación:

- `avanzarItem` siempre recibe id backend.
- No queda `randomUUID()` en `pedido.mapper.ts` para `id` de negocio.

## 4. Respuestas, listas y rendimiento

### C5. Estandarizar envoltorio de listas

Problema actual:

- El front sigue usando `unwrapArray` y `unwrapEntity` para tolerar respuestas inconsistentes.

Acciones:

- Definir forma estándar en contratos: recomendado `{ data, nextCursor }`.
- Alinear endpoints principales:
  - mesas
  - pedidos
  - cuentas
  - reservas
  - inventario/productos
  - identidad/usuarios
  - caja
- Dejar `unwrap*` como compatibilidad transitoria y luego eliminarlo.

Aceptación:

- Todos los listados nuevos devuelven la misma forma.
- Los tipos del front salen de contratos, no de heurísticas.

### C6. Paginación por cursor

Acciones:

- Implementar `limit` con máximo razonable y `cursor` en:
  - `GET /pedidos`
  - `GET /reservas`
  - `GET /inventario/productos`
  - `GET /identidad/usuarios`
  - `GET /caja`
- Agregar filtros necesarios: `estado`, `fecha`, `updatedSince` donde aplique.
- Consumir `nextCursor` en el front.

Aceptación:

- Ningún listado grande devuelve tabla completa.
- Tests de backend cubren `limit`, `cursor` y tope máximo.

### C7. Reducir refetch por socket

Acciones:

- Debounce/coalescing alrededor de invalidaciones de socket.
- Si el evento trae payload suficiente, aplicar patch local en store antes de refetchear.
- Añadir TTL/dedup en stores para evitar requests duplicadas en montajes simultáneos.

Aceptación:

- N eventos en menos de 300 ms disparan como máximo un refetch por store.
- Dos cargas simultáneas comparten una request en vuelo.

## 5. Datos de negocio pendientes

### C8. Delivery/llevar con campos estructurados

Problema actual:

- `CrearPedidoScreen` y `DeliveryScreen` aún serializan cliente/teléfono/dirección dentro de `notas`.

Acciones:

- Agregar campos estructurados al contrato de pedido:
  - `cliente`
  - `telefono`
  - `direccion`
  - `proveedor`
  - `modalidad` si aplica.
- Backend debe persistir y devolver esos campos.
- Front deja `notas` solo para cocina.
- Panel de despachos lee campos reales, no parsea strings.

Aceptación:

- No quedan datos de cliente en strings tipo `[DELIVERY] Cliente: ...`.

### C9. Eliminar retry-polling tras crear pedido

Problema actual:

- `CrearPedidoScreen` mantiene `SYNC_RETRY_DELAYS_MS = [0, 500, 1000, 2000]`, lo que puede generar hasta 12 `GET`.

Acciones:

- Hacer que `POST /pedidos` devuelva el estado resultante suficiente:
  - `pedido`
  - `cuentaId`
  - estado de mesa/cuenta, si aplica.
- Alternativa: depender de evento socket `cuenta.abierta` con payload suficiente.
- Eliminar el bucle `revalidarMesaConCuenta`.

Aceptación:

- Crear pedido no dispara polling por reintentos.

### C10. Reportes con datos reales

Problema actual:

- `servicio-reportes` aún calcula `topProductos` desde lista estática `PLATILLOS`.

Acciones:

- Ampliar evento `CuentaCerradaPayload` con items vendidos.
- Crear/actualizar proyección real de ventas por producto.
- `topProductos` debe venir de agregación real.

Aceptación:

- No queda cálculo de `topProductos` basado en lista estática.

## 6. Despliegue y configuración

### C11. Separar dev/prod en Docker Compose

Estado actual:

- `infra/docker-compose.yml` sigue publicando puertos internos de servicios y bases de datos. Eso puede estar bien para dev, pero no para prod.

Acciones:

- Crear o completar `docker-compose.prod.yml`.
- En prod, publicar solo Kong y lo estrictamente necesario.
- Los microservicios deben quedar accesibles solo en la red interna.

Aceptación:

- En compose prod no hay `3001:3000`, `3002:3000`, etc. para microservicios.

### C12. Secretos por ambiente

Estado actual:

- `infra/docker-compose.yml` contiene valores dev como `nachopps_jwt_secret_dev`.

Acciones:

- Mantener esos valores solo para dev.
- Documentar variables requeridas de prod.
- Usar `.env.example` sin secretos reales.

Aceptación:

- No hay secretos productivos versionados.
- Prod requiere secretos desde entorno/orquestador.

### C13. Confirmar `SameSite` según despliegue real

Acciones:

- Si front y API comparten site: mantener `COOKIE_SAMESITE=strict`.
- Si front y API están cross-site: usar `COOKIE_SAMESITE=none` y `Secure`, manteniendo CSRF.
- Documentar la decisión en `infra/kong/README.md` o ADR.

Aceptación:

- Login, requests mutantes y socket funcionan en el dominio real elegido.

## 7. Calidad de UI y deuda menor

### C14. Componentes duplicados y UI muerta

Acciones:

- Adoptar o eliminar duplicados:
  - `MesaCard`
  - `ItemKDS`
  - `PedidoRow`
- Implementar u ocultar botón `⌘K`.
- Mover nombre del local y turnos hardcodeados a configuración.

Aceptación:

- Una sola implementación por componente de dominio.
- No quedan controles visibles sin acción.

## 8. Orden recomendado para la próxima sesión

1. Ejecutar baseline:

```powershell
git switch codex/desbloqueo-builds-backend
git pull --ff-only
npm exec -- nx sync
npm exec -- nx run-many --target=build --projects=servicio-identidad,servicio-mesas,servicio-pedidos,servicio-cuentas,servicio-reservas,servicio-inventario,servicio-notificaciones,servicio-caja,servicio-reportes --skipNxCache --outputStyle=static
npm exec -- nx run pwa-cliente:typecheck --skipNxCache
npm exec -- nx run-many --target=test --outputStyle=static
```

2. Implementar C1 y C2 primero.
3. Abrir PR o commit pequeño de seguridad.
4. Pasar a C3 y C4.
5. Después abordar C5-C10 por cortes funcionales.
6. Dejar C11-C13 antes de producción.

## 9. Definition of Done restante

- [ ] Tests de CSRF y WebSocket auth cubren caminos positivos y negativos.
- [ ] Todos los endpoints mutantes sensibles tienen guard.
- [ ] `pwa-cliente` consume `@org/contracts`.
- [ ] `PedidoItemDto.id` es obligatorio y real; KDS no usa ids generados en cliente.
- [ ] Listados usan forma estándar y paginación.
- [ ] Socket no causa ráfagas de refetch.
- [ ] Delivery/llevar usa campos estructurados.
- [ ] Crear pedido no usa retry-polling.
- [ ] `topProductos` usa ventas reales.
- [ ] Compose prod no expone microservicios directamente.
- [ ] Secretos y `SameSite` quedan documentados por ambiente.
