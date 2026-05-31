# CONTEXTO COMPLETO DEL PROYECTO — NACHOPPS RESTOBAR

> **Documento unificado para consumo por agente de IA.**
> Reúne íntegramente la información del **APF1 (Semana 5 — Descubrimiento SOA)** y del **APF2 (Semana 10 — Diseño Arquitectónico)** del proyecto:
>
> **"Diseño e Implementación de una Plataforma Digital Multiplataforma para la Gestión Integral de Operaciones en Nachopps Restobar – Sullana, 2026"**
>
> - **Curso:** Arquitectura Orientada al Servicio
> - **Universidad:** Universidad Tecnológica del Perú (UTP) — Facultad de Ingeniería — Ingeniería de Sistemas e Informática
> - **Docente:** MSc. Edwin Arnulfo Saavedra Navarro
> - **Autores:** Palacios Ynga, Marcos Roberto · Otero Reto, Juan Pablo · Requena Peña, Kevin Alexander
> - **Ubicación:** Piura, Perú — 2026
> - **Regla de continuidad del curso:** lo entregado en el APF1 **no se descarta ni se rehace**, se amplía y refina con mayor rigor técnico en el APF2.

---

## TABLA DE CONTENIDO

1. [Resumen ejecutivo del caso](#1-resumen-ejecutivo-del-caso)
2. [Problema de negocio y objetivos (APF1)](#2-problema-de-negocio-y-objetivos-apf1)
3. [Mapa de capacidades y procesos clave (APF1)](#3-mapa-de-capacidades-y-procesos-clave-apf1)
4. [Servicios candidatos identificados (APF1)](#4-servicios-candidatos-identificados-apf1)
5. [Límites iniciales de servicio (APF1)](#5-límites-iniciales-de-servicio-apf1)
6. [Justificación del enfoque SOA y principios aplicados (APF1)](#6-justificación-del-enfoque-soa-y-principios-aplicados-apf1)
7. [Diagrama C4 — Nivel 1: Contexto (APF2)](#7-diagrama-c4--nivel-1-contexto-apf2)
8. [Diagrama C4 — Nivel 2: Contenedores (APF2)](#8-diagrama-c4--nivel-2-contenedores-apf2)
9. [Inventario formal de servicios (APF2)](#9-inventario-formal-de-servicios-apf2)
10. [Descripción breve de cada servicio (APF2)](#10-descripción-breve-de-cada-servicio-apf2)
11. [Contratos iniciales de los servicios (APF2)](#11-contratos-iniciales-de-los-servicios-apf2)
12. [Matriz de integraciones (APF2)](#12-matriz-de-integraciones-apf2)
13. [Decisiones arquitectónicas clave — ADRs (APF2)](#13-decisiones-arquitectónicas-clave--adrs-apf2)
14. [Riesgos técnicos consolidados (APF2)](#14-riesgos-técnicos-consolidados-apf2)
15. [Trazabilidad APF1 → APF2](#15-trazabilidad-apf1--apf2)
16. [Anexo: Código fuente Structurizr DSL](#16-anexo-código-fuente-structurizr-dsl)

---

## 1. Resumen ejecutivo del caso

**Nachopps Restobar** es un negocio gastronómico ubicado en **Sullana, Piura (Perú)**, que brinda servicio de restaurante y bar. Cuenta con clientela establecida y potencial de crecimiento, pero opera con procesos manuales que generan cuellos de botella operativos, errores frecuentes y pérdida de información crítica para la toma de decisiones.

**Solución propuesta:** construir una **plataforma digital orientada a servicios (SOA)** que digitalice y automatice las operaciones críticas: reservas, toma de pedidos, control de cuentas por mesa, gestión de caja, control de inventario y generación de reportes. Se trata de una solución tecnológica integral, basada en principios modernos de arquitectura de software, capaz de cubrir estas necesidades de forma robusta, escalable y fácil de mantener.

---

## 2. Problema de negocio y objetivos (APF1)

### 2.1 Problema principal

Nachopps Restobar carece de un sistema integrado para gestionar sus operaciones. Los procesos actuales son manuales, lo que produce una cadena de ineficiencias que afectan la experiencia del cliente, la rentabilidad del negocio y la capacidad de escalar. Desde una perspectiva SOA, el problema central es la **ausencia de servicios de negocio bien definidos**: cada área opera como un silo aislado sin contratos ni interfaces de integración.

**Síntomas observados:**

- Reservas gestionadas de forma verbal o en papel, generando conflictos de disponibilidad.
- Pedidos tomados manualmente, con errores de transcripción y demoras en cocina/bar.
- Cuentas por mesa calculadas a mano, sin trazabilidad ni registro histórico confiable.
- Movimientos de caja no sistematizados: arqueos tardíos y errores en el cierre diario.
- Inventario sin control en tiempo real, con compras reactivas y pérdidas no monitoreadas.
- Ausencia de reportes para apoyar decisiones gerenciales.

**Causas raíz identificadas:**

- No existe una arquitectura de servicios que integre los dominios operativos del negocio.
- Los flujos de información entre cocina, barra, sala y administración carecen de contratos formales.
- No hay visibilidad del estado del negocio en tiempo real ni mecanismos de integración entre áreas.

### 2.2 Objetivo general

Diseñar una solución orientada a servicios que integre las operaciones críticas de Nachopps Restobar mediante **servicios de negocio autónomos, con contratos bien definidos, comunicación por mensajería y capacidad de operar de forma distribuida y escalable**.

### 2.3 Objetivos específicos

- Identificar y delimitar los servicios de negocio que modelan las capacidades del restobar.
- Definir los contratos iniciales de los servicios principales.
- Establecer el mecanismo de integración entre servicios.
- Garantizar que cada servicio sea autónomo, reutilizable e interoperable.
- Diseñar la solución para soportar expansión a futuras sucursales sin rediseño estructural.

---

## 3. Mapa de capacidades y procesos clave (APF1)

El APF1 incluye un **diagrama BPMN** (Bizagi) que modela el proceso end-to-end de **"Atención SOA para Nachopps Restobar"**. El proceso involucra los siguientes carriles (swimlanes) y pasos secuenciales:

### Carriles del proceso BPMN

| Carril | Pasos / actividades clave |
|---|---|
| **Cliente** | Solicitar reserva → Recibir notificación de confirmación → Llegar al restaurante → Recibir pedido → Pedir la cuenta |
| **Reservas** | Validar disponibilidad → Confirmar reserva |
| **Mesas** | Asignar mesa → Publicar evento `MesaAsignada` |
| **Pedidos** | Registrar ítems del pedido del mesero → Ejecutar contrato y enviar orden |
| **Notificaciones** | Notificar al cliente que la reserva está confirmada → Publicar evento `PedidoCreado` → Actualizar estado del pedido a `PedidoListo` cuando cocina despacha → Notificar al mesero |
| **Cuentas** | Consolidar los pedidos → Generar ticket → Cerrar cuenta → Disparar evento `CuentaCerrada` |
| **Caja, Inventario, Reportes** | Caja: Registrar pago → Inventario: Descontar lo consumido → Reportes: Consolidar datos del turno para dashboard del administrador → Fin |

Este flujo BPMN es la base que justifica la identificación de los 9 servicios candidatos en la siguiente sección.

---

## 4. Servicios candidatos identificados (APF1)

En SOA los servicios se clasifican en **tres tipologías**:

- **Servicios de entidad:** encapsulan una entidad del negocio y su ciclo de vida.
- **Servicios de tarea:** orquestan un proceso de negocio específico invocando otros servicios.
- **Servicios de utilidad:** proveen capacidades transversales reutilizables por todos los demás.

A partir de esa clasificación se identificaron **9 servicios candidatos** (todos conservados sin cambios en el APF2):

| # | Servicio | Tipo SOA | Capacidad que encapsula | Consumidores |
|---|---|---|---|---|
| 1 | **Reservas** | Entidad | Ciclo de vida de reservas: creación, confirmación, cancelación, consulta de disponibilidad. | Cliente, Recepcionista |
| 2 | **Mesas** | Entidad | Estado de mesas (libre/ocupada/reservada) y asignación a cuentas activas. | Mesero, Servicio de Reservas |
| 3 | **Pedidos** | Entidad | Registro de ítems por mesa, enrutamiento a cocina/bar y seguimiento de estado de preparación. | Mesero, Cocina, Bar |
| 4 | **Cuentas** | Entidad | Asociación de pedidos a mesa, división de cuenta, generación de ticket y cierre. | Mesero, Cliente |
| 5 | **Caja** | Tarea | Orquesta flujo de pago: registra ingresos/egresos, gestiona arqueos y cierre de turno. | Cajero, Administrador |
| 6 | **Inventario** | Entidad | Control de stock: entradas, descuentos automáticos por pedido y alertas de nivel crítico. | Administrador, Servicio de Pedidos |
| 7 | **Reportes** | Tarea | Consolida datos de Caja, Pedidos e Inventario para dashboards y exportación de reportes. | Administrador, Gerencia |
| 8 | **Notificaciones** | Utilidad | Entrega de notificaciones en tiempo real a los actores del sistema mediante mensajería. | Todos los servicios |
| 9 | **Identidad** | Utilidad | Autenticación de usuarios, autorización por rol (RBAC) y auditoría de acciones. | Todos los servicios |

---

## 5. Límites iniciales de servicio (APF1)

| Servicio | Datos bajo custodia | Operaciones expuestas | Mensajes publica/consume |
|---|---|---|---|
| **Reservas** | `Reserva {id, cliente, fecha, hora, mesa, estado}` | `crearReserva()`, `confirmarReserva()`, `cancelarReserva()`, `consultarDisponibilidad()` | **Publica:** `ReservaCreada`, `ReservaCancelada` |
| **Mesas** | `Mesa {id, número, capacidad, estado, cuentaAsociada}` | `consultarEstado()`, `asignarMesa()`, `liberarMesa()` | **Publica:** `MesaAsignada`, `MesaLiberada` · **Consume:** `ReservaCreada` |
| **Pedidos** | `Pedido {id, mesa, ítems[], estado, timestamp}` | `crearPedido()`, `agregarÍtem()`, `actualizarEstado()`, `consultarPedido()` | **Publica:** `PedidoCreado`, `PedidoListo` · **Consume:** `MesaAsignada` |
| **Cuentas** | `Cuenta {id, mesa, pedidos[], total, estado, ticket}` | `abrirCuenta()`, `agregarPedido()`, `dividirCuenta()`, `cerrarCuenta()`, `generarTicket()` | **Publica:** `CuentaCerrada`, `TicketGenerado` · **Consume:** `PedidoListo` |
| **Caja** | `Movimiento {id, tipo, monto, medio, cuentaRef, timestamp}` | `registrarPago()`, `registrarEgreso()`, `realizarArqueo()`, `generarReporteTurno()` | **Publica:** `PagoRegistrado`, `ArqueoRealizado` · **Consume:** `CuentaCerrada` |
| **Inventario** | `Producto {id, nombre, stockActual, stockMínimo, unidad}` | `registrarEntrada()`, `consultarStock()`, `actualizarStock()` | **Publica:** `StockBajo` · **Consume:** `CuentaCerrada` |
| **Notificaciones** | `Mensaje {id, destinatario, canal, contenido, estado}` | `publicarEvento()`, `suscribirseAEvento()` | **Broker central:** consume y enruta todos los eventos del sistema |
| **Identidad** | `Usuario {id, nombre, rol, credenciales}`, `Token {jwt, expiry}` | `autenticar()`, `autorizarAcción()`, `registrarAuditoría()` | **Publica:** `UsuarioAutenticado` |
| **Reportes** | Snapshot agregado de operaciones (no datos transaccionales) | `generarReporteVentas()`, `generarReporteStock()`, `generarDashboard()` | **Consume:** `PagoRegistrado`, `CuentaCerrada`, `StockDescontado` |

---

## 6. Justificación del enfoque SOA y principios aplicados (APF1)

### 6.1 ¿Por qué SOA?

SOA responde a la naturaleza del problema: el negocio opera con múltiples dominios funcionales con ciclos de vida, actores y ritmos de cambio distintos, pero que necesitan integrarse para ejecutar procesos completos. SOA permite modelar esto con precisión: cada dominio es un servicio autónomo con contrato propio, y la integración ocurre **a nivel de contrato, no de implementación**.

| Necesidad del negocio | Principio aplicado | Cómo lo resuelve |
|---|---|---|
| Dominios operativos con ciclos de vida distintos (cocina, caja, sala) | **Autonomía del servicio** | Cada servicio tiene su propia lógica, datos y despliegue. La caída de uno no bloquea a los demás. |
| Integración entre áreas sin acoplamiento fuerte | **Contrato como única interfaz** | Comunicación solo vía contratos definidos (REST/OpenAPI + mensajería). |
| Reutilización de capacidades transversales (auth, notificaciones) | **Reutilización de servicios** | Identidad y Notificaciones son servicios de utilidad consumidos por todos sin duplicar lógica. |
| Flujos de atención complejos que involucran múltiples servicios | **Orquestación de servicios** | Un proceso orquestador (p. ej. cierre de cuenta) invoca servicios en secuencia según lógica de negocio. |
| Actualizaciones en tiempo real entre actores (cocina, mesero, barra) | **Coreografía basada en eventos** | Servicios publican y consumen eventos de forma asíncrona sin coordinación central. |
| Escalabilidad a futuras sucursales | **Interoperabilidad y composición** | Contratos estándar que pueden consumirse desde otras sedes sin reimplementación. |

### 6.2 Principios SOA aplicados

| Principio | Descripción | Aplicación en Nachopps |
|---|---|---|
| **Contrato estandarizado** | Interfaces formales independientes de la implementación. | Cada servicio define operaciones, entradas y salidas mediante OpenAPI/REST. |
| **Bajo acoplamiento** | Servicios minimizan dependencias entre sí. | Integración solo vía contratos y eventos, nunca acceso directo a datos de otro servicio. |
| **Abstracción** | El consumidor no conoce la lógica interna del servicio. | Pedidos no sabe cómo Inventario gestiona el stock; solo publica un evento. |
| **Reutilización** | Servicios diseñados para múltiples consumidores. | Identidad y Notificaciones reutilizados por todos. |
| **Autonomía** | Cada servicio controla su lógica y datos sin depender de otros en runtime. | Caja procesa pagos aunque Inventario esté temporalmente caído. |
| **Stateless** | Servicios no retienen estado entre invocaciones. | Cada solicitud a Reservas es independiente; estado persistido en BD propia. |
| **Descubrimiento** | Servicios localizables en tiempo de ejecución. | API Gateway actúa como registro y punto único de entrada. |
| **Composición** | Servicios se combinan para construir procesos complejos. | El flujo de atención completo se compone de 7 servicios orquestados/coreografiados. |

---

## 7. Diagrama C4 — Nivel 1: Contexto (APF2)

Representa la **Plataforma Nachopps Restobar** como un sistema único, mostrando sus relaciones con actores humanos y sistemas externos. Responde a: *«¿Quién usa el sistema y con qué se integra?»*

### 7.1 Actores humanos

| Actor | Rol |
|---|---|
| **Cliente** | Reserva mesa vía QR, consulta menú y revisa su cuenta. |
| **Recepcionista** | Gestiona reservas presenciales o telefónicas. |
| **Mesero** | Toma pedidos y asigna mesas desde la app móvil. |
| **Cocina** | Recibe comandas y actualiza el estado de preparación. |
| **Bar** | Recibe órdenes de bebidas y actualiza su estado. |
| **Cajero** | Registra pagos, realiza arqueos y cierra turno. |
| **Administrador** | Gestiona inventario, configura el sistema y consulta reportes operativos. |
| **Gerencia** | Consulta reportes consolidados y métricas de negocio. |

### 7.2 Sistemas externos integrados

| Sistema externo | Función |
|---|---|
| **Pasarela de Pagos (Niubiz / Culqi / Yape)** | Procesa pagos electrónicos con tarjeta o QR. |
| **SUNAT** | Emisión de comprobantes electrónicos (boleta y factura). |
| **Gateway SMS / WhatsApp** | Envío de recordatorios de reserva y confirmaciones al cliente. |

> El diagrama se renderiza en [Structurizr Playground](https://playground.structurizr.com/) usando el código DSL del Anexo (sección 16). En el documento original aparece como placeholder con la nota *"[Insertar aquí la captura de pantalla del diagrama Contexto]"*.

---

## 8. Diagrama C4 — Nivel 2: Contenedores (APF2)

«Abre la caja» del sistema y muestra cómo se estructura internamente. Responde a: *«¿Cómo se estructura la solución por dentro?»*. La plataforma se organiza en **seis capas verticales**.

### 8.1 Capa de Presentación (6 apps cliente)

| Aplicación | Tecnología | Propósito |
|---|---|---|
| **App Mesero** | Flutter | Registro de pedidos y gestión de mesas desde móviles. |
| **Web Cliente QR** | React | Interfaz pública para reservas y consulta de menú/cuenta. |
| **Pantalla Cocina** | React | KDS para pedidos pendientes y actualización de estado. |
| **Pantalla Bar** | React | KDS específico para bebidas. |
| **POS Caja** | Electron + React | App de escritorio para pagos y arqueos. |
| **Dashboard Administrador** | React | Panel de reportes, inventario y supervisión. |

### 8.2 Capa de Aplicación

- **API Gateway** (Kong / NGINX): único punto de entrada al sistema. Centraliza enrutamiento, validación de tokens JWT, rate limiting y logging.

### 8.3 Capa de Servicios de Negocio (clasificación SOA del APF1)

- Servicio de **Reservas** *(Entidad)*
- Servicio de **Mesas** *(Entidad)*
- Servicio de **Pedidos** *(Entidad)*
- Servicio de **Cuentas** *(Entidad)*
- Servicio de **Inventario** *(Entidad)*
- Servicio de **Caja** *(Tarea)*
- Servicio de **Reportes** *(Tarea)*

### 8.4 Capa de Servicios de Utilidad

- **Servicio de Identidad:** autenticación, autorización por rol (RBAC) y auditoría. Emite JWT.
- **Servicio de Notificaciones:** broker funcional que enruta eventos hacia los actores correspondientes.

### 8.5 Capa de Mensajería

- **Message Broker (RabbitMQ):** recibe y distribuye eventos asíncronos siguiendo el patrón **publish/subscribe**.

### 8.6 Capa de Datos

Cada servicio gestiona su **propia base de datos PostgreSQL**, en cumplimiento del principio de autonomía SOA (ADR-002). Ningún servicio puede acceder a la BD de otro: toda comunicación de datos ocurre vía contrato REST o evento asíncrono.

---

## 9. Inventario formal de servicios (APF2)

| ID | Servicio | Tipo SOA | Capacidad encapsulada | Owner funcional | Consumidores |
|---|---|---|---|---|---|
| **SVC-RES-001** | Reservas | Entidad | Ciclo de vida de reservas: creación, confirmación, cancelación y consulta de disponibilidad. | Recepción | Cliente (Web QR), Recepcionista |
| **SVC-MES-002** | Mesas | Entidad | Estado de mesas (libre/ocupada/reservada) y asignación a cuentas activas. | Operaciones de Sala | Mesero, Servicio Reservas |
| **SVC-PED-003** | Pedidos | Entidad | Registro de ítems por mesa, enrutamiento a cocina/bar y seguimiento de estado. | Jefe de Meseros | Mesero, Cocina, Bar, Servicio Inventario |
| **SVC-CTA-004** | Cuentas | Entidad | Asociación de pedidos, división de cuenta, generación de ticket y cierre. | Operaciones de Sala | Mesero, Cliente, Servicio Caja |
| **SVC-INV-005** | Inventario | Entidad | Control de stock: entradas, descuentos automáticos y alertas de nivel crítico. | Administración / Almacén | Administrador, Servicio Pedidos |
| **SVC-CAJ-006** | Caja | Tarea | Orquesta flujo de pago: registra ingresos/egresos, gestiona arqueos y cierre de turno. | Cajero Jefe | Cajero (POS), Admin, Reportes |
| **SVC-REP-007** | Reportes | Tarea | Consolida datos de Caja, Pedidos e Inventario para dashboards y reportes. | Gerencia | Administrador, Gerencia |
| **SVC-NOT-008** | Notificaciones | Utilidad | Broker funcional: enruta y entrega notificaciones en tiempo real. | TI / Plataforma | Todos los servicios |
| **SVC-IDE-009** | Identidad | Utilidad | Autenticación, autorización por rol (RBAC) y auditoría. Emite y renueva JWT. | TI / Admin del Sistema | Todos los servicios |

---

## 10. Descripción breve de cada servicio (APF2)

### SVC-RES-001 — Servicio de Reservas
Servicio de entidad responsable del ciclo de vida completo de las reservas (creación, confirmación, cancelación, consulta de disponibilidad). Su *boundary* excluye el estado físico de las mesas; solo conoce la **intención** de reserva. Publica `ReservaCreada` y `ReservaCancelada`. Requiere validar la expiración automática de reservas no confirmadas.

### SVC-MES-002 — Servicio de Mesas
Servicio de entidad con estado propio (libre/ocupada/reservada). Independiente de Reservas: conoce el estado **físico** de cada mesa y gestiona la transición de «reservada» a «ocupada» al hacer check-in del cliente. Consume `ReservaCreada` y publica `MesaAsignada` / `MesaLiberada`.

### SVC-PED-003 — Servicio de Pedidos
**Capacidad central del negocio.** Registra ítems por mesa y los enruta automáticamente a cocina o bar según el campo `area` del ítem. No incluye lógica de cobro ni descuento de stock. Publica `PedidoCreado` y `PedidoListo`; consume `MesaAsignada`. **NFR crítico:** latencia ≤ 500 ms en creación de pedido. Trazabilidad completa por ítem.

### SVC-CTA-004 — Servicio de Cuentas
Servicio de entidad que agrupa pedidos por mesa y genera el ticket. Sin este servicio no hay cierre de mesa ni trazabilidad del consumo. Consume `PedidoListo`, publica `CuentaCerrada` y `TicketGenerado`. Requiere aclarar si `dividirCuenta()` genera múltiples tickets o un reparto de montos sobre un único ticket.

### SVC-INV-005 — Servicio de Inventario
Servicio de entidad crítico para el control de costos. Controla entradas de stock, descuento automático por pedido y alertas de nivel crítico. Consume `CuentaCerrada` para descontar stock y publica `StockBajo`. **Riesgo abierto:** definir si el descuento de stock ocurre al crear el pedido o al cerrar la cuenta.

### SVC-CAJ-006 — Servicio de Caja
Servicio de **tarea** que orquesta el flujo de pago. Registra movimientos (ingresos/egresos), realiza arqueos y emite reporte de cierre de turno. Soporta múltiples medios de pago (efectivo, tarjeta, QR). Consume `CuentaCerrada` y publica `PagoRegistrado` y `ArqueoRealizado`. Requiere consistencia eventual: `CuentaCerrada` no se pierde si Caja cae (cola persistente + idempotencia).

### SVC-REP-007 — Servicio de Reportes
Servicio de **tarea** que consume eventos de Caja, Pedidos e Inventario para construir un snapshot agregado. No almacena datos transaccionales propios; alimenta dashboards y exportaciones. Consume `PagoRegistrado`, `CuentaCerrada` y `StockDescontado` de forma asíncrona. **No participa en el camino crítico operativo.**

### SVC-NOT-008 — Servicio de Notificaciones
Servicio de utilidad. Actúa como **broker funcional de eventos**: consume todos los eventos del sistema y los enruta a los actores correspondientes (cocina, bar, mesero, cliente vía SMS/WhatsApp). **No bloquea el flujo principal:** todas sus operaciones son asíncronas.

### SVC-IDE-009 — Servicio de Identidad
Servicio de utilidad. Autentica usuarios, autoriza acciones por rol (RBAC) y registra auditoría de acciones críticas. Emite y renueva tokens JWT. **NFR crítico:** latencia ≤ 200 ms, disponibilidad 99.9% (su caída detiene todo). **Riesgo:** punto único de falla; mitigación con caché de tokens validados en el API Gateway.

---

## 11. Contratos iniciales de los servicios (APF2)

Las fichas de Pedidos, Caja e Identidad fueron desarrolladas en Semanas 7 y 8; las de Reservas, Mesas, Cuentas, Inventario, Reportes y Notificaciones se desarrollan en el APF2 al mismo nivel.

### 11.1 Ficha SVC-RES-001 — Reservas

| Campo | Detalle |
|---|---|
| **ID** | SVC-RES-001 |
| **Nombre** | Servicio de Reservas |
| **Propósito** | Gestionar el ciclo de vida completo de las reservas (crear, confirmar, cancelar, consultar disponibilidad). |
| **Capacidad asociada** | Gestión de reservas |
| **Boundary — Incluye** | Crear, confirmar, cancelar reserva; consultar disponibilidad por fecha/hora; expiración automática de reservas no confirmadas. |
| **Boundary — Excluye** | Asignar mesa física (Mesas), cobrar adelanto (Caja), notificar al cliente (Notificaciones). |
| **Owner funcional / técnico** | Recepción / Equipo Backend – Módulo Sala |
| **Consumidores** | Cliente (Web QR), Recepcionista, Servicio Mesas (consume `ReservaCreada`). |
| **Dependencias** | Identidad (JWT), Notificaciones. |
| **Operaciones preliminares** | `crearReserva()`, `confirmarReserva()`, `cancelarReserva()`, `consultarDisponibilidad()` |
| **Tipo de interacción** | Mixta: REST síncrono; `ReservaCreada` / `ReservaCancelada` asíncronos. |
| **Datos principales** | `Reserva {id, clienteId, fecha, hora, mesaPreferida, numComensales, estado, timestamp}` |
| **NFR crítico** | Latencia ≤ 600 ms en consulta de disponibilidad. Disponibilidad 99.5% en horario operativo. **Sin sobrebooking.** |
| **Riesgos abiertos** | Política de expiración automática de reservas no confirmadas tras X minutos y liberación del slot. |
| **Estado** | Diseñado preliminar |

**Endpoints REST:**

| Endpoint | Método | Propósito | Consumidor |
|---|---|---|---|
| `/reservas` | POST | Crear nueva reserva | Cliente (QR), Recepcionista |
| `/reservas/{id}/confirmar` | PATCH | Confirmar reserva pendiente | Recepcionista |
| `/reservas/{id}` | DELETE | Cancelar reserva | Cliente, Recepcionista |
| `/reservas/disponibilidad` | GET | Consultar slots disponibles | Cliente (QR), Recepcionista |

### 11.2 Ficha SVC-MES-002 — Mesas

| Campo | Detalle |
|---|---|
| **ID** | SVC-MES-002 |
| **Nombre** | Servicio de Mesas |
| **Propósito** | Controlar el estado físico de cada mesa (libre/ocupada/reservada) y su asignación a cuentas activas. |
| **Capacidad asociada** | Gestión de mesas físicas |
| **Boundary — Incluye** | Consultar estado, asignar mesa a cuenta, liberar mesa, transición de «reservada» a «ocupada» en check-in. |
| **Boundary — Excluye** | Crear/confirmar reservas (Reservas), registrar pedidos (Pedidos), cobrar (Caja). |
| **Owner funcional / técnico** | Operaciones de Sala / Equipo Backend – Módulo Sala |
| **Consumidores** | Mesero (App), Servicio Reservas, Servicio Cuentas. |
| **Dependencias** | Identidad (JWT). Sin dependencias funcionales en runtime. |
| **Operaciones preliminares** | `consultarEstado()`, `asignarMesa()`, `liberarMesa()` |
| **Tipo de interacción** | Mixta: REST síncrono; `MesaAsignada` / `MesaLiberada` asíncronos. Consume `ReservaCreada`. |
| **Datos principales** | `Mesa {id, numero, capacidad, ubicacion, estado, cuentaAsociada, timestamp}` |
| **NFR crítico** | Latencia ≤ 300 ms en consulta. **Consistencia fuerte:** una mesa no puede estar asignada a dos cuentas simultáneamente. |
| **Riesgos abiertos** | Conflicto si dos meseros intentan asignar la misma mesa simultáneamente. Mitigar con bloqueo optimista. |
| **Estado** | Diseñado preliminar |

**Endpoints REST:**

| Endpoint | Método | Propósito | Consumidor |
|---|---|---|---|
| `/mesas` | GET | Listar todas las mesas con su estado | Mesero, Recepcionista |
| `/mesas/disponibles` | GET | Listar mesas libres | Mesero |
| `/mesas/{id}/asignar` | PATCH | Asignar mesa a una cuenta | Mesero |
| `/mesas/{id}/liberar` | PATCH | Liberar mesa tras pago | Mesero, Servicio Caja |

### 11.3 Ficha SVC-PED-003 — Pedidos (documentada en Semana 7)

| Campo | Detalle |
|---|---|
| **ID** | SVC-PED-003 |
| **Nombre** | Servicio de Pedidos |
| **Propósito** | Capacidad central del negocio. Registrar ítems por mesa y enrutarlos automáticamente a cocina o bar. No incluye cobro ni descuento de stock. |
| **Capacidad asociada** | Gestión de pedidos de sala |
| **Boundary — Incluye** | Crear pedido, agregar ítems, actualizar estado (pendiente / en preparación / listo), consultar pedido por mesa. |
| **Boundary — Excluye** | Calcular totales, descontar stock, registrar pagos, asignar mesas. |
| **Owner funcional / técnico** | Operaciones de Sala / Jefe de Meseros / Equipo Backend – Módulo Sala |
| **Consumidores** | Mesero (App), Cocina (Pantalla), Bar (Pantalla), Servicio Inventario (evento `PedidoListo`). |
| **Dependencias** | Mesas (`MesaAsignada`), Notificaciones (`PedidoListo`), Identidad (JWT). |
| **Operaciones preliminares** | `crearPedido()`, `agregarItem()`, `actualizarEstado()`, `consultarPedido()` |
| **Tipo de interacción** | Mixta: REST síncrono; `PedidoCreado` / `PedidoListo` asíncronos. |
| **Datos principales** | `Pedido {id, mesaId, items[], estado, timestamp, area}`; `Item {id, nombre, cantidad, area, estado}` |
| **NFR crítico** | Latencia ≤ 500 ms en `crearPedido()`. Disponibilidad 99.5% en horario operativo. Trazabilidad completa por ítem. |
| **Riesgos abiertos** | Cancelación de pedido ya enviado a cocina: política de cancelación tardía y compensación. |
| **Estado** | Diseñado preliminar |

**Endpoints REST:**

| Endpoint | Método | Propósito | Consumidor |
|---|---|---|---|
| `/pedidos` | POST | Registrar nuevo pedido con ítems y enrutar a cocina/bar | Mesero, Cliente (QR) |
| `/pedidos/{id}` | GET | Consultar detalle y estado actual | Mesero, Cliente, Caja |
| `/pedidos/{id}/estado` | PATCH | Actualizar estado operativo (En preparación → Listo) | Cocina, Bar (KDS) |

### 11.4 Ficha SVC-CTA-004 — Cuentas

| Campo | Detalle |
|---|---|
| **ID** | SVC-CTA-004 |
| **Nombre** | Servicio de Cuentas |
| **Propósito** | Asociar todos los pedidos de una mesa, calcular total, dividir cuenta si aplica, generar ticket y cerrar cuenta. |
| **Capacidad asociada** | Gestión de cuentas y tickets |
| **Boundary — Incluye** | Abrir cuenta, agregar pedidos, calcular total con descuentos, dividir cuenta, generar ticket, cerrar cuenta. |
| **Boundary — Excluye** | Registrar pagos (Caja), descontar stock (Inventario), emitir comprobante fiscal (SUNAT). |
| **Owner funcional / técnico** | Operaciones de Sala / Equipo Backend – Módulo Sala |
| **Consumidores** | Mesero (App), Cliente (Web QR), Servicio Caja. |
| **Dependencias** | Pedidos (`GET /pedidos?mesa={id}` — síncrono), Identidad (JWT). |
| **Operaciones preliminares** | `abrirCuenta()`, `agregarPedido()`, `dividirCuenta()`, `cerrarCuenta()`, `generarTicket()` |
| **Tipo de interacción** | Mixta: cierre/generación síncrona; `CuentaCerrada` / `TicketGenerado` asíncronos. Consume `PedidoListo`. |
| **Datos principales** | `Cuenta {id, mesaId, pedidos[], subtotal, descuento, total, estado, ticket}`; `Ticket {id, cuentaRef, items[], total, fecha}` |
| **NFR crítico** | Latencia ≤ 700 ms en cierre de cuenta. Consistencia con Pedidos: ningún pedido pendiente debe permitir el cierre. |
| **Riesgos abiertos** | Definir si `dividirCuenta()` genera múltiples tickets o un reparto de montos sobre un solo ticket. |
| **Estado** | Diseñado preliminar |

**Endpoints REST:**

| Endpoint | Método | Propósito | Consumidor |
|---|---|---|---|
| `/cuentas` | POST | Abrir cuenta al asignar mesa | Mesero |
| `/cuentas/{id}` | GET | Consultar estado y detalle de cuenta | Mesero, Cliente |
| `/cuentas/{id}/dividir` | POST | Dividir cuenta entre comensales | Mesero |
| `/cuentas/{id}/cerrar` | POST | Cerrar cuenta y generar ticket | Mesero, Cliente |

### 11.5 Ficha SVC-INV-005 — Inventario

| Campo | Detalle |
|---|---|
| **ID** | SVC-INV-005 |
| **Nombre** | Servicio de Inventario |
| **Propósito** | Controlar stock de productos: registrar entradas, descontar automáticamente por pedido, mantener stock mínimo y emitir alertas. |
| **Capacidad asociada** | Gestión de stock y almacén |
| **Boundary — Incluye** | Registrar entrada de stock, consultar disponibilidad, reservar stock al crear pedido, descontar stock al cerrar cuenta, emitir alerta de stock crítico. |
| **Boundary — Excluye** | Compras a proveedores (proceso manual), registrar mermas detalladas (módulo futuro), cobrar (Caja). |
| **Owner funcional / técnico** | Administración / Almacén / Equipo Backend – Módulo Operaciones |
| **Consumidores** | Administrador (Dashboard), Servicio Pedidos (consulta y reserva stock), Servicio Reportes (consume `StockBajo`). |
| **Dependencias** | Identidad (JWT). |
| **Operaciones preliminares** | `registrarEntrada()`, `consultarStock()`, `reservarStock()`, `descontarStock()`, `actualizarStock()` |
| **Tipo de interacción** | Mixta: REST síncrono; `StockBajo` asíncrono. Consume `CuentaCerrada`. |
| **Datos principales** | `Producto {id, nombre, categoria, stockActual, stockMinimo, unidad, costo}`; `Movimiento {id, productoId, tipo, cantidad, motivo, ts}` |
| **NFR crítico** | Latencia ≤ 400 ms en consulta. Consistencia eventual para descuentos; síncrona para reservas críticas. |
| **Riesgos abiertos** | Definir si el descuento de stock ocurre al crear pedido o al cerrar cuenta. Compromiso entre evitar ventas sin stock y manejar cancelaciones tardías. |
| **Estado** | Diseñado preliminar |

**Endpoints REST:**

| Endpoint | Método | Propósito | Consumidor |
|---|---|---|---|
| `/inventario/{productoId}` | GET | Consultar stock disponible | Servicio Pedidos, Admin |
| `/inventario/reserva` | POST | Reservar stock al confirmar pedido | Servicio Pedidos |
| `/inventario/entrada` | POST | Registrar entrada de stock | Administrador |
| `/inventario/alertas` | GET | Listar productos con stock bajo | Administrador |

### 11.6 Ficha SVC-CAJ-006 — Caja (documentada en Semana 8)

| Campo | Detalle |
|---|---|
| **ID** | SVC-CAJ-006 |
| **Nombre** | Servicio de Caja |
| **Propósito** | Orquestar flujo completo de pago: registrar ingresos/egresos, gestionar arqueos y emitir reporte de cierre de turno. |
| **Capacidad asociada** | Gestión de caja y pagos |
| **Boundary — Incluye** | Registrar pago, registrar egreso, realizar arqueo de turno, generar reporte de turno. |
| **Boundary — Excluye** | Generar tickets, calcular totales de cuenta, gestionar stock, emitir reportes de gestión. |
| **Owner funcional / técnico** | Administración / Cajero Jefe / Equipo Backend – Módulo Financiero |
| **Consumidores** | Cajero (POS), Administrador (Dashboard), Servicio Reportes (evento `PagoRegistrado`). |
| **Dependencias** | Cuentas (`CuentaCerrada`), Notificaciones, Identidad. |
| **Operaciones preliminares** | `registrarPago()`, `registrarEgreso()`, `realizarArqueo()`, `generarReporteTurno()` |
| **Tipo de interacción** | Mixta: `registrarPago()` síncrono; consume `CuentaCerrada` asíncrono; publica `PagoRegistrado` asíncrono. |
| **Datos principales** | `Movimiento {id, tipo, monto, medio, cuentaRef, turnoId, ts}`; `Arqueo {turnoId, montoReal, diferencia}` |
| **NFR crítico** | Consistencia: `CuentaCerrada` no se pierde si Caja cae (cola persistente + idempotencia). Arqueo sin pérdida. |
| **Riesgos abiertos** | Inconsistencia si el pago se registra pero `CuentaCerrada` nunca llega (fallo del broker). Mitigar con Saga. |
| **Estado** | Diseñado preliminar |

### 11.7 Ficha SVC-REP-007 — Reportes

| Campo | Detalle |
|---|---|
| **ID** | SVC-REP-007 |
| **Nombre** | Servicio de Reportes |
| **Propósito** | Consolidar datos transaccionales de Caja, Pedidos e Inventario en snapshots agregados para dashboards y reportes gerenciales. |
| **Capacidad asociada** | Inteligencia de negocio y consolidación de datos |
| **Boundary — Incluye** | Construir vistas materializadas, generar reportes de ventas, stock, ocupación de mesas y rendimiento por turno. Exportar a PDF/Excel. |
| **Boundary — Excluye** | Procesar transacciones operativas (Caja/Pedidos), almacenar datos transaccionales detallados (solo agregados). |
| **Owner funcional / técnico** | Gerencia / Equipo Backend – Módulo Analítica |
| **Consumidores** | Administrador (Dashboard), Gerencia (Dashboard ejecutivo). |
| **Dependencias** | Broker (consume eventos), Identidad (JWT). Sin dependencias síncronas. |
| **Operaciones preliminares** | `generarReporteVentas()`, `generarReporteStock()`, `generarDashboard()`, `exportarReporte()` |
| **Tipo de interacción** | Asíncrona en alimentación (consume eventos); síncrona en consulta de reportes ya consolidados. |
| **Datos principales** | Snapshot agregado por turno, día, semana y mes. No datos transaccionales. |
| **NFR crítico** | Latencia ≤ 2 s en generación de reportes consolidados. Disponibilidad 99% (no crítico para operación). Reportes con retraso ≤ 5 min. |
| **Riesgos abiertos** | Inconsistencia si eventos llegan fuera de orden. Mitigar con timestamps y reprocesamiento periódico. |
| **Estado** | Diseñado preliminar |

**Endpoints REST:**

| Endpoint | Método | Propósito | Consumidor |
|---|---|---|---|
| `/reportes/ventas` | GET | Reporte de ventas por periodo | Admin, Gerencia |
| `/reportes/stock` | GET | Reporte de stock y rotación | Admin |
| `/reportes/dashboard` | GET | Snapshot agregado para dashboard | Admin, Gerencia |
| `/reportes/exportar` | POST | Exportar reporte a PDF/Excel | Admin, Gerencia |

### 11.8 Ficha SVC-NOT-008 — Notificaciones

| Campo | Detalle |
|---|---|
| **ID** | SVC-NOT-008 |
| **Nombre** | Servicio de Notificaciones |
| **Propósito** | Broker funcional de eventos: consumir todos los eventos del sistema y enrutarlos a los actores correspondientes (UI tiempo real, SMS, WhatsApp). |
| **Capacidad asociada** | Comunicación asíncrona transversal |
| **Boundary — Incluye** | Suscribir consumidores, publicar eventos, enrutar notificaciones a Cocina/Bar (UI), enviar SMS/WhatsApp al cliente, registrar estado de entrega. |
| **Boundary — Excluye** | Lógica de negocio (qué notificar y cuándo lo definen los servicios productores). |
| **Owner funcional / técnico** | TI / Plataforma / Equipo de Plataforma |
| **Consumidores** | Todos los servicios (publican eventos); Cocina, Bar, Mesero, Cliente (reciben notificaciones). |
| **Dependencias** | Gateway SMS/WhatsApp (externo), Identidad (JWT). |
| **Operaciones preliminares** | `publicarEvento()`, `suscribirseAEvento()`, `enviarNotificacion()`, `consultarEstadoEntrega()` |
| **Tipo de interacción** | **Asíncrona obligatoria.** Pub/Sub puro. |
| **Datos principales** | `Mensaje {id, eventoOrigen, destinatario, canal, contenido, estado, intentos, ts}`; `Suscripción {servicio, evento}` |
| **NFR crítico** | Throughput ≥ 100 msg/s en pico. Sin pérdida de mensajes (colas persistentes). No bloqueante. |
| **Riesgos abiertos** | Fallo del broker detiene la coreografía. Mitigar con dead-letter queues, reintentos automáticos y backup de eventos en disco. |
| **Estado** | Diseñado preliminar |

### 11.9 Ficha SVC-IDE-009 — Identidad (documentada en Semana 8)

| Campo | Detalle |
|---|---|
| **ID** | SVC-IDE-009 |
| **Nombre** | Servicio de Identidad |
| **Propósito** | Autenticar usuarios, gestionar autorización por rol (RBAC) y registrar auditoría de acciones críticas. |
| **Capacidad asociada** | Seguridad y control de acceso |
| **Boundary — Incluye** | Autenticar usuario, autorizar acción por rol, registrar auditoría, gestionar y renovar tokens JWT. |
| **Boundary — Excluye** | Gestionar datos de empleados, registrar movimientos de caja, controlar acceso físico al local. |
| **Owner funcional / técnico** | TI / Administrador del Sistema / Equipo de Seguridad / Plataforma |
| **Consumidores** | Todos los servicios (validación de token JWT en cada solicitud entrante). |
| **Dependencias** | BD propia de usuarios/tokens. Sin dependencias funcionales de otros servicios. |
| **Operaciones preliminares** | `autenticar()`, `autorizarAccion()`, `registrarAuditoria()`, `renovarToken()` |
| **Tipo de interacción** | Síncrona: auth/authz en tiempo real. Latencia crítica ≤ 200 ms. |
| **Datos principales** | `Usuario {id, nombre, rol, credenciales}`; `Token {jwt, expiry, userId, rol}`; `AuditoriaLog {accion, usuario, servicio, ts}` |
| **NFR crítico** | Latencia ≤ 200 ms. Disponibilidad 99.9% (su caída detiene todo). Tokens cifrados (HS256/RS256). |
| **Riesgos abiertos** | Punto único de falla: si Identidad cae, el sistema completo se detiene. Evaluar modo degradado con tokens de larga expiración. |
| **Estado** | Diseñado preliminar |

---

## 12. Matriz de integraciones (APF2)

Desarrollada en Semana 8 y consolidada en el APF2. Cuatro tablas: clasificación sincrónica, mapa request/response, presupuesto de latencia y análisis de bloqueo.

### 12.1 Clasificación síncrono / asíncrono

| Paso del flujo | Clasificación | Justificación |
|---|---|---|
| Validar cliente (Identidad) | **Síncrono obligatorio** | Sin autenticación no se procesa ninguna operación. |
| Calcular descuento/promoción (Cuentas/Pedidos) | **Síncrono obligatorio** | Total del ticket depende del descuento. |
| Reservar / asignar mesa (Mesas) | **Síncrono obligatorio** | Mesero necesita confirmación inmediata sin conflictos. |
| Crear pedido (Pedidos) | **Síncrono obligatorio** | Cocina/bar no puede actuar sin pedido creado con ID. |
| Descontar stock (Inventario) | **Síncrono discutible** | Ideal síncrono para evitar ventas sin stock; aceptable eventual si se valida previamente. |
| Cerrar cuenta y generar ticket (Cuentas) | **Síncrono obligatorio** | Cajero necesita el ticket para cobrar. |
| Registrar pago (Caja) | **Síncrono obligatorio** | Valida que el pago fue procesado antes de liberar mesa. |
| Liberar mesa (Mesas) | **Síncrono obligatorio** | Mesa debe quedar disponible inmediatamente. |
| Enviar notificación (Notificaciones) | **Mejor asíncrono** | Alertas a cocina/bar, confirmaciones WhatsApp/SMS no deben bloquear flujo. |
| Actualizar reportes (Reportes) | **Mejor asíncrono** | Dashboards no son críticos para cierre inmediato. |

### 12.2 Mapa de llamadas Request/Response

| Origen | Destino | Endpoint | Tipo | Respuesta esperada | Error crítico |
|---|---|---|---|---|---|
| App/Mesero | API Gateway | `POST /auth/token` | Síncrono | 200 JWT token | 401 Credenciales inválidas |
| API Gateway | Serv. Identidad | `POST /auth/validate` | Síncrono | 200 usuario autorizado | 403 Token expirado |
| API Gateway | Serv. Mesas | `GET /mesas/disponibles` | Síncrono | 200 lista de mesas libres | 503 servicio no disponible |
| API Gateway | Serv. Reservas | `POST /reservas` | Síncrono | 201 reserva creada | 409 conflicto de horario |
| Serv. Pedidos | Serv. Inventario | `GET /inventario/{itemId}` | Síncrono | 200 stock disponible | 409 stock insuficiente |
| Serv. Pedidos | Serv. Inventario | `POST /inventario/reserva` | Síncrono discutible | 201 reserva creada | 409 stock insuficiente |
| Serv. Cuentas | Serv. Pedidos | `GET /pedidos?mesa={id}` | Síncrono | 200 pedidos de la mesa | 404 mesa sin pedidos |
| Serv. Cuentas | API Gateway | `POST /cuentas/{id}/cerrar` | Síncrono | 200 ticket generado | 422 cuenta ya cerrada |
| Serv. Caja | Serv. Cuentas | `GET /cuentas/{id}/ticket` | Síncrono | 200 ticket con total | 404 cuenta no encontrada |
| Serv. Caja | API Gateway | `POST /pagos` | Síncrono | 201 pago registrado | 402 pago rechazado |
| Serv. Pedidos | Serv. Notificaciones | `POST /notificaciones/evento` | Asíncrono | 202 evento encolado | — (no bloquea flujo) |
| Serv. Caja | Serv. Reportes | Evento: `PagoRegistrado` | Asíncrono | 202 evento recibido | — (no bloquea flujo) |

### 12.3 Presupuesto de latencia

| Llamada | Latencia estimada | Secuencial / Paralela | Camino crítico |
|---|---|---|---|
| App/Mesero → API Gateway | 30 ms | Secuencial | Sí |
| API Gateway → Serv. Identidad (validar JWT) | 80 ms | Secuencial | Sí |
| API Gateway → Serv. Mesas (consultar disponibilidad) | 100 ms | Secuencial | Sí |
| Serv. Pedidos → Serv. Inventario (consultar stock) | 120 ms | Paralela | Sí |
| Serv. Pedidos → Serv. Inventario (reservar stock) | 150 ms | Secuencial | Sí |
| Serv. Cuentas → Serv. Pedidos (obtener ítems) | 100 ms | Secuencial | Sí |
| Serv. Cuentas (cerrar cuenta + generar ticket) | 120 ms | Secuencial | Sí |
| Serv. Caja → Serv. Cuentas (obtener ticket) | 80 ms | Secuencial | Sí |
| Serv. Caja (registrar pago) | 150 ms | Secuencial | Sí |
| Serv. Mesas (liberar mesa tras pago) | 80 ms | Secuencial | Sí |
| Procesamiento interno (lógica de negocio) | 100 ms | — | — |
| Serv. Pedidos → Notificaciones (cocina/bar) | 200 ms | Asíncrono | No |
| Serv. Caja → Reportes (evento `PagoRegistrado`) | 150 ms | Asíncrono | No |
| **TOTAL CAMINO CRÍTICO (secuencial)** | **1,110 ms** | **Dentro de presupuesto (≤ 2,000 ms) ✓** | |

**Con paralelismo (Inventario):** se reemplaza la suma consulta + reserva inventario (270 ms) por `max(150, 100) = 150 ms`. **Total optimizado: ~990 ms.**

### 12.4 Análisis de servicios bloqueantes

| Servicio | ¿Bloquea flujo? | Riesgo | Mitigación propuesta |
|---|---|---|---|
| **Identidad** | Sí | Ninguna operación sin JWT válido | Cache de tokens validados (TTL corto); circuit breaker si cae |
| **Mesas** | Sí | Sin confirmación, no inicia atención | Timeout 500 ms + respuesta de error clara (409/503) |
| **Pedidos** | Sí | Cocina/bar no recibe órdenes sin ID | Retry automático con backoff exponencial; estado 'pendiente' si falla |
| **Inventario** | Sí/Parcial | Pueden venderse ítems agotados | Fallback: aprobar pedido y marcar revisión manual; alerta `StockBajo` |
| **Cuentas** | Sí | Sin ticket no se cobra ni libera mesa | Timeout 1,000 ms; reintentar generación hasta 3 veces |
| **Caja** | Sí | Sin pago confirmado, mesa no se libera | Timeout + respuesta clara; no liberar mesa sin confirmación |
| **Notificaciones** | No debería | Si bloquea, cocina espera | Mover 100% a asíncrono mediante RabbitMQ |
| **Reportes** | No | Impacto no crítico | Evento asíncrono; no participa en camino crítico |

### 12.5 Mejoras propuestas

| Tipo de mejora | Descripción |
|---|---|
| **Mejora de latencia 1** | Ejecutar validación de stock (Inventario) en paralelo con la consulta de ítems del pedido (operaciones independientes). Ahorro: 100-120 ms. |
| **Mejora de latencia 2** | Mover la emisión de comprobante fiscal a proceso diferido (asíncrono) cuando la regulación lo permita. Mesa queda liberada tras el pago. Ahorro: 150-200 ms potenciales. |
| **Reducción de acoplamiento 1** | Mover notificaciones a cocina y bar completamente al patrón de coreografía: Pedidos publica `PedidoCreado`, Notificaciones lo consume asíncronamente. |
| **Reducción de acoplamiento 2** | Implementar cache de validación JWT en el API Gateway (TTL: 60 s). Si Identidad cae, el Gateway sigue validando tokens recientes. |

---

## 13. Decisiones arquitectónicas clave — ADRs (APF2)

Siete decisiones documentadas en formato **Architecture Decision Record** (Título, Estado, Contexto, Decisión, Justificación Técnica, Alternativas, Consecuencias).

### ADR-001 — Adopción del estilo arquitectónico SOA

- **Estado:** Aceptada
- **Contexto:** Nachopps opera con múltiples dominios funcionales (cocina, sala, caja, almacén, recepción) con ciclos de vida, actores y ritmos de cambio distintos. Los procesos manuales generan silos sin contratos. Se necesita un estilo que refleje la naturaleza distribuida del negocio y permita evolución independiente de cada dominio sin sacrificar coherencia global.
- **Decisión:** SOA como estilo base. Cada dominio funcional se modela como servicio autónomo con contrato, lógica y datos propios. Integración solo vía contratos (REST/OpenAPI) y eventos (mensajería), nunca por dependencias internas o acceso compartido a datos.
- **Justificación técnica:**
  - Modela con precisión los dominios reales del negocio.
  - Aplica principios SOA (autonomía, contrato estandarizado, bajo acoplamiento, abstracción, reutilización, stateless, descubrimiento, composición).
  - Facilita escalabilidad a futuras sucursales sin rediseño estructural.
  - Reutilización de servicios transversales sin duplicar lógica.
- **Alternativas consideradas:**
  - **Monolítica:** simpleza inicial; pero acoplamiento fuerte, difícil escalar, alto impacto ante fallos parciales.
  - **Microservicios de granularidad excesiva:** máxima independencia; pero sobrecarga operativa desproporcionada para un solo local.
- **Consecuencias:**
  - ✅ Autonomía total entre servicios; integración por contratos versionables; escalabilidad horizontal selectiva; reutilización efectiva.
  - ⚠️ Mayor complejidad operativa; versionado riguroso desde el inicio; curva de aprendizaje del equipo.

### ADR-002 — Una base de datos por servicio

- **Estado:** Aceptada
- **Contexto:** Compartir BD genera acoplamiento implícito por esquema. Distintos servicios tienen patrones de acceso diferentes (Pedidos: baja latencia en escritura; Reportes: lecturas agregadas).
- **Decisión:** Cada uno de los 9 servicios tendrá su propia instancia de PostgreSQL. Ningún servicio accede directamente a la BD de otro; toda comunicación pasa por contrato o eventos.
- **Justificación técnica:** Cumple estrictamente el principio de autonomía SOA; permite optimización por servicio; escalabilidad independiente; aísla fallos.
- **Alternativas consideradas:**
  - **BD compartida con schemas lógicos:** menor costo, backups consolidados; pero acoplamiento de disponibilidad y contención de recursos.
  - **BD compartida sin schemas:** simpleza inicial; pero acoplamiento total; viola autonomía SOA.
- **Consecuencias:**
  - ✅ Autonomía completa; aislamiento de fallos en persistencia; libertad de elegir motor distinto a futuro.
  - ⚠️ Mayor costo operativo (9 instancias); sin joins directos cross-dominio (se resuelve por composición o Reportes); mayor complejidad para consistencia distribuida (mitigada por ADR-006).

### ADR-003 — API Gateway como único punto de entrada

- **Estado:** Aceptada
- **Contexto:** 6 apps cliente acceden a 9 servicios. Sin Gateway, cada cliente debe conocer la topología interna, manejar autenticación y replicar lógica transversal.
- **Decisión:** Implementar API Gateway (Kong/NGINX) como único punto de entrada. Centraliza enrutamiento, validación de JWT, rate limiting, logging y descubrimiento.
- **Justificación técnica:** Aplica el principio de descubrimiento SOA; centraliza políticas transversales; facilita versionado; habilita modo degradado vía caché de JWT.
- **Alternativas consideradas:**
  - **Acceso directo cliente-servicio:** menor latencia; pero clientes acoplados a topología interna.
  - **BFF por tipo de cliente:** APIs optimizadas; pero más componentes que mantener y duplicación de orquestación.
- **Consecuencias:**
  - ✅ Clientes desacoplados de la topología; punto único para seguridad/rate limiting/observabilidad; facilita versionado; habilita modo degradado.
  - ⚠️ Punto único de falla potencial (requiere alta disponibilidad); +30 ms de latencia adicional por petición; infraestructura adicional para despliegue y monitoreo.

### ADR-004 — Comunicación híbrida síncrona y asíncrona

- **Estado:** Aceptada
- **Contexto:** El sistema combina operaciones que requieren confirmación inmediata (validar stock, registrar pago) con otras de segundo plano (notificar cocina, alimentar reportes). Forzar todo a un solo modelo es subóptimo.
- **Decisión:** REST/HTTPS para flujos síncronos del camino crítico; **RabbitMQ con patrón Publish/Subscribe (AMQP)** para eventos asíncronos. Clasificación documentada en matriz de integraciones (sección 12).
- **Justificación técnica:** Camino crítico cuantificado en 1,110 ms (≤ 2,000 ms presupuesto); operaciones no críticas no bloquean; coreografía basada en eventos desacopla productores y consumidores; recuperación ante fallos vía reintentos y DLQ.
- **Alternativas consideradas:**
  - **Solo REST síncrono:** simple y uniforme; pero acoplamiento temporal y latencia acumulada excede presupuesto.
  - **Solo event-driven puro:** máximo desacoplamiento; pero mala experiencia donde se requiere confirmación inmediata.
- **Consecuencias:**
  - ✅ Camino crítico cumple presupuesto; notificaciones y reportes desacoplados; coreografía permite añadir consumidores sin tocar productores.
  - ⚠️ Necesidad de patrones para consistencia eventual (Saga, idempotencia); mayor complejidad operativa al monitorear dos canales; requiere RabbitMQ en alta disponibilidad.

### ADR-005 — Autenticación basada en JWT con caché en API Gateway

- **Estado:** Aceptada
- **Contexto:** Identidad valida cada solicitud (NFR: ≤ 200 ms, 99.9%). Si cae, todo se detiene. Validar cada token añade ~80 ms al camino crítico.
- **Decisión:** JWT como mecanismo principal. Identidad emite tokens firmados (HS256/RS256) que los servicios validan localmente. API Gateway mantiene **caché de tokens válidos con TTL corto (60 s)**, permitiendo operación si Identidad cae momentáneamente.
- **Justificación técnica:** JWT auto-contenidos y verificables sin consultar backend; reduce dependencia temporal con Identidad; estándar ampliamente soportado.
- **Alternativas consideradas:**
  - **Sesiones con Redis:** control centralizado, revocación inmediata; pero acoplamiento al store y mala escalabilidad.
  - **OAuth2 con servidor externo:** alta robustez; pero complejidad excesiva para un solo local.
- **Consecuencias:**
  - ✅ Validación descentralizada; desacoplamiento del camino crítico respecto a Identidad; ahorro de ~80 ms.
  - ⚠️ Revocación no inmediata (esperar TTL); proteger claves de firma con extremo cuidado; política clara de expiración/renovación.

### ADR-006 — Patrón Saga para consistencia distribuida en flujo de pago

- **Estado:** Aceptada
- **Contexto:** El flujo de cierre de cuenta involucra varios servicios en secuencia: Cuentas → Caja → Mesas → Inventario. Cada uno con su propia BD (ADR-002). Sin transacción distribuida tradicional, una falla parcial deja el sistema inconsistente.
- **Decisión:** Patrón **Saga con compensaciones** para el flujo crítico de cobro. Cada paso publica un evento que dispara el siguiente. Ante fallo, se ejecutan acciones compensatorias en orden inverso.
- **Justificación técnica:** No requiere transacciones distribuidas (XA, 2PC) — inviables en SOA con BDs independientes; garantiza consistencia eventual con compensaciones bien definidas; aprovecha mensajería ya implementada (ADR-004); trazabilidad completa.
- **Alternativas consideradas:**
  - **2PC (Two-Phase Commit):** consistencia fuerte; pero bloqueante, no escalable, no aplica con BDs heterogéneas.
  - **Eventual sin compensaciones (best-effort):** simple; pero estados inconsistentes silenciosos y auditoría compleja.
- **Consecuencias:**
  - ✅ Consistencia eventual garantizada sin transacciones distribuidas; trazabilidad completa; recuperación automática.
  - ⚠️ Mayor complejidad de diseño y prueba (cada operación requiere su compensación); idempotencia obligatoria; documentación rigurosa de flujos de compensación.

### ADR-007 — Notificaciones como broker funcional de eventos

- **Estado:** Aceptada
- **Contexto:** Notificaciones a múltiples actores (cocina, bar, mesero, cliente, admin) por múltiples canales (UI, SMS, WhatsApp). Si cada servicio implementa su propia lógica, se duplica código y se acopla a los canales.
- **Decisión:** Servicio de Notificaciones como servicio de utilidad que **actúa como broker funcional de eventos**. Consume todos los eventos publicados y los enruta al canal apropiado. Productores publican eventos sin saber quién o cómo los consume.
- **Justificación técnica:** Aplica reutilización SOA y DRY; desacopla productores de los canales; permite añadir nuevos canales (push, email, voz) sin tocar negocio.
- **Alternativas consideradas:**
  - **Cada servicio implementa sus notificaciones:** lógica próxima al dominio; pero duplicación, acoplamiento a canales, mantenimiento disperso.
  - **Notificaciones en el API Gateway:** centralización en infraestructura existente; pero Gateway se vuelve God Object y mezcla responsabilidades.
- **Consecuencias:**
  - ✅ Lógica centralizada y reutilizable; productores desacoplados de canales; fácil agregar nuevos canales o cambiar proveedores; auditoría centralizada.
  - ⚠️ Notificaciones se vuelve componente crítico para UX; requiere alta disponibilidad del broker (RabbitMQ); su falla genera retrasos perceptibles en cocina/bar (mitigado con colas persistentes).

---

## 14. Riesgos técnicos consolidados (APF2)

12 riesgos clasificados por impacto y probabilidad. Amplían los 6 riesgos generales identificados en el APF1.

| ID | Riesgo | Impacto | Probabilidad | Mitigación |
|---|---|---|---|---|
| **RT-01** | Definición incorrecta de límites de servicio (muy amplios o finos) | Alto | Alta | Aplicar Domain-Driven Design para validar cohesión. Revisión por pares en cada iteración. |
| **RT-02** | Contratos mal definidos que generen acoplamiento implícito entre servicios | Alto | Media | Formalizar contratos en OpenAPI y aplicar versionado semántico desde el inicio. |
| **RT-03** | Inconsistencia de datos en flujos distribuidos (pago registrado pero stock no descontado) | Alto | Media | Patrón Saga con compensaciones transaccionales en flujos críticos (ADR-006). |
| **RT-04** | Fallo del broker de mensajes (RabbitMQ) afectando la coreografía | Alto | Baja | Colas persistentes, reintentos automáticos y dead-letter queues. |
| **RT-05** | Servicio de Identidad como punto único de falla | Alto | Media | Caché JWT en Gateway (ADR-005). Modo degradado con tokens de larga expiración. |
| **RT-06** | Latencia del camino crítico excede presupuesto en horas pico | Medio | Media | Monitoreo continuo. Paralelización de llamadas independientes (Inventario + Pedidos). |
| **RT-07** | Conectividad limitada en el local (Sullana) | Medio | Media | Servicios críticos operan localmente con sincronización diferida a la nube al reconectarse. |
| **RT-08** | Conflicto de concurrencia al asignar mesas simultáneamente | Medio | Baja | Bloqueo optimista con versionado en la BD de Mesas. |
| **RT-09** | Reservas no confirmadas saturan el calendario | Medio | Media | Política de expiración automática (15 min sin confirmación = liberación). |
| **RT-10** | Resistencia del personal al uso del sistema | Medio | Alta | Interfaces simples por rol; capacitación progresiva por módulo. |
| **RT-11** | Pasarela de pagos externa caída | Alto | Baja | Fallback a registro manual de pago en efectivo. Sincronización posterior. |
| **RT-12** | Pérdida de eventos en RabbitMQ por sobrecarga | Alto | Baja | Configurar persistencia obligatoria + alta disponibilidad en cluster del broker. |

---

## 15. Trazabilidad APF1 → APF2

Conforme a la regla de continuidad del curso, el APF2 **no descarta ni rehace** lo entregado en el APF1; lo amplía, refina y formaliza con mayor rigor técnico.

| Aspecto | APF1 (Semana 5) | APF2 (Semana 10) |
|---|---|---|
| **Servicios identificados** | 9 servicios candidatos con tipo SOA | Inventario formal con IDs (SVC-XXX-NNN), owners y consumidores específicos |
| **Límites de servicio** | Datos, operaciones y mensajes a alto nivel | Boundary «Incluye/Excluye» explícito; NFRs cuantificados; riesgos por servicio |
| **Contratos** | Sin contratos formales | Endpoints REST detallados + OpenAPI para Pedidos; fichas técnicas de los 9 servicios |
| **Integraciones** | Mensajes publicados/consumidos a alto nivel | Matriz síncrono/asíncrono; mapa Request/Response con códigos de error; presupuesto de latencia |
| **Justificación arquitectónica** | Principios SOA en tabla | 7 ADRs formales con contexto, decisión, alternativas y consecuencias |
| **Riesgos** | 6 riesgos generales | 12 riesgos técnicos clasificados por impacto/probabilidad con mitigación específica |
| **Diagramas** | Mapa de capacidades textual + BPMN del proceso end-to-end | Diagramas C4 Contexto + Contenedores en Structurizr DSL |

### Resultado esperado del APF2

Al concluir, el equipo puede mostrar con criterio:
- **Cómo se estructura la solución:** seis capas verticales con responsabilidades claras.
- **Cómo interactúan los servicios:** matriz formal síncrono/asíncrono con presupuesto de latencia cuantificado.
- **Qué contratos existen:** fichas técnicas detalladas para los 9 servicios con endpoints, NFRs y riesgos.
- **Por qué el diseño es coherente:** 7 ADRs que justifican cada decisión con sus alternativas y consecuencias.

---

## 16. Anexo: Código fuente Structurizr DSL

> Código completo para renderizar los diagramas C4 (Contexto + Contenedores) en [https://playground.structurizr.com/](https://playground.structurizr.com/).

```dsl
workspace "Nachopps Restobar" "Plataforma SOA para gestión integral del restobar" {
    !identifiers hierarchical
    model {
        // ACTORES
        cliente = person "Cliente" "Reserva, consume y paga."
        recepcionista = person "Recepcionista" "Gestiona reservas del local."
        mesero = person "Mesero" "Toma pedidos y asigna mesas."
        cocina = person "Cocina" "Prepara ítems y actualiza estado."
        bar = person "Bar" "Prepara bebidas y actualiza estado."
        cajero = person "Cajero" "Registra pagos y arqueos."
        admin = person "Administrador" "Gestiona inventario y consulta reportes."
        gerencia = person "Gerencia" "Consulta reportes consolidados."

        // SISTEMA PRINCIPAL
        nachopps = softwareSystem "Plataforma Nachopps Restobar" "Plataforma SOA que digitaliza reservas, pedidos, cuentas, caja, inventario y reportes." {
            // CAPA DE PRESENTACIÓN
            appMesero          = container "App Mesero"             "App móvil para registrar pedidos y gestionar mesas." "Flutter" "WebApp"
            webCliente         = container "Web Cliente (QR)"       "Interfaz para reservar y consultar menú/cuenta."     "React"   "WebApp"
            pantallaCocina     = container "Pantalla Cocina"        "Muestra pedidos pendientes y permite cambiar estado." "React"  "WebApp"
            pantallaBar        = container "Pantalla Bar"           "Muestra bebidas pendientes y permite cambiar estado." "React"  "WebApp"
            posCaja            = container "POS Caja"               "Aplicación para registrar pagos y arqueos."          "Electron + React" "WebApp"
            dashboardAdmin     = container "Dashboard Administrador" "Panel para reportes, inventario y supervisión."     "React"   "WebApp"

            // CAPA DE APLICACIÓN
            apiGateway         = container "API Gateway"            "Punto único de entrada. Enruta solicitudes y valida JWT." "Kong / NGINX" "Gateway"

            // SERVICIOS DE NEGOCIO
            svcReservas        = container "Servicio de Reservas"   "Ciclo de vida de reservas."                "Servicio de Entidad" "Service"
            svcMesas           = container "Servicio de Mesas"      "Estado de mesas y asignación."             "Servicio de Entidad" "Service"
            svcPedidos         = container "Servicio de Pedidos"    "Registro y enrutamiento de ítems."         "Servicio de Entidad" "Service"
            svcCuentas         = container "Servicio de Cuentas"    "Tickets y cierre de cuentas."              "Servicio de Entidad" "Service"
            svcInventario      = container "Servicio de Inventario" "Control de stock."                          "Servicio de Entidad" "Service"
            svcCaja            = container "Servicio de Caja"       "Flujo de pago y arqueos."                  "Servicio de Tarea"   "Service"
            svcReportes        = container "Servicio de Reportes"   "Consolidación para dashboards."            "Servicio de Tarea"   "Service"

            // SERVICIOS DE UTILIDAD
            svcIdentidad       = container "Servicio de Identidad"      "Autenticación, RBAC, auditoría, JWT."       "Servicio de Utilidad" "Support"
            svcNotificaciones  = container "Servicio de Notificaciones" "Entrega notificaciones en tiempo real."     "Servicio de Utilidad" "Support"

            // MENSAJERÍA
            broker             = container "Message Broker" "Distribuye eventos asíncronos (pub/sub)." "RabbitMQ" "Broker"

            // DATOS (una BD por servicio)
            dbReservas    = container "BD Reservas"       "Reservas y disponibilidad."   "PostgreSQL" "Database"
            dbMesas       = container "BD Mesas"          "Estado de mesas."             "PostgreSQL" "Database"
            dbPedidos     = container "BD Pedidos"        "Pedidos e ítems."             "PostgreSQL" "Database"
            dbCuentas     = container "BD Cuentas"        "Cuentas y tickets."           "PostgreSQL" "Database"
            dbInventario  = container "BD Inventario"     "Productos y stock."           "PostgreSQL" "Database"
            dbCaja        = container "BD Caja"           "Movimientos y arqueos."       "PostgreSQL" "Database"
            dbReportes    = container "BD Reportes"       "Snapshots agregados."         "PostgreSQL" "Database"
            dbIdentidad   = container "BD Identidad"      "Usuarios, roles y tokens."    "PostgreSQL" "Database"
            dbNotif       = container "BD Notificaciones" "Mensajes y estado de envío."  "PostgreSQL" "Database"
        }

        // SISTEMAS EXTERNOS
        pasarelaPago = softwareSystem "Pasarela de Pagos"     "Procesa pagos con tarjeta/QR."          "External"
        sunat        = softwareSystem "SUNAT"                  "Emisión de comprobantes electrónicos." "External"
        gatewaySMS   = softwareSystem "Gateway SMS/WhatsApp"   "Envío de recordatorios al cliente."    "External"

        // ACTORES → APPS
        cliente        -> nachopps.webCliente       "Reserva y consulta menú/cuenta"
        recepcionista  -> nachopps.webCliente       "Gestiona reservas"
        mesero         -> nachopps.appMesero        "Toma pedidos y asigna mesas"
        cocina         -> nachopps.pantallaCocina   "Consulta y actualiza pedidos"
        bar            -> nachopps.pantallaBar      "Consulta y actualiza bebidas"
        cajero         -> nachopps.posCaja          "Registra pagos y arqueos"
        admin          -> nachopps.dashboardAdmin   "Gestiona inventario y reportes"
        gerencia       -> nachopps.dashboardAdmin   "Consulta reportes"

        // APPS → GATEWAY
        nachopps.appMesero        -> nachopps.apiGateway "Llama API" "HTTPS/JSON"
        nachopps.webCliente       -> nachopps.apiGateway "Llama API" "HTTPS/JSON"
        nachopps.pantallaCocina   -> nachopps.apiGateway "Llama API" "HTTPS/JSON"
        nachopps.pantallaBar      -> nachopps.apiGateway "Llama API" "HTTPS/JSON"
        nachopps.posCaja          -> nachopps.apiGateway "Llama API" "HTTPS/JSON"
        nachopps.dashboardAdmin   -> nachopps.apiGateway "Llama API" "HTTPS/JSON"

        // GATEWAY → SERVICIOS
        nachopps.apiGateway -> nachopps.svcIdentidad  "Valida JWT y autoriza" "HTTPS/REST"
        nachopps.apiGateway -> nachopps.svcReservas   "Enruta operaciones"    "HTTPS/REST"
        nachopps.apiGateway -> nachopps.svcMesas      "Enruta operaciones"    "HTTPS/REST"
        nachopps.apiGateway -> nachopps.svcPedidos    "Enruta operaciones"    "HTTPS/REST"
        nachopps.apiGateway -> nachopps.svcCuentas    "Enruta operaciones"    "HTTPS/REST"
        nachopps.apiGateway -> nachopps.svcInventario "Enruta operaciones"    "HTTPS/REST"
        nachopps.apiGateway -> nachopps.svcCaja       "Enruta operaciones"    "HTTPS/REST"
        nachopps.apiGateway -> nachopps.svcReportes   "Enruta consultas"      "HTTPS/REST"

        // LLAMADAS SÍNCRONAS ENTRE SERVICIOS
        nachopps.svcPedidos -> nachopps.svcInventario "GET /inventario/{itemId} + POST /inventario/reserva" "HTTPS/REST"
        nachopps.svcCuentas -> nachopps.svcPedidos    "GET /pedidos?mesa={id}"                              "HTTPS/REST"
        nachopps.svcCaja    -> nachopps.svcCuentas    "GET /cuentas/{id}/ticket"                            "HTTPS/REST"

        // EVENTOS PUBLICADOS
        nachopps.svcReservas    -> nachopps.broker "Publica ReservaCreada, ReservaCancelada"  "AMQP"
        nachopps.svcMesas       -> nachopps.broker "Publica MesaAsignada, MesaLiberada"        "AMQP"
        nachopps.svcPedidos     -> nachopps.broker "Publica PedidoCreado, PedidoListo"          "AMQP"
        nachopps.svcCuentas     -> nachopps.broker "Publica CuentaCerrada, TicketGenerado"      "AMQP"
        nachopps.svcCaja        -> nachopps.broker "Publica PagoRegistrado, ArqueoRealizado"    "AMQP"
        nachopps.svcInventario  -> nachopps.broker "Publica StockBajo"                          "AMQP"
        nachopps.svcIdentidad   -> nachopps.broker "Publica UsuarioAutenticado"                 "AMQP"

        // EVENTOS CONSUMIDOS
        nachopps.broker -> nachopps.svcMesas          "Consume ReservaCreada"                                       "AMQP"
        nachopps.broker -> nachopps.svcCuentas        "Consume PedidoListo"                                         "AMQP"
        nachopps.broker -> nachopps.svcCaja           "Consume CuentaCerrada"                                       "AMQP"
        nachopps.broker -> nachopps.svcInventario     "Consume CuentaCerrada"                                       "AMQP"
        nachopps.broker -> nachopps.svcReportes       "Consume PagoRegistrado, CuentaCerrada, StockDescontado"      "AMQP"
        nachopps.broker -> nachopps.svcNotificaciones "Consume y enruta todos los eventos"                          "AMQP"

        // SERVICIOS → BD PROPIA
        nachopps.svcReservas       -> nachopps.dbReservas    "Lee/escribe" "JDBC"
        nachopps.svcMesas          -> nachopps.dbMesas       "Lee/escribe" "JDBC"
        nachopps.svcPedidos        -> nachopps.dbPedidos     "Lee/escribe" "JDBC"
        nachopps.svcCuentas        -> nachopps.dbCuentas     "Lee/escribe" "JDBC"
        nachopps.svcInventario     -> nachopps.dbInventario  "Lee/escribe" "JDBC"
        nachopps.svcCaja           -> nachopps.dbCaja        "Lee/escribe" "JDBC"
        nachopps.svcReportes       -> nachopps.dbReportes    "Lee/escribe" "JDBC"
        nachopps.svcIdentidad      -> nachopps.dbIdentidad   "Lee/escribe" "JDBC"
        nachopps.svcNotificaciones -> nachopps.dbNotif       "Lee/escribe" "JDBC"

        // INTEGRACIONES EXTERNAS
        nachopps.svcCaja           -> pasarelaPago "Procesa pago"                  "HTTPS/REST"
        nachopps.svcCuentas        -> sunat        "Emite comprobante electrónico" "HTTPS/SOAP"
        nachopps.svcNotificaciones -> gatewaySMS   "Envía SMS/WhatsApp"             "HTTPS/REST"
    }

    views {
        systemContext nachopps "Contexto" {
            include *
            autoLayout lr
        }
        container nachopps "Contenedores" {
            include *
            autoLayout tb 400 300
        }
        styles {
            element "Person"          { shape Person background #1168bd color #ffffff }
            element "Software System" { background #1168bd color #ffffff }
            element "External"        { background #999999 color #ffffff }
            element "Container"       { background #438dd5 color #ffffff }
            element "WebApp"          { background #438dd5 color #ffffff }
            element "Gateway"         { background #438dd5 color #ffffff }
            element "Service"         { background #438dd5 color #ffffff }
            element "Support"         { background #438dd5 color #ffffff }
            element "Broker"          { shape Pipe     background #438dd5 color #ffffff }
            element "Database"        { shape Cylinder background #438dd5 color #ffffff }
        }
        theme default
    }
}
```

---

## RESUMEN PARA EL AGENTE

**Estado del proyecto al cierre del APF2 (Semana 10):**

1. **Caso:** Plataforma SOA para Nachopps Restobar (Sullana, Piura).
2. **Stack arquitectónico:** SOA + C4 + Structurizr DSL + REST/OpenAPI + RabbitMQ (AMQP) + PostgreSQL (BD por servicio) + JWT + Kong/NGINX como API Gateway.
3. **Stack de implementación:** Flutter (móvil), React (web), Electron+React (POS), Kong/NGINX (gateway), microservicios backend (no se ha fijado lenguaje), PostgreSQL, RabbitMQ.
4. **9 servicios definidos** (5 Entidad, 2 Tarea, 2 Utilidad) con sus fichas, contratos, NFRs y boundaries.
5. **Camino crítico cuantificado:** 1,110 ms secuencial / ~990 ms con paralelismo (presupuesto: 2,000 ms).
6. **7 ADRs aprobados** que justifican el estilo, autonomía de datos, gateway centralizado, comunicación híbrida, JWT con caché, patrón Saga y broker funcional de notificaciones.
7. **12 riesgos técnicos** mapeados con impacto, probabilidad y mitigación.
8. **Siguiente paso natural:** APF3/implementación — pasar de contratos preliminares a OpenAPI 3.x completo por servicio, prototipo del flujo crítico (reserva → pedido → cuenta → pago → libración de mesa), pruebas de carga sobre el presupuesto de latencia, e implementación del patrón Saga del flujo de cobro.


