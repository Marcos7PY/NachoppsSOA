# Reporte de Código: Microservicio `servicio-identidad`

Este documento detalla la estructura y componentes principales del microservicio `servicio-identidad`, basándose en una inspección exhaustiva de sus controladores, servicios y esquemas de base de datos.

## 1. Controladores

El controlador principal para la gestión de autenticación y usuarios se encuentra en `apps/servicio-identidad/src/auth/auth.controller.ts`.

> **Nota sobre validación:** Los DTOs de entrada utilizados en este controlador (`LoginCommand`, `CrearUsuarioCommand`, `CambiarRolCommand`) se importan desde la librería compartida `@org/contracts` (`libs/contracts/src/domains/identidad.ts`). Estos objetos están definidos como **clases** e implementan decoradores de `class-validator`. El servicio cuenta con un `ValidationPipe` global.

### Endpoint: Login
- **Ruta y Método:** `@Post('auth/login')` (`apps/servicio-identidad/src/auth/auth.controller.ts:27`)
- **DTO de entrada:** `LoginCommand` importado desde `@org/contracts`.
  - `email`: `string` (requerido)
  - `password`: `string` (requerido)
- **Forma de la respuesta:** `LoginResponseDto`
  - `access_token`: `string`
  - `usuario`: Objeto con `id` (`string`), `nombre` (`string`), `email` (`string`), `rol` (`RolUsuario`).
- **Códigos HTTP de estado:** 
  - `201 Created` (Por defecto para `@Post` en NestJS)
  - `401 Unauthorized` (En caso de credenciales inválidas o usuario inactivo)
- **Guards/Decoradores:** Ninguno.

### Endpoint: Validar Token
- **Ruta y Método:** `@Post('auth/validate')` (`apps/servicio-identidad/src/auth/auth.controller.ts:32`)
- **DTO de entrada:** Objeto tipado en línea `{ token: string }`.
  - `token`: `string` (requerido)
- **Forma de la respuesta:** `{ valid: boolean, payload: any }`
- **Códigos HTTP de estado:**
  - `201 Created` (Por defecto)
  - `401 Unauthorized` (Token inválido o expirado)
- **Guards/Decoradores:** Ninguno.

### Endpoint: Perfil del Usuario
- **Ruta y Método:** `@Get('auth/me')` (`apps/servicio-identidad/src/auth/auth.controller.ts:40`)
- **DTO de entrada:** Ninguno. Utiliza el decorador `@Request()` para obtener `req.user.sub`.
- **Forma de la respuesta:** `UsuarioDto` (`id`, `nombre`, `email`, `rol`, `activo`, `createdAt`).
- **Códigos HTTP de estado:**
  - `200 OK` (Por defecto)
  - `401 Unauthorized` (Por el Guard)
  - `404 Not Found` (Si el usuario no existe)
- **Guards/Decoradores:** `@UseGuards(JwtAuthGuard)` (`apps/servicio-identidad/src/auth/auth.controller.ts:39`)

### Endpoint: Crear Usuario
- **Ruta y Método:** `@Post('usuarios')` (`apps/servicio-identidad/src/auth/auth.controller.ts:49`)
- **DTO de entrada:** `CrearUsuarioCommand` importado desde `@org/contracts`.
  - `nombre`: `string` (requerido)
  - `email`: `string` (requerido)
  - `password`: `string` (requerido)
  - `rol`: `RolUsuario` (requerido)
- **Forma de la respuesta:** `UsuarioDto`
- **Códigos HTTP de estado:**
  - `201 Created`
  - `401 Unauthorized` (Falta de token)
  - `403 Forbidden` (Si no tiene rol `ADMIN`)
  - `409 Conflict` (Si el email ya está en uso)
- **Guards/Decoradores:** 
  - `@UseGuards(JwtAuthGuard, RolesGuard)` (`apps/servicio-identidad/src/auth/auth.controller.ts:47`)
  - `@Roles('ADMIN')` (`apps/servicio-identidad/src/auth/auth.controller.ts:48`)

