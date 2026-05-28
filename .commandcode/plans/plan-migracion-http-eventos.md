# Plan de Migración: HTTP → Eventos (ADR-002/004)

**Fecha:** 2026-05-28
**Estado:** 🔴 Pendiente
**Objetivo:** Eliminar las 2 únicas llamadas HTTP entre servicios y reemplazarlas con proyecciones locales sincronizadas por eventos RabbitMQ.

---

## Resumen del Problema

| # | Origen → Destino | Llamada actual | Impacto si el destino falla |
|---|---|---|---|
| 1 | `pedidos → inventario` | `GET /inventario/productos/:id` por cada ítem del pedido | **No se puede tomar ningún pedido** |
| 2 | `caja → cuentas` | `GET /cuentas/:id` al registrar un pago | **No se puede cobrar** |

Ambas violan ADR-002 (autonomía de BD) y ADR-004 (comunicación entre servicios = solo RabbitMQ).

---

## Migración 1: pedidos → inventario

### Archeivo actual

`apps/servicio-pedidos/src/app/app.service.ts` — método `validarYMapearItems()`:

```typescript
private async validarYMapearItems(itemsToProcess: PedidoItemInput[]): Promise<PedidoItemMapeado[]> {
  return Promise.all(
    itemsToProcess.map(async (item) => {
      const producto = await this.fetchProducto(item.productoId); // ← HTTP
      // valida stock, obtiene nombre, precio, categoría
    })
  );
}
```

`fetchProducto()` llama a `GET /inventario/productos/:id` con axios.

### Arquitectura destino

```
inventario (source of truth)
  │
  ├── crea/actualiza producto → emite ProductoCreado/ProductoActualizado
  │
  ▼
RabbitMQ
  │
  ▼
pedidos (read-model local)
  │
  ├── tabla productos_locales: id, nombre, precio, stockActual, categoriaNombre
  ├── EventsController consume ProductoCreado/ProductoActualizado
  └── crearPedido() consulta productos_locales con findMany (WHERE id IN (...))
```

### Pasos

1. **Schema: agregar `productos_locales` a `apps/servicio-pedidos/prisma/schema.prisma`**
   ```prisma
   model ProductoLocal {
     id              String  @id
     nombre          String
     precio          Decimal @db.Decimal(10, 2)
     stockActual     Int?
     categoriaNombre String  @default("COCINA")
     disponible      Boolean @default(true)

     @@map("productos_locales")
   }
   ```

2. **EventsController: agregar handlers en `apps/servicio-pedidos/src/app/events.controller.ts`**
   ```typescript
   @EventPattern(RoutingKeys.ProductoCreado)
   async handleProductoCreado(@Payload() envelope: DomainEventEnvelope<ProductoCreadoPayload>) {
     await this.prisma.productoLocal.create({ data: { ...envelope.data } });
   }

   @EventPattern(RoutingKeys.ProductoActualizado)
   async handleProductoActualizado(@Payload() envelope: DomainEventEnvelope<ProductoActualizadoPayload>) {
     await this.prisma.productoLocal.update({
       where: { id: envelope.data.id },
       data: { ...envelope.data },
     });
   }
   ```
   Nota: verificar si `ProductoCreado` y `ProductoActualizado` ya existen en `RoutingKeys` y `contracts`. Si no, crearlos.

3. **AppService: crear seed/carga inicial**
   ```typescript
   private async asegurarProductosLocales(productoIds: string[]): Promise<void> {
     const existentes = await this.prisma.productoLocal.findMany({
       where: { id: { in: productoIds } }
     });
     const existentesIds = new Set(existentes.map(p => p.id));
     const faltantes = productoIds.filter(id => !existentesIds.has(id));

     if (faltantes.length > 0) {
       // Cold start: una sola llamada HTTP para cargar los productos faltantes
       const { data } = await axios.post(`${this.INVENTARIO_URL}/productos/lote`, { ids: faltantes });
       for (const p of data.productos) {
         await this.prisma.productoLocal.upsert({
           where: { id: p.id },
           create: { ...p },
           update: { ...p },
         });
       }
     }
   }
   ```

