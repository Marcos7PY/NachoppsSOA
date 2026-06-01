# Analisis de Rendimiento y Reactividad

Este documento resume el estado actual de la PWA despues de la migracion progresiva a React Query y los siguientes pasos recomendados para seguir bajando latencia percibida, trabajo del main thread y trafico redundante.

## 1. Estado UI vs Server State

### Estado actual

La PWA ya separa la mayor parte del server state con React Query:

- Mesas, pedidos, cuentas e inventario usan hooks de consulta dedicados.
- Reservas, usuarios, reportes y notificaciones tambien se consultan con React Query.
- Zustand queda reservado para estado local de sesion/autenticacion, no para listas del backend.
- El `QueryClient` mantiene `staleTime` global de 1 minuto, `retry: 1` y refetch al recuperar foco.

### Puntos a mejorar

- Afinar `staleTime` por dominio: inventario/categorias puede vivir mas tiempo en cache; pedidos, mesas y cuentas deben seguir dependiendo de invalidaciones del socket.
- Prefetch selectivo al navegar hacia pantallas pesadas como Caja o Reportes, siempre midiendo el costo de red.
- Evitar que acciones de busqueda disparen demasiadas consultas si el volumen de usuarios o reservas crece.

## 2. Paginacion y listas grandes

### Estado actual

Los endpoints principales de listados usan respuestas paginadas con `{ data, nextCursor }` en backend y contratos compartidos. En frontend, reservas y usuarios consumen esos cursores con `useInfiniteQuery`; pedidos e inventario ya reciben `nextCursor`, aunque su UI todavia conserva una capa de compatibilidad para carga incremental.

### Puntos a mejorar

- Completar `useInfiniteQuery` en pedidos e inventario cuando la UI necesite navegar multiples paginas reales.
- Agregar virtualizacion con `@tanstack/react-virtual` en tablas que puedan crecer mucho, especialmente inventario, usuarios y reportes historicos.
- Mantener alturas estables en filas y skeletons para evitar saltos visuales durante fetches.

## 3. Invalidaciones en tiempo real

### Estado actual

El socket usa cookies httpOnly, no expone JWT en query string, agrupa invalidaciones por ventana corta y actualiza el cache de notificaciones. Las invalidaciones de pedidos, mesas y cuentas se aplican solo a queries activas para evitar refetches de pantallas no montadas.

### Puntos a mejorar

- Si los eventos de socket empiezan a incluir entidades completas y confiables, se puede usar `setQueryData` para parches optimistas en vez de invalidar siempre.
- Agregar metricas de eventos agrupados vs refetches reales para ajustar la ventana de debounce.
- Definir eventos especificos por dominio para reservas, inventario y usuarios si el backend los publica.

## 4. Render y re-renders

### Estado actual

La migracion a React Query reduce efectos manuales y estados duplicados en pantallas. Aun asi, componentes densos como grillas de mesas, KDS, productos y tablas administrativas pueden reconciliar mas de lo necesario cuando cambian filtros o estados locales.

### Puntos a mejorar

- Usar `React.memo` solo en componentes pesados medidos con React DevTools.
- Derivar datos con `select` de React Query cuando una pantalla necesite una porcion estable del resultado.
- Evitar memoizacion indiscriminada: tiene costo y puede empeorar el rendimiento si se aplica sin medicion.

## 5. PWA y resiliencia offline

### Estado actual

La PWA detecta estado online/offline y deshabilita mutaciones sensibles cuando no hay conexion. Todavia no existe una cola persistente de mutaciones offline.

### Puntos a mejorar

- Evaluar `@tanstack/react-query-persist-client` o Background Sync para encolar pedidos.
- Definir estrategia de conflictos antes de habilitar mutaciones offline en operaciones de mesa o cuenta.
- Persistir solo mutaciones idempotentes o con identificadores de negocio estables.

## Conclusion

La base actual ya cubre el grueso del problema de server state: cache, deduplicacion, invalidaciones por socket y consumo paginado. Los proximos avances de mayor impacto son completar infinite queries donde aun quedan stubs, virtualizar listas grandes y disenar una cola offline con reglas explicitas de conflicto.
