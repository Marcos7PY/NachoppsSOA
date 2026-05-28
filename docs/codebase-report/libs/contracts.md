# Librería Compartida: `@org/contracts`

**Ruta:** `libs/contracts`
**Responsabilidad:** Contener todo el _Shared Kernel_ del sistema. Agrupa los tipos, interfaces, Enums, DTOs (Data Transfer Objects) y claves de enrutamiento (Routing Keys) garantizando que todos los microservicios hablen el mismo lenguaje.

Esta librería es puramente de tipado (TypeScript) y contantes. No contiene lógica de negocio.

## Estructura de Exportaciones (`src/index.ts`)

La librería exporta su contenido desde tres subdirectorios principales:

### 1. Eventos y Rutas (`src/events/routing-keys.ts`)
Define el diccionario maestro de eventos de RabbitMQ bajo el estándar *topic exchange* (formato `dominio.accion`).

**RoutingKeys completas listadas (22 en total):**
- `ReservaCreada`: `'reserva.creada'`
- `ReservaCancelada`: `'reserva.cancelada'`
- `ReservaConfirmada`: `'reserva.confirmada'`
- `MesaCreada`: `'mesa.creada'`
- `MesaActualizada`: `'mesa.actualizada'`
- `MesaAsignada`: `'mesa.asignada'`
- `MesaLiberada`: `'mesa.liberada'`
- `PedidoCreado`: `'pedido.creado'`
- `PedidoListo`: `'pedido.listo'`
- `PedidoActualizado`: `'pedido.actualizado'`
- `CuentaAbierta`: `'cuenta.abierta'`
- `CuentaCerrada`: `'cuenta.cerrada'`
- `TicketGenerado`: `'ticket.generado'`
- `PagoRegistrado`: `'pago.registrado'`
- `ArqueoRealizado`: `'arqueo.realizado'`
- `StockBajo`: `'stock.bajo'`
- `StockDescontado`: `'stock.descontado'`
- `UsuarioAutenticado`: `'usuario.autenticado'`

**Constantes Adicionales:**
- `CONSUMER_BINDING_ALL_DOMAIN_EVENTS`: `'*.*'` (Usado para que servicios transversales como notificaciones o auditoría puedan atrapar cualquier evento).

### 2. Mensajería (`src/messaging/envelope.ts`)
Define la envoltura estructural que rodea todos los payloads asíncronos garantizando observabilidad y trazabilidad. *(Ver archivo de Mapa RabbitMQ para el desglose exacto de la interfaz `DomainEventEnvelope`)*.

### 3. Dominios (`src/domains/*.ts`)
Contiene un archivo por cada dominio de negocio con sus interfaces DTO, Commands y Payloads de eventos.

Ejemplo analizado exhaustivamente (`identidad.ts`):
- **Enums:** `RolUsuario` (ADMIN, CAJERO, COCINA, MESERO, RECEPCION, GERENCIA, SISTEMA).
- **DTOs:** `UsuarioDto` (id, nombre, email, rol, activo, createdAt).
- **Commands (Entrada HTTP):** `LoginCommand`, `CrearUsuarioCommand`, `CambiarRolCommand`.
- **Responses (Salida HTTP):** `LoginResponseDto` (access_token, usuario omitiendo activo/createdAt).
- **Event Payloads:** `UsuarioAutenticadoPayload` (userId, rol, email).

Existen definiciones equivalentes para: `caja.ts`, `cuentas.ts`, `inventario.ts`, `mesas.ts`, `pedidos.ts` y `reservas.ts`.
