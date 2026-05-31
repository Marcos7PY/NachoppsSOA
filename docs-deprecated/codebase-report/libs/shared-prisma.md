# Librería Compartida: `@org/shared-prisma`

**Ruta:** `libs/shared-prisma`
**Responsabilidad:** Factory `createBasePrismaService()` para configurar Pool PostgreSQL + PrismaPg + lifecycle común.

## Estado Actual

**Usada por 9/9 microservicios.** La factory `createBasePrismaService()` abstrae:
- Lectura de `DATABASE_URL` y validación
- Configuración de `Pool` de `pg`
- Adaptador `PrismaPg`
- `onModuleInit()` → `$connect()`
- `onModuleDestroy()` → `$disconnect()`
- `$checkAndRecordIdempotencyKey()` para idempotencia en eventos

## Exportaciones (`src/index.ts`)

### `createBasePrismaService(PrismaClientClass)`
- **Archivo:** `libs/shared-prisma/src/lib/base-prisma.service.ts`
- **Firma:** `export function createBasePrismaService<T extends new (...args: any[]) => any>(PrismaClientClass: T)`
- Retorna una clase abstracta `BasePrismaService` que extiende `PrismaClientClass`
- Cada servicio extiende: `export class PrismaService extends Base { protected readonly serviceName = '...'; }`
