# DT-10 — Migración de Webpack a TSC en los microservicios NestJS

> **Tipo:** Deuda técnica arquitectural
> **Ámbito:** Los 9 microservicios backend (`apps/servicio-*`)
> **Estado:** ✅ Completada (9/9 servicios migrados a tsc, último webpack residual eliminado)
> **Riesgo:** Medio-bajo (controlable con migración incremental)
> **Autor del análisis:** Sesión de diagnóstico — 24 Mayo 2026

---

## 1. Resumen ejecutivo

Los 9 microservicios NestJS del monorepo usan **Webpack** como compilador de backend (`@nx/webpack:webpack`). Webpack está diseñado para empaquetar aplicaciones de **frontend** (navegador), no aplicaciones de **backend** Node.js.

El síntoma concreto: al bundlear el código, Webpack transpila las clases ES6 de Prisma 7.8 y **rompe la cadena de herencia de clases**, produciendo el error en tiempo de ejecución:

```
ReferenceError: Must call super constructor in derived class
before accessing 'this' or returning from derived constructor
```

La solución correcta y estándar es migrar el compilador de Webpack a **TSC** (`@nx/js:tsc`), que simplemente transpila TypeScript a JavaScript sin empaquetar nada. Node.js entiende módulos de forma nativa y no necesita un bundle.

### Por qué este es el enfoque correcto

| | Webpack (actual) | TSC (objetivo) |
|---|---|---|
| Propósito | Bundling de frontend | Transpilación de backend |
| Clases ES6 de Prisma | Se rompen al transpilar | Se respetan |
| Output | 1 archivo `main.js` gigante (~200k líneas) | Múltiples `.js` modulares |
| Velocidad de build | Lenta | Rápida |
| Dockerfile | Complejo y frágil | Simple y reproducible |
| Estándar NestJS + NX | No recomendado | Recomendado |

---

## 2. Contexto del proyecto

- **Monorepo:** NX — `BackActual/`
- **Servicios afectados (9):** `servicio-identidad`, `servicio-mesas`, `servicio-pedidos`, `servicio-cuentas`, `servicio-reservas`, `servicio-inventario`, `servicio-notificaciones`, `servicio-caja`, `servicio-reportes`
- **No afectados:** `pwa-cliente` (frontend React — Vite, correcto), las librerías de `libs/`, la infraestructura.
- **Stack relevante:** NestJS 11 · Prisma 7 · PostgreSQL 16 × 9 · `@prisma/adapter-pg`
- **Path aliases del proyecto:** `@org/contracts`, `@org/shared-rabbitmq`, `@org/shared-auth`, `@org/observabilidad`, `@org/resiliencia`

> ⚠️ **Nota sobre el hallazgo paralelo:** Durante el diagnóstico se descubrió que el paso `RUN npx prisma generate` dentro del Dockerfile también causaba inconsistencias, porque regeneraba el cliente Prisma para el SO del contenedor (Alpine), distinto al commiteado. La migración a TSC resuelve esto de raíz: con TSC ya no es problemático, pero la guía mantiene el cliente generado **commiteado en el source** como práctica recomendada.

---

## 3. Pre-vuelo — Verificaciones obligatorias antes de empezar

No tocar ningún archivo hasta completar este checklist.

### 3.1 Verificar los path aliases en `tsconfig.base.json`

Abrir `tsconfig.base.json` en la raíz y confirmar que la sección `paths` contiene **todas** las librerías. Webpack resolvía estos aliases automáticamente; TSC los necesita declarados explícitamente.

```jsonc
// tsconfig.base.json — sección esperada
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@org/contracts": ["libs/contracts/src/index.ts"],
      "@org/shared-rabbitmq": ["libs/shared-rabbitmq/src/index.ts"],
      "@org/shared-auth": ["libs/shared-auth/src/index.ts"],
      "@org/observabilidad": ["libs/observabilidad/src/index.ts"],
      "@org/resiliencia": ["libs/resiliencia/src/index.ts"]
    }
  }
}
```

- ✅ Si están todos → continuar.
- ❌ Si falta alguno → agregarlo antes de seguir. Los nombres exactos deben coincidir con los `import` que se usan en el código.

### 3.2 Crear una rama de trabajo

```bash
git checkout -b dt10/migracion-webpack-a-tsc
```

### 3.3 Confirmar estado de partida limpio

```bash
npx nx run-many -t build --configuration=production   # Estado actual
npx vitest run                                        # 45/45 deben pasar
```