4. **AppService: reemplazar `validarYMapearItems()`**
   ```typescript
   private async validarYMapearItems(itemsToProcess: PedidoItemInput[]): Promise<PedidoItemMapeado[]> {
     const ids = itemsToProcess.map(i => i.productoId);
     await this.asegurarProductosLocales(ids); // cold-start HTTP, solo si falta

     const productos = await this.prisma.productoLocal.findMany({
       where: { id: { in: ids } }
     });
     const mapa = new Map(productos.map(p => [p.id, p]));

     return itemsToProcess.map(item => {
       const p = mapa.get(item.productoId);
       if (!p) throw new NotFoundException(`Producto ${item.productoId} no encontrado`);
       if (item.cantidad < 1) throw new BadRequestException(`...`);
       if (p.stockActual !== null && p.stockActual < item.cantidad) throw new BadRequestException(`...`);

       return {
         productoId: p.id,
         nombre: p.nombre,
         cantidad: item.cantidad,
         precioUnitario: Number(p.precio),
         area: p.categoriaNombre?.toLowerCase().includes('bebida') ? 'BAR' : 'COCINA',
         notas: item.notas,
         comensal: item.identificadorComensal || 1,
         modificadores: item.modificadores || [],
       } satisfies PedidoItemMapeado;
     });
   }
   ```

5. **Inventario: publicar eventos al crear/actualizar productos**
   - Verificar `apps/servicio-inventario/src/app/app.service.ts` — agregar `outboxEvent.create()` en `crearProducto()` y `actualizarProducto()` con routing keys `ProductoCreado` / `ProductoActualizado`.
   - Si no existe el producto en contracts, crear `ProductoCreadoPayload` y `ProductoActualizadoPayload` en `libs/contracts/src/domains/inventario.ts`.

6. **Remover `fetchProducto()` y el import de axios para inventario en pedidos**

7. **Riesgo — consistencia eventual del stock:**
   - Si dos pedidos leen stock=1 al mismo tiempo, ambos pasan la validación local.
   - Inventario recibe ambos eventos `StockDescontado` en orden y el segundo falla.
   - Solución: agregar handler en pedidos para `StockInsuficiente` que haga rollback del pedido localmente (cambiar estado del ítem a `RECHAZADO_SIN_STOCK`). O, más simple: aceptar que es un edge case raro en un restaurante y manejarlo operativamente.

---

## Migración 2: caja → cuentas

### Archeivo actual

`apps/servicio-caja/src/app/app.service.ts` — método `registrarPago()`:

```typescript
async registrarPago(command: PagarPedidoCommand) {
  const transaccion = await this.prisma.$transaction(async (prisma) => {
    const cuenta = await this.fetchCuenta(command.cuentaId); // ← HTTP
    if (cuenta.estado !== 'ABIERTA') throw new BadRequestException(...);
    // ... validación de monto, crear transacción y outbox
  });
}
```

### Arquitectura destino

```
cuentas (source of truth)
  │
  ├── abre/cierra cuenta → emite CuentaAbierta/CuentaCerrada (ya funciona)
  │
  ▼
RabbitMQ
  │
  ▼
caja (read-model local)
  │
  ├── tabla cuentas_abiertas: cuentaId, mesaId, total, estado
  ├── EventsController consume CuentaAbierta/CuentaCerrada
  └── registrarPago() consulta cuentas_abiertas.findUnique()
```

### Pasos

1. **Schema: agregar `cuentas_abiertas` a `apps/servicio-caja/prisma/schema.prisma`**
   ```prisma
   model CuentaAbierta {
     cuentaId String   @id
     mesaId   String
     total    Decimal  @db.Decimal(10, 2)
     estado   String   // ABIERTA, CERRADA

     @@map("cuentas_abiertas")
   }
   ```

