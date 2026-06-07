# Planeamiento de Integración y Manejo de Respuestas de Servicios (NachoppsSOA)

Este documento define el plan de trabajo para la integración, consumo y demostración del manejo de estados HTTP y errores, basado específicamente en la arquitectura y los servicios del proyecto **NachoppsSOA**.

## 1. Construcción de los Servicios Principales (Backend)

El sistema **NachoppsSOA** está compuesto por múltiples microservicios (monorepo gestionado con Nx y backends en NestJS). Los servicios *core* existentes en el workspace son:

*   **`servicio-pedidos`**: Gestión central del ciclo de vida de los pedidos.
*   **`servicio-inventario`**: Control de stock e insumos.
*   **`servicio-mesas`**: Gestión de salones y estado de las mesas.
*   **`servicio-caja`**: Cobros, pagos y aperturas/cierres de caja.
*   **`servicio-cuentas`**: Manejo de deudas y tickets de clientes.
*   **`servicio-identidad`**: Autenticación y autorización (usuarios).
*   **`servicio-reportes`**: Generación de estadísticas.
*   **`servicio-reservas`**: Gestión de reservas.
*   **`servicio-notificaciones`**: Envío de alertas.

## 2. Consumo de los Servicios Asociados (Frontend)

El cliente principal, **`pwa-cliente`**, deberá consumir estos servicios mediante llamadas HTTP. Se debe implementar un **Interceptor Global** en el cliente para:
*   Inyectar el Token JWT de `servicio-identidad`.
*   Capturar los códigos de error globales e invocar notificaciones en la UI (ej. Toasts o Modales) para los casos de fallos técnicos o errores de negocio que se describen a continuación.

---

## 3. Tabla Clave: Códigos HTTP Importantes y Manejo de Errores

Para estandarizar las respuestas entre el Frontend (`pwa-cliente`) y los Microservicios, se define la siguiente tabla con los escenarios solicitados:

| Error / Escenario | Código HTTP | Descripción en el contexto de NachoppsSOA | Acción a Tomar (Frontend / Backend) |
| :--- | :--- | :--- | :--- |
| **404** | `404 Not Found` | El recurso solicitado por ID no existe (ej. consultar un pedido o `mesaId` inexistente). | **Acción:** El backend devuelve un error de entidad no encontrada. El frontend debe mostrar una pantalla de "Elemento no encontrado" o redirigir al listado principal. |
| **500** | `500 Internal Server Error` | Fallo no controlado en un microservicio (ej. falla en la DB Prisma o una excepción no manejada). | **Acción:** El backend registra el stacktrace en los logs. El frontend muestra un mensaje genérico tipo "Ocurrió un error inesperado, intente más tarde". |
| **Timeout** | `408 Request Timeout` / `504 Gateway Timeout` | Un servicio (ej. `servicio-pedidos`) tardó demasiado en responder, posiblemente por esperar a RabbitMQ u otro servicio en cadena. | **Acción:** El frontend debe abortar la espera y notificar al usuario. Se puede ofrecer un botón de reintento manual o reintentos automáticos. |
| **Payload inválido** | `400 Bad Request` | Contrato inconsistente. El cliente envió datos incompletos que fallan las validaciones de `class-validator` en NestJS. | **Acción:** El backend rechaza la petición listando los campos inválidos. El frontend muestra mensajes de error en el formulario a corregir. |
| **Servicio caído** | `503 Service Unavailable` / `502 Bad Gateway` | Un microservicio requerido está inactivo o en proceso de reinicio. | **Acción:** El API Gateway avisa de la caída. El frontend debe mostrar una pantalla de "Servicio no disponible temporalmente". |

---

## 4. Casos de Demostración y Pruebas (Basado en `servicio-pedidos`)

Para demostrar los distintos escenarios en este proyecto, utilizaremos el endpoint real de creación de pedidos presente en `servicio-pedidos`:
**Endpoint:** `POST /api/pedidos` o raíz (`POST /`) 
**Contrato (DTO):** `CrearPedidoCommand` del paquete `@org/contracts`

### 4.1. Demostrar: Respuesta Exitosa
Ocurre cuando `pwa-cliente` envía el comando correctamente y el Controller procesa el pedido en la BD.

*   **Código HTTP Esperado:** `201 Created`
*   **Request Payload (`CrearPedidoCommand`):**
    ```json
    {
      "mesaId": "mesa-01",
      "items": [
        { "productoId": "prod-123", "cantidad": 2, "precio": 1500 }
      ],
      "cliente": "Juan Pérez",
      "modalidad": "Local"
    }
    ```
*   **Response Payload (PedidoCreadoPayload / Entidad Pedido):**
    ```json
    {
      "id": "pedido-999",
      "mesaId": "mesa-01",
      "estado": "CREADO",
      "items": [ ... ]
    }
    ```

### 4.2. Demostrar: Error de Negocio
Ocurre cuando la petición es estructuralmente correcta, pero viola una regla de negocio de **NachoppsSOA** (ej. la mesa seleccionada está inhabilitada o no hay stock en `servicio-inventario`).

*   **Código HTTP Esperado:** `422 Unprocessable Entity` (o `409 Conflict`)
*   **Request Payload:** (Idéntico al exitoso, pero el `mesaId` corresponde a una mesa ocupada o en reparación)
*   **Response Payload:**
    ```json
    {
      "statusCode": 422,
      "error": "MESA_NO_DISPONIBLE",
      "message": "La mesa 'mesa-01' no está disponible para recibir nuevos pedidos."
    }
    ```

### 4.3. Demostrar: Contrato Inconsistente (Payload inválido)
Ocurre cuando `pwa-cliente` envía el `CrearPedidoCommand` sin el `mesaId` requerido, o con el arreglo de `items` vacío. NestJS con `ValidationPipe` (class-validator) interceptará este error antes de llegar al Service.

*   **Código HTTP Esperado:** `400 Bad Request`
*   **Request Payload:** *(Falta 'mesaId' y los items no se envían)*
    ```json
    {
      "cliente": "Juan Pérez",
      "modalidad": "Delivery"
    }
    ```
*   **Response Payload:**
    ```json
    {
      "statusCode": 400,
      "message": [
        "mesaId must be a string",
        "mesaId should not be empty",
        "items must contain at least 1 elements",
        "items must be an array"
      ],
      "error": "Bad Request"
    }
    ```

### 4.4. Demostrar: Error Técnico (500 o Timeout)
Ocurre si, por ejemplo, falla la conexión a la base de datos de Prisma dentro del `app.service.ts` del `servicio-pedidos`.

*   **Código HTTP Esperado:** `500 Internal Server Error`
*   **Request Payload:** (Mismo payload que el caso exitoso)
*   **Response Payload:**
    ```json
    {
      "statusCode": 500,
      "message": "Internal server error"
    }
    ```
    > **Nota:** El *Global Exception Filter* de NestJS interceptará el error de Prisma u otro fallo de Node.js, devolviendo un 500 genérico al cliente (PWA) para no exponer detalles de seguridad, mientras deja el Stacktrace completo en los logs locales de Nx.