Anotar el resultado. Es la línea base contra la que se compara después de cada migración.

### 3.4 Verificar que el cliente Prisma está commiteado

Para cada servicio debe existir la carpeta generada **commiteada** en git:

```bash
git ls-files | grep "generated/prisma"
```

Debe listar archivos de `apps/servicio-*/src/generated/prisma/`. Si NO aparecen (están en `.gitignore`), generarlos y commitearlos:

```bash
# Para cada servicio
cd apps/servicio-identidad
npx prisma generate
cd ../..
git add apps/servicio-identidad/src/generated -f
```

---

## 4. Instalar la dependencia necesaria

```bash
npm install --save-dev @nx/js
```

---

## 5. Estrategia: migración incremental (NO migrar los 9 a la vez)

Se migra **un servicio a la vez**, validando cada uno antes de pasar al siguiente. Cada servicio migrado es un commit independiente: si algo falla, se revierte solo ese servicio.

### Orden recomendado

| Fase | Servicio | Por qué este orden |
|---|---|---|
| 1 | `servicio-identidad` | Ya está roto — no hay nada que perder, es el caso de prueba |
| 2 | `servicio-mesas` | Ya funciona con webpack — valida que TSC no rompe lo que funciona |
| 3 | `servicio-notificaciones` | Tiene WebSocket + RabbitMQ — caso con más superficie |
| 4 | `servicio-pedidos` | Servicio central (Saga) — migrar con cuidado y tests |
| 5 | `servicio-inventario` | Lógica estándar |
| 6 | `servicio-cuentas` | Lógica estándar |
| 7 | `servicio-reservas` | Lógica estándar |
| 8 | `servicio-caja` | Lógica estándar |
| 9 | `servicio-reportes` | Solo consume eventos — el más simple |

---

## 6. Procedimiento por servicio

Repetir esta sección **una vez por cada servicio**, sustituyendo `servicio-identidad` por el servicio en turno.

### Paso 6.1 — Editar `project.json`

Archivo: `apps/servicio-identidad/project.json`

Reemplazar el target `build` (y `serve` si existe) por:

```json
{
  "name": "servicio-identidad",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/servicio-identidad/src",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@nx/js:tsc",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/apps/servicio-identidad",
        "main": "apps/servicio-identidad/src/main.ts",
        "tsConfig": "apps/servicio-identidad/tsconfig.app.json",
        "assets": [
          {
            "glob": "**/*",
            "input": "apps/servicio-identidad/src/assets",
            "output": "assets"
          }
        ]
      },
      "configurations": {
        "production": {
          "optimization": true,
          "sourceMap": false
        }
      }
    },
    "serve": {
      "executor": "@nx/js:node",
      "options": {
        "buildTarget": "servicio-identidad:build"
      }
    }
  }
}
```

> Mantener intactos los demás targets que tenga el `project.json` (lint, test, etc.). Solo se reemplazan `build` y `serve`.
> Si el servicio no tiene carpeta `src/assets`, el bloque `assets` no causa problema (NX lo ignora si la carpeta no existe), pero puede eliminarse para mayor limpieza.

### Paso 6.2 — Editar `tsconfig.app.json`

Archivo: `apps/servicio-identidad/tsconfig.app.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "ES2021",
    "outDir": "../../dist/apps/servicio-identidad",
    "declaration": false,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": true,
    "lib": ["ES2021"],
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
}
```

> 🔴 **Crítico:** `emitDecoratorMetadata` y `experimentalDecorators` deben estar en `true`. NestJS depende de ellos para la inyección de dependencias. Si faltan, los `@Injectable()` y `@Controller()` dejan de funcionar.

### Paso 6.3 — Eliminar `webpack.config.js`

```bash
rm apps/servicio-identidad/webpack.config.js
```

### Paso 6.4 — Restaurar el `PrismaService` con el adaptador

Archivo: `apps/servicio-identidad/src/prisma/prisma.service.ts`

Con TSC el adaptador `PrismaPg` ya no se rompe, así que se restaura la versión completa y correcta:

```typescript
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly pool: Pool;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });

    this.pool = pool;
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Prisma conectado');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('Prisma desconectado');
  }

  /**
   * Idempotencia (DT-02): registra una clave. Devuelve true si es nueva,
   * false si ya existía (evento duplicado).
   */
  async checkAndRecordIdempotencyKey(key: string): Promise<boolean> {
    try {
      await (this as any).idempotencyKey.create({ data: { key } });
      return true;
    } catch {
      return false;
    }
  }
}
```