2. **EventsController: agregar handlers en `apps/servicio-caja/src/app/`**
   Crear `events.controller.ts` si no existe:
   ```typescript
   @UseInterceptors(RabbitMQRetryInterceptor)
   @Controller()
   export class EventsController {
     constructor(private readonly prisma: PrismaService) {}

     @EventPattern(RoutingKeys.CuentaAbierta)
     async handleCuentaAbierta(@Payload() envelope: DomainEventEnvelope<CuentaAbiertaPayload>) {
       await this.prisma.cuentaAbierta.upsert({
         where: { cuentaId: envelope.data.cuentaId },
         create: { cuentaId: envelope.data.cuentaId, mesaId: envelope.data.mesaId, total: 0, estado: 'ABIERTA' },
         update: { estado: 'ABIERTA' },
       });
     }

     @EventPattern(RoutingKeys.CuentaCerrada)
     async handleCuentaCerrada(@Payload() envelope: DomainEventEnvelope<CuentaCerradaPayload>) {
       await this.prisma.cuentaAbierta.update({
         where: { cuentaId: envelope.data.cuentaId },
         data: { estado: 'CERRADA', total: envelope.data.total },
       });
     }
   }
   ```

3. **AppService: reemplazar `fetchCuenta()`**
   ```typescript
   async registrarPago(command: PagarPedidoCommand) {
     const transaccion = await this.prisma.$transaction(async (prisma) => {
       await prisma.$executeRaw`SELECT pg_advisory_xact_lock(...)`;

       // En vez de HTTP
       const cuenta = await prisma.cuentaAbierta.findUnique({
         where: { cuentaId: command.cuentaId }
       });
       if (!cuenta) throw new NotFoundException(`Cuenta ${command.cuentaId} no encontrada`);
       if (cuenta.estado !== 'ABIERTA') throw new BadRequestException(`La cuenta ya está ${cuenta.estado}`);

       // Validación de monto usando cuenta.total local
       const pagosPrevios = await prisma.transaccion.aggregate({...});
       if (montoTotalPagado + command.montoRecibido > Number(cuenta.total)) {
         throw new BadRequestException('Pago duplicado o excedente');
       }

       // crear transacción + outbox...
     });
   }
   ```

4. **Remover `fetchCuenta()`, `CircuitBreakerOptions`, y el import de axios para cuentas en caja**

5. **Cold start:** Igual que con productos — si no existe en `cuentas_abiertas`, hacer **una** llamada HTTP fallback a cuentas:
   ```typescript
   let cuenta = await prisma.cuentaAbierta.findUnique({ where: { cuentaId: command.cuentaId } });
   if (!cuenta) {
     cuenta = await this.fetchCuenta(command.cuentaId); // HTTP cold-start
     await prisma.cuentaAbierta.create({ data: { ...cuenta } });
   }
   ```
   Esto es aceptable porque solo ocurre una vez por cuenta nueva, no en cada pago.

6. **Registrar el controller en `AppModule`:**
   ```typescript
   controllers: [AppController, EventsController],
   ```

---

## Orden de Ejecución Recomendado

```
Migración 2 (caja → cuentas) PRIMERO — más simple, menos riesgo
  │
  ├── 1. Schema prisma: cuentas_abiertas
  ├── 2. EventsController en caja
  ├── 3. Modificar registrarPago()
  ├── 4. Remover fetchCuenta()
  ├── 5. Tests
  └── 6. Verificar build + tests
  │
  ▼
Migración 1 (pedidos → inventario) DESPUÉS — más cambios, riesgo de consistencia
  │
  ├── 1. Contracts: ProductoCreado/Actualizado payloads
  ├── 2. Schema prisma: productos_locales en pedidos
  ├── 3. Inventario: publicar eventos al crear/actualizar
  ├── 4. EventsController en pedidos
  ├── 5. Modificar validarYMapearItems() + cold-start
  ├── 6. Remover fetchProducto()
  ├── 7. Tests
  └── 8. Verificar build + tests
```

---

## Verificación Final

```bash
npx nx run-many --target=build --projects=servicio-caja,servicio-pedidos,servicio-inventario
npx vitest run
```

Esperado: 10/10 build, 43-45 tests pasando (2-4 nuevos tests de eventos).

---

## Riesgos y Contingencias

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Stock inconsistente entre pedidos e inventario | Baja (caso borde) | Handler `StockInsuficiente` → rollback del pedido |
| Cold-start: producto nuevo no está en proyección local | Media | Fallback HTTP en `asegurarProductosLocales()` |
| Cuenta no sincronizada al momento de pagar | Baja | Fallback HTTP en `registrarPago()` si no existe localmente |
| Evento `CuentaCerrada` llega antes que `PagoRegistrado` | Baja | Ordering keys en RabbitMQ o idempotencia en handler |
