# Librería Compartida: `@org/shared-auth`

**Ruta:** `libs/shared-auth`
**Responsabilidad:** Proveer el módulo base de autenticación JWT y Guards para asegurar rutas mediante validación de tokens.

## Exportaciones Principales (`src/index.ts`)

### 1. `SharedAuthModule`
- **Archivo:** `libs/shared-auth/src/lib/shared-auth.module.ts`
- **Decoradores:** `@Global()`, `@Module(...)`
- **Importaciones que registra:**
  - `PassportModule.register({ defaultStrategy: 'jwt' })`
  - `JwtModule.registerAsync({ useFactory: () => { ... } })` exigiendo explícitamente `process.env.JWT_SECRET`.
- **Providers:** Registra `JwtStrategy`.
- **Exporta:** `JwtModule`, `PassportModule`.
- **Nota:** Al ser `@Global()`, cualquier microservicio que importe `SharedAuthModule` tendrá disponible automáticamente la estrategia JWT y las herramientas de validación de tokens.

### 2. `JwtStrategy`
- **Archivo:** `libs/shared-auth/src/lib/jwt.strategy.ts`
- **Firma:** `export class JwtStrategy extends PassportStrategy(Strategy)`
- **Funcionamiento paso a paso:**
  1. En el constructor, configura la estrategia indicándole que extraiga el token como un *Bearer Token* del header de autorización (`ExtractJwt.fromAuthHeaderAsBearerToken()`).
  2. Define no ignorar la expiración (`ignoreExpiration: false`) y establece el *secret* desde la variable de entorno `process.env.JWT_SECRET` (o un valor por defecto).
  3. Implementa el método `async validate(payload: any)`.
  4. Retorna el objeto decodificado `{ sub: payload.sub, email: payload.email, rol: payload.rol }`. Este objeto será anexado automáticamente por Passport al objeto request (`req.user`).

### 3. `JwtAuthGuard`
- **Archivo:** `libs/shared-auth/src/lib/jwt-auth.guard.ts`
- **Firma:** `export class JwtAuthGuard extends AuthGuard('jwt')`
- **Funcionamiento paso a paso:**
  1. Extiende de la clase base `AuthGuard` indicándole la estrategia `'jwt'`.
  2. Sobrescribe el método `canActivate(context)`. Si la ruta solicitada es `/api/telemetry/metrics` o `/telemetry/metrics`, retorna `true` permitiendo el bypass de autenticación (esto es crucial para que Prometheus pueda raspar las métricas internamente sin tokens).
  3. Si no es bypass, delega a `super.canActivate(context)` que ejecuta Passport.
  4. Sobrescribe el método `handleRequest(err, user, info, context)`.
  5. Si hay un error (`err`) o no se extrajo el usuario (`!user`), lanza una excepción: `new UnauthorizedException('Token inválido o expirado')`.
  6. Caso contrario, retorna el `user`.