> Adaptar este archivo al `PrismaService` real de cada servicio: algunos no tienen `checkAndRecordIdempotencyKey` (ej. `servicio-reservas`, que no usa idempotencia según ESTADO.md). Conservar los métodos propios de cada servicio; solo cambia el patrón del constructor y el ciclo de vida.

### Paso 6.5 — Build local de validación

```bash
npx nx build servicio-identidad --configuration=production
```

- ✅ Build sin errores → continuar.
- ❌ Errores de imports `@org/...` → revisar paso 3.1 (path aliases).
- ❌ Errores de decoradores → revisar paso 6.2 (`emitDecoratorMetadata`).

Verificar que el output es modular (varios `.js`), no un único bundle:

```bash
ls dist/apps/servicio-identidad
```

### Paso 6.6 — Correr los tests del servicio

```bash
npx vitest run
```

Deben seguir pasando los mismos tests que en la línea base del paso 3.3.

### Paso 6.7 — Probar en Docker (solo este servicio)

```bash
docker compose -f infra/docker-compose.yml --env-file .env build --no-cache servicio-identidad
docker compose -f infra/docker-compose.yml --env-file .env --profile dev up -d servicio-identidad
```

Esperar ~15 s y probar el endpoint principal del servicio. Para `servicio-identidad`:

```bash
curl -X POST http://localhost:8000/identidad/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@nachopps.com\",\"password\":\"admin123\"}"
```

Resultado esperado: respuesta `200` con token JWT (no `500`, no `502`).

Para los demás servicios, probar su endpoint de salud o uno representativo:

```bash
docker compose -f infra/docker-compose.yml --env-file .env logs --tail 30 servicio-identidad
```

Los logs deben mostrar el arranque limpio de NestJS y `Prisma conectado`.

### Paso 6.8 — Commit del servicio migrado

```bash
git add apps/servicio-identidad
git commit -m "refactor(servicio-identidad): migrar compilador de webpack a tsc (DT-10)"
```

> Si algo falla y no se resuelve rápido: `git checkout apps/servicio-identidad` revierte solo ese servicio sin afectar al resto.

**Repetir los pasos 6.1 a 6.8 para el siguiente servicio del orden de la sección 5.**

---

## 7. Protocolo de validación granular — no avanzar con fallos

> **Principio rector:** Un servicio NO se considera migrado hasta que pasa **todas** las compuertas de validación de esta sección. No se inicia la migración del siguiente servicio mientras el actual tenga aunque sea un solo fallo. No se hace el commit del paso 6.8 hasta que las 6 compuertas estén en verde. Si una compuerta falla, se diagnostica, se corrige y se **vuelve a ejecutar la compuerta desde el inicio** — no se continúa "asumiendo" que está bien.

Este protocolo reemplaza y amplía los pasos 6.5, 6.6 y 6.7. Ejecutarlo completo por cada servicio.

### 7.1 — Las 6 compuertas de validación

Cada compuerta es bloqueante: si no pasa, no se avanza a la siguiente.

#### Compuerta 1 — Compilación TSC

```bash
npx nx build servicio-identidad --configuration=production
```

Criterios (todos deben cumplirse):
- [ ] El comando termina con código de salida `0`.
- [ ] No hay errores `TS####` en la salida.
- [ ] No hay warnings de módulos no resueltos.
- [ ] `dist/apps/servicio-identidad/main.js` existe.
- [ ] El output es **modular** (varios `.js`), no un único bundle gigante:
  ```bash
  ls dist/apps/servicio-identidad/**/*.js | wc -l   # debe ser > 1
  ```

Si falla: ver tabla de diagnóstico 7.3. Corregir y **re-ejecutar la Compuerta 1 completa**.

#### Compuerta 2 — Tests unitarios

```bash
npx vitest run
```

Criterios:
- [ ] Pasan exactamente los mismos tests que en la línea base (paso 3.3). Si la base era 45/45, debe seguir siendo 45/45.
- [ ] Ningún test nuevo en estado `failed` ni `skipped` que antes pasara.
- [ ] No hay errores de resolución de imports en la salida de Vitest.

Si falla: el cambio de `tsconfig` puede haber afectado la resolución. Revisar 7.3. Corregir y **re-ejecutar la Compuerta 2 completa**.

#### Compuerta 3 — Arranque del contenedor

```bash
docker compose -f infra/docker-compose.yml --env-file .env build --no-cache servicio-identidad
docker compose -f infra/docker-compose.yml --env-file .env --profile dev up -d servicio-identidad
```

