# Especificación de Flujos Funcionales de Negocio y Arquitectura para Sistema POS de Restaurante

Este documento detalla la lógica de negocio, las operaciones en tiempo real y la arquitectura orientada a eventos para un sistema de Punto de Venta (POS) y Gestión Hospitalaria de nivel empresarial. Combina los flujos operativos del personal de restaurante con la interacción técnica de microservicios, WebSockets y bases de datos.

---

## Flujo A: Toma de Pedidos (Comandas) y Gestión de Cuentas

### 1. Flujo Base (Happy Path)
1. **Acceso al módulo:** El mesero ingresa a la aplicación móvil o tablet en la sección de **Comandas**. El frontend renderiza el menú categorizado (Entradas, Fondos, Bebidas, Postres) consultando el caché local sincronizado con el backend.
2. **Selección de Mesa:** El mesero visualiza el mapa de distribución y selecciona una mesa en estado `LIBRE` (Verde).
3. **Configuración de Ítems:** Agrega productos al carrito de compras digital. Cada interacción ejecuta una validación de stock en vivo contra el inventario disponible en memoria (ej. Redis/RAM) para evitar la sobreventa de platos limitados.
4. **Modificadores:** El mesero puede asociar especificaciones o modificadores a cada ítem (ej. "Sin cebolla", "Término medio", "Con hielo y limón").
5. **Confirmación y Persistencia:** Al presionar "Enviar Pedido", el `servicio-pedidos` valida las reglas de negocio, bloquea temporalmente el stock del inventario y cambia automáticamente el estado de la mesa a `OCUPADA`.
6. **Apertura de Cuenta:** En paralelo, se interactúa con el `servicio-cuentas` para abrir un estado de cuenta corriente enlazado al ID único de la mesa y al ID del mesero.
7. **Emisión de Evento:** El sistema publica en el broker de mensajería (Kafka/RabbitMQ) el evento estándar:
   ```json
   {
     "evento": "pedido.creado",
     "timestamp": "2026-05-21T11:35:00Z",
     "data": {
       "pedido_id": "PED-98765",
       "mesa_id": "MESA-12",
       "camarero_id": "EMP-04",
       "items": [...]
     }
   }
   ```

### 2. Casos Límite y Mejoras Operativas
* **Adiciones Continuas (Cuentas Abiertas):** Los clientes suelen pedir productos adicionales durante su estancia (ej. más bebidas). El sistema permite reabrir la comanda de la mesa ocupada, agregar nuevos ítems y enviarlos a la cocina, consolidando los importes en la cuenta existente sin duplicar el ID del pedido original ni crear nuevas cuentas.
* **Combos y Mitades Dinámicas:** Soporte nativo para reglas complejas de productos, tales como "Menú Ejecutivo" (selección obligatoria de 1 entrada, 1 fondo y 1 bebida por un precio fijo) o "Pizzas Mitad y Mitad" 

---

## Flujo B: Operación de Cocina (KDS en Tiempo Real)

### 1. Flujo Base (Happy Path)
1. **Recepción síncrona:** Gracias a una conexión persistente mediante **WebSockets**, la pantalla del sistema de visualización de cocina (**Kitchen Display System - KDS**) recibe el ticket del pedido de forma inmediata tras el evento `pedido.creado`, sin necesidad de recargar la interfaz web.
2. **Inicio de Preparación:** El Chef u operador de la estación visualiza el ticket detallado con sus respectivos modificadores y presiona el botón "Empezar". El estado del pedido (o de ítems específicos) transiciona a `EN_PREPARACION`.
3. **Notificación al Mesero:** Este cambio de estado dispara el evento `pedido.actualizado`. El WebSocket del servidor retransmite el cambio a la tablet o smartphone del mesero asignado, alterando el indicador visual del plato (ej. cambia a color Naranja/Progreso) para que sepa el estatus real de la mesa.
4. **Despacho / Listo:** Una vez finalizada la cocción, el Chef marca los platos como "Listos". Cuando todos los componentes del pedido completan esta fase, el estado general muta a `LISTO_PARA_RECOGER` (`LISTO`), emitiendo una alerta Push sonora y visual en la terminal del mesero.

