# Análisis de Rendimiento y Reactividad

Este documento presenta una auditoría técnica del rendimiento de la aplicación NachoPps, abarcando tanto la SPA (Frontend) como la red de microservicios (Backend). No se ha modificado el código fuente; esto es un diagnóstico para orientar futuras mejoras.

---

## 1. Frontend (PWA - React / Vite)

### 1.1. Falta de Code Splitting en el Enrutador
**Problema:**
En `apps/pwa-cliente/src/router/index.tsx`, todas las pantallas (`CocinaScreen`, `MesasScreen`, `CajaScreen`, etc.) se importan estáticamente al inicio del archivo. Esto provoca que el empaquetador de Vite genere un *bundle* gigantesco (ej. `index-xxx.js` pesa más de 400KB).
- **Consecuencia:** Mayor tiempo de descarga inicial (Time To Interactive alto), especialmente crítico para clientes móviles (meseros con mala conexión WiFi).

**Solución Propuesta:**
Implementar **React Lazy Loading** y Suspense por ruta.
```tsx
const MesasScreen = React.lazy(() => import('../screens/ops/MesasScreen').then(m => ({ default: m.MesasScreen })));
```
- **Trade-off:** La descarga inicial es ultra rápida, pero la primera vez que un usuario entra a un módulo nuevo, habrá un micromilisegundo de espera (cubierto por un Spinner en el `<Suspense>`).

### 1.2. Obtención de Datos: El Anti-patrón de `useEffect`
**Problema:**
Una inspección de los componentes (ej. `MesasScreen.tsx`, `CajaScreen.tsx`, etc.) revela que la ingesta de datos a la API se hace de forma imperativa dentro de bloques `useEffect`.
- **Consecuencias:**
  1. No hay caché en memoria: Si el usuario va de Mesas a Pedidos y vuelve a Mesas, volverá a ver un *Spinner* de carga y se disparará otra llamada HTTP innecesaria.
  2. Susceptible a "Race Conditions" y problemas de limpieza de memoria (desmontaje de componentes antes de resolver promesas).
  3. No hay *Stale-While-Revalidate*.

**Solución Propuesta:**
Migrar la capa de fetching a librerías especializadas como **TanStack Query (React Query)** o **SWR**.
- **Trade-off:** Agrega unos ~12KB al bundle y tiene una ligera curva de aprendizaje. A cambio, el rendimiento percibido se vuelve *casi instantáneo* ya que los datos previamente visitados se entregan desde caché en 0ms mientras se actualizan silenciosamente de fondo.

### 1.3. Zustand y Renders
**Observación Positiva:**
El uso de selectores en Zustand (ej. `const user = useAuthStore((s) => s.user)`) está implementado correctamente. Evita re-renders innecesarios en la jerarquía del DOM cuando otras partes del estado mutan.

---

## 2. Backend (Microservicios NestJS & Prisma)

### 2.1. Prisma N+1 Queries
**Problema:**
Se ha identificado una iteración secuencial de *updates* en la base de datos que perjudica el rendimiento bajo carga. Por ejemplo, en `servicio-pedidos/src/app/app.service.ts` > `procesarPagoRecibido`:
```typescript
for (const pedido of pedidos) {
  await this.prisma.pedido.update({ ... });
}
```
Si hay 15 pedidos atados a una cuenta, se ejecutarán 15 llamadas de red redondas (round-trips) al motor de base de datos.

**Solución Propuesta:**
Reemplazar bucles de persistencia por operaciones masivas nativas.
```typescript
await this.prisma.pedido.updateMany({
  where: { id: { in: pedidos.map(p => p.id) } },
  data: { estado: PedidoEstado.Pagado }
});
```
- **Trade-off:** Las operaciones `updateMany` no retornan los objetos actualizados completos, lo cual puede requerir una re-consulta en bloque si se necesitan publicar en RabbitMQ. Aún así, es dramáticamente más rápido.

### 2.2. Bloqueos Explícitos (Advisory Locks)
**Problema:**
En la creación de pedidos, el backend invoca bloqueos exclusivos de transacción (`pg_advisory_xact_lock(hashtext(...))`) en PostgreSQL para asegurar consistencia del stock.
- **Consecuencia:** Evita a toda costa condiciones de carrera (ventas "fantasma"), lo cual es vital, pero genera un cuello de botella. En hora pico, si 10 meseros piden "Coca Cola", los procesos harán cola uno detrás de otro a nivel de base de datos.

**Solución Propuesta:**
Si el negocio escala masivamente, migrar el manejo de reservas de stock temporal en memoria (Redis) o utilizar concurrencia optimista (Optimistic Concurrency Control) confiando en las colisiones de versión.
- **Trade-off:** Transitar de locks transaccionales a Redis requiere manejar casos borde (¿qué pasa si Redis cae?). Para la escala actual del restaurante, el lock actual es más seguro, pero debe monitorizarse.

### 2.3. Caché de Lecturas en APIs Frecuentes
**Problema:**
Servicios hiper-consultados como el catálogo local (productos en `servicio-pedidos`) realizan lecturas a base de datos en todos los *requests*.
**Solución Propuesta:**
Incorporar `CacheModule` (NestJS) en memoria o mediante Redis con un TTL de algunos minutos para entidades raras veces alteradas (Catálogo / Configuración).
- **Trade-off:** La UI puede sufrir de eventual inconsistencia temporal (ver un precio antiguo por 30 segundos).

---
## Resumen
El sistema funciona muy bien para su carga actual. **Para obtener un impacto masivo inmediato sin rediseñar el backend, la prioridad debe ser el Frontend:** la implementación de Code Splitting en el Router y React Query para el almacenamiento de estado remoto transformará la fluidez del usuario radicalmente.