### Endpoint: Listar Usuarios
- **Ruta y Método:** `@Get('usuarios')` (`apps/servicio-identidad/src/auth/auth.controller.ts:56`)
- **DTO de entrada:** Ninguno.
- **Forma de la respuesta:** Arreglo de `UsuarioDto` (`UsuarioDto[]`).
- **Códigos HTTP de estado:**
  - `200 OK`
  - `401 Unauthorized`
  - `403 Forbidden`
- **Guards/Decoradores:** 
  - `@UseGuards(JwtAuthGuard, RolesGuard)` (`apps/servicio-identidad/src/auth/auth.controller.ts:54`)
  - `@Roles('ADMIN')` (`apps/servicio-identidad/src/auth/auth.controller.ts:55`)

### Endpoint: Cambiar Rol
- **Ruta y Método:** `@Patch('usuarios/:id/rol')` (`apps/servicio-identidad/src/auth/auth.controller.ts:63`)
- **DTO de entrada:** 
  - Parámetro de ruta (`@Param('id')`): `id` (`string`, requerido)
  - Body (`CambiarRolCommand`): `rol` (`RolUsuario`, requerido)
- **Forma de la respuesta:** `UsuarioDto` con la información actualizada.
- **Códigos HTTP de estado:**
  - `200 OK`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found` (Si el usuario no existe)
- **Guards/Decoradores:**
  - `@UseGuards(JwtAuthGuard, RolesGuard)` (`apps/servicio-identidad/src/auth/auth.controller.ts:61`)
  - `@Roles('ADMIN')` (`apps/servicio-identidad/src/auth/auth.controller.ts:62`)

---

## 2. Servicios (Clases)

La lógica de negocio reside en `apps/servicio-identidad/src/auth/auth.service.ts`.

### Inyección de Dependencias
El constructor (`apps/servicio-identidad/src/auth/auth.service.ts:29`) inyecta los siguientes proveedores:
1. `prisma: PrismaService` (Acceso a base de datos)
2. `jwt: JwtService` (Gestión de JSON Web Tokens)
3. `publisher: RabbitMQPublisherService` (Emisión de eventos asíncronos por RabbitMQ)

### Métodos

#### `login`
- **Firma:** `async login(command: LoginCommand): Promise<LoginResponseDto>` (`apps/servicio-identidad/src/auth/auth.service.ts:37`)
- **Paso a paso:**
  1. Busca un usuario por `email`.
  2. Verifica que el usuario exista y esté activo; si no, lanza `UnauthorizedException`.
  3. Compara la contraseña encriptada usando `bcrypt.compare`; si es inválida, lanza `UnauthorizedException`.
  4. Prepara el payload del token (`sub`, `email`, `rol`) y lo firma mediante `this.jwt.sign()`.
  5. Llama a `this.registrarAuditoria()` para registrar el evento de ingreso.
  6. Emite un evento en RabbitMQ (`UsuarioAutenticado`) con `RoutingKeys.UsuarioAutenticado`.
  7. Retorna el objeto `LoginResponseDto` que incluye el token y los datos del usuario.

#### `validarToken`
- **Firma:** `async validarToken(token: string)` (`apps/servicio-identidad/src/auth/auth.service.ts:89`)
- **Paso a paso:**
  1. Ejecuta `this.jwt.verify(token)` en un bloque `try`.
  2. Si tiene éxito, retorna `{ valid: true, payload }`.
  3. Si falla (por estar expirado o modificado), captura el error y lanza `UnauthorizedException`.

#### `obtenerPerfil`
- **Firma:** `async obtenerPerfil(usuarioId: string)` (`apps/servicio-identidad/src/auth/auth.service.ts:100`)
- **Paso a paso:**
  1. Ejecuta una búsqueda `findUnique` en la base de datos por `id`.
  2. Si el usuario no existe, lanza `NotFoundException`.
  3. Si existe, lo formatea mediante `toUsuarioDto` y retorna el resultado.

#### `crearUsuario`
- **Firma:** `async crearUsuario(command: CrearUsuarioCommand)` (`apps/servicio-identidad/src/auth/auth.service.ts:114`)
- **Paso a paso:**
  1. Comprueba si el email ya existe; de ser así, lanza `ConflictException`.
  2. Hashea la contraseña proporcionada usando `bcrypt.hash()` con 10 iteraciones de salt.
  3. Inserta el nuevo usuario en la base de datos con los datos encriptados.
  4. Llama a `this.registrarAuditoria()` para el evento `CREAR_USUARIO`.
  5. Formatea y retorna el resultado con `toUsuarioDto`.

#### `listarUsuarios`
- **Firma:** `async listarUsuarios()` (`apps/servicio-identidad/src/auth/auth.service.ts:140`)
- **Paso a paso:**
  1. Consulta a base de datos por todos los usuarios ordenados de forma descendente por `createdAt`.
  2. Retorna el listado de usuarios tras pasarlos por `toUsuarioDto`.

#### `cambiarRol`
- **Firma:** `async cambiarRol(id: string, command: CambiarRolCommand)` (`apps/servicio-identidad/src/auth/auth.service.ts:147`)
- **Paso a paso:**
  1. Verifica si el usuario existe usando `findUnique`; si no, lanza `NotFoundException`.
  2. Realiza un `update` en el registro del usuario con el nuevo `rol`.
  3. Llama a `this.registrarAuditoria()` bajo el título `CAMBIAR_ROL:<nuevo_rol>`.
  4. Formatea y retorna el usuario actualizado con `toUsuarioDto`.

#### `registrarAuditoria`
- **Firma:** `async registrarAuditoria(accion: string, usuarioId: string, servicio: string, ip?: string)` (`apps/servicio-identidad/src/auth/auth.service.ts:166`)
- **Paso a paso:**
  1. Crea directamente un nuevo registro en el modelo `auditoriaLog` pasándole el objeto `data` construido a base de los argumentos. No devuelve respuesta.

---

## 3. Prisma Schema

El modelo de base de datos se encuentra definido en `apps/servicio-identidad/prisma/schema.prisma`. No se definen nombres reales de tablas personalizados a través de `@@map` y el único índice explícito es un atributo `@unique`.

### Modelo: `Usuario`
(`apps/servicio-identidad/prisma/schema.prisma:10`)
- `id` (`String`): Clave primaria (`@id`), valor por defecto de UUID generado automáticamente (`@default(uuid())`).
- `nombre` (`String`): Campo requerido.
- `email` (`String`): Campo requerido con unicidad asegurada a nivel base de datos (`@unique`).
- `password` (`String`): Campo requerido para contraseña hasheada.
- `rol` (`String`): Campo requerido, toma como valor por defecto la cadena `"MESERO"` (`@default("MESERO")`).
- `activo` (`Boolean`): Indicador lógico con valor por defecto `true` (`@default(true)`).
- `createdAt` (`DateTime`): Fecha de creación autogenerada (`@default(now())`).
- `updatedAt` (`DateTime`): Fecha de actualización controlada automáticamente por Prisma (`@updatedAt`).

### Modelo: `AuditoriaLog`
(`apps/servicio-identidad/prisma/schema.prisma:21`)
- `id` (`String`): Clave primaria (`@id`), valor por defecto generado automáticamente (`@default(uuid())`).
- `accion` (`String`): Campo requerido para describir el evento de auditoría.
- `usuarioId` (`String`): Campo requerido, referenciando el ID del usuario involucrado.
- `servicio` (`String`): Campo requerido, identifica el origen de la operación.
- `ip` (`String?`): Campo opcional con la dirección IP de origen de la transacción.
- `createdAt` (`DateTime`): Fecha de creación autogenerada del registro log (`@default(now())`).


## Observaciones Adicionales

### Arquitectura de Datos (Prisma Local)
Es importante destacar que el PrismaService utilizado en este microservicio se genera y opera localmente dentro de este proyecto, respetando el patrón Database-per-Service. La librería global shared-prisma no es utilizada.