Esperar 20 segundos y revisar:

```bash
docker compose -f infra/docker-compose.yml ps servicio-identidad
docker compose -f infra/docker-compose.yml --env-file .env logs --tail 50 servicio-identidad
```

Criterios:
- [ ] El contenedor está en estado `running` / `Up` (no `Restarting`, no `Exited`).
- [ ] Los logs muestran el banner de arranque de NestJS (`Nest application successfully started`).
- [ ] Los logs muestran `Prisma conectado`.
- [ ] **NO** aparece `Must call super constructor` en ningún punto del log.
- [ ] **NO** aparece ningún `Error`, `UnhandledPromiseRejection` ni stack trace.

Si falla: ver 7.3. Corregir, **rebuild con `--no-cache`** y **re-ejecutar la Compuerta 3 completa**.

#### Compuerta 4 — Health check directo

Probar el contenedor en su puerto interno, sin pasar por Kong:

```bash
# Puerto interno según AGENTS.md sección 3 — identidad: 3001
curl -s -o NUL -w "HTTP %{http_code}\n" http://localhost:3001/health
```

Criterios:
- [ ] Responde `HTTP 200`.

Si responde error de conexión (exit 7) o un código `5xx`: el servicio arrancó pero no atiende peticiones. Revisar 7.3.

#### Compuerta 5 — Endpoint funcional vía Kong

Probar a través del API Gateway, que es la ruta real de producción. El endpoint depende del servicio (ver AGENTS.md sección 5):

```bash
# servicio-identidad — login (público)
curl -s -X POST http://localhost:8000/identidad/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@nachopps.com\",\"password\":\"admin123\"}"
```

Criterios para `servicio-identidad`:
- [ ] Responde `200` con un cuerpo JSON que contiene `access_token`.
- [ ] **NO** responde `500` (error interno) ni `502` (Kong no recibe respuesta válida).

Para los demás servicios, usar un endpoint protegido representativo y un token válido obtenido del login:

```bash
TOKEN="<token-del-login>"
# Ejemplos por servicio:
curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer $TOKEN" http://localhost:8000/mesas
curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer $TOKEN" http://localhost:8000/productos
curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer $TOKEN" http://localhost:8000/pedidos
curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer $TOKEN" http://localhost:8000/cuentas
curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer $TOKEN" http://localhost:8000/reservas
curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer $TOKEN" http://localhost:8000/caja/turnos/activo
curl -s -w "\nHTTP %{http_code}\n" -H "Authorization: Bearer $TOKEN" http://localhost:8000/reportes/dashboard
```

Criterios:
- [ ] Responde `200` (datos) o `401` solo si se omite el token a propósito.
- [ ] **NO** responde `500` ni `502`.

#### Compuerta 6 — Verificación de eventos (solo servicios con RabbitMQ)

Aplica a servicios que publican o consumen eventos (todos menos casos puramente REST). Verificar en RabbitMQ UI:

```bash
# Abrir http://localhost:15672  (usuario/clave en .env)
```

Criterios:
- [ ] El servicio aparece con sus colas/bindings activos.
- [ ] Si el servicio publica eventos: ejecutar una acción que dispare uno (ej. crear un pedido) y confirmar que el mensaje aparece en el exchange `nachopps_exchange`.
- [ ] Si el servicio consume eventos: confirmar que la cola correspondiente tiene `consumers ≥ 1` y `messages: 0` (no se acumulan sin procesar).
- [ ] El dead letter queue `nachopps_dead_letter_queue` **no** crece tras la prueba.

### 7.2 — Bucle de corrección obligatorio

```
┌─────────────────────────────────────────────────┐
│  Para el servicio en turno:                      │
│                                                   │
│  1. Ejecutar Compuerta N                          │
│  2. ¿Pasó? ──── SÍ ──▶ Ir a Compuerta N+1         │
│       │                                           │
│       NO                                          │
│       ▼                                           │
│  3. Diagnosticar con tabla 7.3                    │
│  4. Aplicar corrección                            │
│  5. Volver al paso 1 (re-ejecutar Compuerta N     │
│     COMPLETA, desde el inicio)                    │
│                                                   │
│  NO avanzar. NO hacer commit. NO migrar el        │
│  siguiente servicio mientras haya una compuerta   │
│  en rojo.                                         │
└─────────────────────────────────────────────────┘
```