### 2. Casos Límite y Mejoras Operativas
* **Ruteo por Estaciones (Cocina Descentralizada):** Un restaurante mediano o grande posee múltiples centros de producción. El `servicio-pedidos` evalúa las categorías de los ítems del evento `pedido.creado` y los desglosa: los cócteles y cafés se envían al KDS de la **Barra**; los platos fríos al KDS de **Sushibar/Entradas**; y las carnes al KDS de **Parrilla/Calientes**. Un solo pedido puede dividirse en 3 pantallas de forma simultánea.

---

## Flujo C: Gestión del Mapa de Mesas

### 1. Flujo Base (Happy Path)
1. **Lectura de Estado:** El panel gráfico del plano del restaurante (Layout de Mesas) se alimenta en tiempo real del estado de ocupación registrado en la base de datos centralizada.
2. **Transiciones Automáticas:** Las mesas mutan su color dinámicamente:
   * `LIBRE` (Verde) -> Transiciona por evento al confirmarse una comanda.
   * `OCUPADA` (Rojo) -> Estado actual durante el consumo de los clientes.
3. **Liberación de Emergencia:** Se incluye un botón con privilegios de administrador para forzar la liberación manual de la mesa (`FORZAR_LIBRE`). Esto resuelve problemas operativos cotidianos (ej. cuando se abre un pedido en una mesa equivocada por error humano).

### 2. Casos Límite y Mejoras Operativas
* **Fusión y Unión de Mesas:** En eventos o grupos grandes, los clientes solicitan juntar físicamente infraestructura (ej. unir Mesa 5 y Mesa 6). El software debe permitir la "fusión de mesas" en la interfaz. Técnicamente, las entidades físicas mantienen su ID, pero sus punteros de cuenta se unifican hacia un único `cuenta_id` activo.
* **Cambio de Mesa:** Si los clientes consumen entradas en la **Barra** y luego se desocupan espacios en la **Terraza**, el mesero debe arrastrar y soltar la cuenta de la mesa origen a la mesa destino en el mapa conceptual. El `servicio-cuentas` transfiere el historial de pedidos y modificadores sin cerrar el flujo fiscal ni alterar la preparación en cocina.

---

## Flujo D: Caja, Pagos Mixtos y Facturación Electrónica

### 1. Flujo Base (Happy Path)
1. **Petición de Cierre:** El cliente solicita la cuenta. El cajero o el mesero digita el número de mesa en el módulo de **Caja** y el sistema recupera instantáneamente el saldo total acumulado de la cuenta abierta.
2. **Procesamiento de Pagos Mixtos:** El sistema permite fraccionar el importe total utilizando diferentes pasarelas y métodos de pago de forma simultánea. Por ejemplo, en una cuenta de S/ 100:
   * S/ 50.00 liquidados en Efectivo.
   * S/ 30.00 transferidos por billetera digital (Yape/Plin).
   * S/ 20.00 procesados vía Tarjeta de Crédito/Débito.
3. **Registro Contable:** El `servicio-caja` procesa cada transacción de manera atómica. Al completarse con éxito, publica el evento `pago.registrado`.
4. **Cierre Automático:** El `servicio-pedidos` actúa como escucha (*listener*) de este evento, descuenta los montos del saldo adeudado y, al verificar que el balance pendiente llega a exactamente cero (`0.00`), cambia el estado del pedido a `PAGADO`, archiva la cuenta y **libera la mesa automáticamente**.

### 2. Casos Límite y Mejoras Operativas
* **Cuentas Divididas por Ítems o Personas:** En lugar de pagar el total con múltiples métodos, un grupo de comensales puede solicitar pagar exclusivamente lo que cada uno consumió ("Cuentas Separadas"). El cajero debe poder seleccionar ítems específicos de la pantalla (ej. "Yo pago el Ceviche y la Cerveza") y cargarlos a un sub-comprobante independiente. El software descuenta estos ítems de la cuenta principal de la mesa y no permite su liberación hasta que todos los elementos huérfanos de pago sean saldados.
* **Descuentos, Cortesías y Autorizaciones:** Aplicación de incentivos comerciales o solución de quejas (ej. Descuento del 15% por convenio corporativo o Postre de cortesía a valor S/ 0.00). Estas excepciones modifican la base imponible y el total de la cuenta, por lo que requieren de un token de seguridad o ingreso de código PIN de un Supervisor/Administrador registrado, guardando una traza de auditoría de quién aprobó la rebaja.
* **Integración con Facturación Electrónica (SUNAT / Entes Fiscales):** Al momento de presionar "Cerrar Cuenta", el sistema solicita los datos de identidad fiscal del cliente (DNI para Boletas, RUC para Facturas). Al llegar el saldo a cero, el `servicio-caja` no solo archiva el flujo de operaciones, sino que gatilla el evento `comprobante.generar`. El microservicio fiscal construye el archivo XML estructurado, calcula los impuestos correspondientes (IGV 18%, Recargo al Consumo), firma digitalmente el documento y lo transmite al Proveedor de Servicios Electrónicos (PSE) o directamente al ente tributario, imprimiendo el comprobante físico con su respectivo código QR de validación.