Solo cuando **las 6 compuertas estén en verde** se ejecuta el paso 6.8 (commit) y se pasa al siguiente servicio.

### 7.3 — Tabla de diagnóstico rápido

| Síntoma | Causa probable | Corrección |
|---|---|---|
| `TS2307: Cannot find module '@org/...'` | Path alias ausente o mal escrito | Revisar `tsconfig.base.json` (sección 3.1) |
| `TS1240` / decoradores no funcionan | Falta `emitDecoratorMetadata` | Revisar `tsconfig.app.json` (paso 6.2) |
| Inyección de dependencias NestJS falla en runtime | `experimentalDecorators` o `emitDecoratorMetadata` en `false` | Paso 6.2, ambos en `true` |
| Contenedor en `Restarting` | El proceso crashea al arrancar | `logs --tail 100`, leer el primer error |
| `Must call super constructor` persiste | Quedó un `webpack.config.js` o el `project.json` aún usa webpack | Verificar paso 6.1 y 6.3 |
| `502` desde Kong | El servicio no responde o crashea por petición | Compuerta 4 (health directo) para aislar |
| `500` en endpoint | Error de lógica/Prisma en runtime | `logs` del servicio durante la petición |
| `Cannot find module './generated/prisma'` | Cliente Prisma no copiado a la imagen | Revisar `COPY` del Dockerfile (sección 8) y que esté commiteado (3.4) |
| Build OK pero `main.js` no existe | `main` o `outputPath` mal en `project.json` | Revisar paso 6.1 |
| Tests fallan tras migrar | Resolución de módulos cambió | Confirmar que Vitest usa `tsconfig.base.json` con los paths |

### 7.4 — Registro de validación por servicio

Llevar este registro (en el PR o en una nota) para tener trazabilidad de que ningún servicio se dio por bueno sin validar:

```
SERVICIO: servicio-identidad
[ ] Compuerta 1 — Compilación TSC ......... PASA / FALLA → corrección: ______
[ ] Compuerta 2 — Tests unitarios ......... PASA / FALLA → corrección: ______
[ ] Compuerta 3 — Arranque contenedor ..... PASA / FALLA → corrección: ______
[ ] Compuerta 4 — Health directo .......... PASA / FALLA → corrección: ______
[ ] Compuerta 5 — Endpoint vía Kong ....... PASA / FALLA → corrección: ______
[ ] Compuerta 6 — Eventos RabbitMQ ........ PASA / FALLA / N/A
COMMIT 6.8 autorizado solo con 6/6 en verde: [ ]
```

### 7.5 — Gate final del sistema completo

Tras migrar los 9 servicios, además de la verificación de la sección 10, no se considera la DT-10 cerrada hasta que:

- [ ] Los 9 servicios pasaron sus 6 compuertas individualmente.
- [ ] El entorno completo (`--profile all`) levanta sin un solo contenedor en `Restarting`.
- [ ] El flujo de negocio extremo a extremo funciona (sección 10, smoke test): login → crear pedido → pagar → cuenta cerrada → mesa liberada.
- [ ] Tras el flujo completo, el dead letter queue sigue vacío.
- [ ] Si cualquier punto falla, **no se hace merge a `main`**: se vuelve al bucle 7.2 sobre el servicio responsable.

---

## 8. Actualizar el Dockerfile

Una vez migrados los 9 servicios, simplificar el Dockerfile compartido. La versión basada en webpack incluía pasos frágiles (`prisma generate` en el build, externalización de dependencias) que ya no son necesarios.

Archivo: `Dockerfile` (raíz)

```dockerfile
# ---- Stage 1: Dependencias ----
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

# ---- Stage 2: Builder ----
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Sincronizar referencias de TS de Nx
RUN npx nx sync

# Compilar con TSC — sin webpack, sin bundling, sin prisma generate
RUN npx nx build ${APP_NAME} --configuration=production

# ---- Stage 3: Producción ----
FROM node:20-alpine AS production
WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}
ENV NODE_ENV=production

# Solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar el build compilado
COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} ./dist

# Copiar el cliente Prisma generado (commiteado en source)
COPY --from=builder /usr/src/app/apps/${APP_NAME}/src/generated ./apps/${APP_NAME}/src/generated

USER node
EXPOSE 3000

CMD ["node", "dist/main.js"]
```

> Ajustar las rutas `COPY` si la estructura real del repo difiere. El punto clave: **no se ejecuta `prisma generate` en el Dockerfile**; se usa el cliente generado y commiteado.

---

## 9. Verificar `package.json`

Confirmar que las dependencias de Prisma están en la sección correcta. Al usar el adaptador, `@prisma/client`, `@prisma/adapter-pg` y `pg` se necesitan en **runtime**, por lo tanto van en `dependencies`. El CLI `prisma` solo se usa en build, va en `devDependencies`.

```jsonc
{
  "dependencies": {
    "@prisma/client": "^7.8.0",
    "@prisma/adapter-pg": "^7.8.0",
    "pg": "^8.13.0"
  },
  "devDependencies": {
    "prisma": "^7.8.0"
  }
}
```

---

## 10. Verificación final del sistema completo

```bash
# Build de todos los servicios
npx nx run-many -t build --configuration=production

# Todos los tests
npx vitest run

# Rebuild completo de Docker
docker compose -f infra/docker-compose.yml --env-file .env build --no-cache

# Levantar el entorno completo
docker compose -f infra/docker-compose.yml --env-file .env --profile all up -d

# Estado de contenedores
docker compose -f infra/docker-compose.yml ps
```

### Smoke test funcional

1. **Login:** `POST /identidad/auth/login` → devuelve token.
2. Con el token, probar un endpoint protegido de cada servicio (ej. `GET /mesas`, `GET /productos`).
3. Probar un flujo de evento: crear un pedido y verificar en RabbitMQ UI (`localhost:15672`) que `pedido.creado` se publicó.
4. Revisar logs: ningún servicio debe mostrar el error `Must call super constructor`.

### Criterios de aceptación

- [ ] Los 9 servicios compilan con `@nx/js:tsc`.
- [ ] Ningún `webpack.config.js` queda en `apps/servicio-*`.
- [ ] El error `Must call super constructor` no aparece en ningún log.
- [ ] `POST /identidad/auth/login` responde `200`.
- [ ] Los 45 tests siguen pasando.
- [ ] El flujo de Saga de pedidos funciona end-to-end.
- [ ] El Dockerfile no ejecuta `prisma generate`.

---

## 11. Plan de rollback

Como cada servicio se migra en un commit independiente, el rollback es granular:

```bash
# Revertir un solo servicio (antes de commit)
git checkout apps/servicio-X

# Revertir un commit de servicio ya hecho
git revert <hash-del-commit>

# Abortar toda la migración
git checkout main
git branch -D dt10/migracion-webpack-a-tsc
```

El estado anterior (webpack) queda intacto en `main` hasta que se haga el merge final.

---

## 12. Matriz de riesgo

| Riesgo | Nivel | Mitigación |
|---|---|---|
| Path aliases `@org/...` no resueltos | Medio | Verificación 3.1 antes de empezar |
| Decoradores NestJS rotos | Medio | `emitDecoratorMetadata: true` en 6.2 |
| Assets estáticos no copiados | Bajo | Bloque `assets` en `project.json` |
| Tests dejan de pasar | Bajo | Validación 6.6 por servicio |
| Regresión en servicio que funcionaba | Bajo | Migración incremental + commit por servicio |

---

## 13. Resultado esperado

| Aspecto | Antes (Webpack) | Después (TSC) |
|---|---|---|
| Compilador backend | `@nx/webpack:webpack` | `@nx/js:tsc` |
| Adaptador Prisma `PrismaPg` | Roto al bundlear | Funciona |
| Error `super constructor` | Presente | Eliminado |
| Output de build | 1 bundle gigante | Múltiples `.js` modulares |
| Tiempo de build | Lento | Rápido |
| Dockerfile | Complejo, con `prisma generate` | Simple, sin pasos frágiles |
| Alineación con estándar NestJS + NX | No | Sí |

---

## 14. Actualización de documentación

Al completar la DT-10, actualizar:

- **`docs/ESTADO.md`** — mover DT-10 a la tabla de "Resueltas" con la descripción de cómo se resolvió.
- **`docs/AGENTS.md`** — sección 10 (Comandos): confirmar que `npx nx build` ya no usa webpack. Sección 8: el Dockerfile cambió.

### Entrada sugerida para ESTADO.md (Resueltas)

```
| DT-10 | Webpack como bundler de backend rompía la herencia de
         clases ES6 de Prisma 7.8 (error "Must call super constructor") |
         Migración de los 9 microservicios de @nx/webpack:webpack a
         @nx/js:tsc. Eliminados webpack.config.js. PrismaService
         restaurado con adaptador PrismaPg. Dockerfile simplificado
         sin prisma generate. |
```