---

## Nuevos Módulos Esenciales (Flujos Faltantes)

Para lograr un sistema POS robusto y preparado para operaciones reales y auditorías, se añaden los siguientes tres flujos troncales:

### Flujo E: Cierre y Arqueo de Caja (Control de Efectivo)
El manejo de dinero físico expone al negocio a pérdidas si no cuenta con auditorías estructuradas por turnos.
1. **Apertura de Turno:** El cajero inicia el día registrando de manera obligatoria un **Fondo de Caja / Saldo Inicial** (dinero en efectivo destinado exclusivamente a dar vuelto/cambio a los primeros clientes, ej. S/ 100.00). El estado de la caja pasa a `ABIERTA`.
2. **Registro de Movimientos de Caja Chica (Egresos/Ingresos):** Durante la jornada, se presentan flujos no relacionados con las ventas directas de mesas. Por ejemplo: una salida de S/ 30.00 en efectivo autorizada para comprar insumos de emergencia (Hielo) o el pago en efectivo a un proveedor local. Cada movimiento debe ser tipificado y restado del flujo de efectivo neto.
3. **Pre-Cierre (X-Report):** El administrador genera un reporte de lectura parcial a ciegas. El sistema solicita al cajero realizar el conteo físico de los billetes y monedas en su gaveta sin mostrarle las cifras del software.
4. **Cierre de Caja (Z-Report):** El cajero ingresa el dinero físico contado. El `servicio-caja` ejecuta el balance de reconciliación algorítmica:
   $$\text{Efectivo Esperado} = \text{Fondo Inicial} + \text{Ventas en Efectivo} - \text{Egresos de Caja Chica}$$
5. **Auditoría de Discrepancias:** El sistema emite el reporte consolidado de fin de turno. Si la cantidad física difiere de la esperada, se archiva el turno en estado `DESCUADRADO` registrando el monto exacto del faltante o sobrante, y se bloquea el POS para nuevas transacciones hasta el siguiente turno.





---

## Glosario de Eventos del Ecosistema POS

Para una comprensión técnica transparente de la arquitectura orientada a eventos (EDA) propuesta, a continuación se detallan los payloads de eventos clave que fluyen por el bus de datos:

| Nombre del Evento | Servicio Emisor | Servicios Consumidores | Propósito Técnico / Operativo |
| :--- | :--- | :--- | :--- |
| `pedido.creado` | `servicio-pedidos` | `servicio-cocina-kds`, `servicio-cuentas` | Alerta la llegada de una nueva orden para proyectarla en las pantallas de cocina y abre el estado de cuenta. |
| `pedido.actualizado` | `servicio-pedidos` | `servicio-notificaciones-mesero` | Informa mediante WebSockets cambios en el estado de la comida (`EN_PREPARACION`, `LISTO`) hacia las pantallas móviles. |
| `pedido.item_anulado` | `servicio-pedidos` | `servicio-cocina-kds`, `servicio-inventario` | Remueve un ítem del ticket del KDS con alta prioridad visual y reversa el bloqueo de stock preventivo. |
| `pago.registrado` | `servicio-caja` | `servicio-pedidos`, `servicio-cuentas`, `servicio-fiscal` | Informa la recepción exitosa de un monto económico parcial o total para balancear los saldos adeudados. |
| `comprobante.generar`| `servicio-caja` | `servicio-fiscal` | Dispara el proceso de estructuración del XML tributario, firma digital y envío al ente regulador de impuestos (SUNAT). |
| `mesa.estado_cambiado`| `servicio-pedidos` | `servicio-mapa-mesas` | Sincroniza visualmente la paleta cromática del plano del restaurante (`LIBRE`, `OCUPADA`). |
