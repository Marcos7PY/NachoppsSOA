# Handoff Sesión - Fase 4 y 5 Completadas

## Estado de Avance

Se completaron con éxito las siguientes tareas de los planes de implementación y continuación post-push:

- **C7. Reducir refetch por socket**: Ya estaba implementado el debounce de 300ms y las llamadas coalescentes a las tiendas (`invalidate`) en `socket.service.ts`. Ya existía TTL/dedup de caché en los stores.
- **C9. Eliminar retry-polling tras crear pedido**: 
  - Se removió `SYNC_RETRY_DELAYS_MS` y el bucle `revalidarMesaConCuenta` en `CrearPedidoScreen.tsx`.
  - La redirección se hace directamente después de `crearPedido`.
  - Al ser un sistema reactivo, dependemos de que `socket.service.ts` intercepte el evento asíncrono y actualice las tiendas sin necesidad de pooling manual en el componente.
- **C10. Reportes con datos reales**:
  - Se extendió el `CuentaCerradaPayload` en los contratos compartidos para incluir los items de la orden (`items?: { productoId, nombre, cantidad, precioUnitario }[]`).
  - `servicio-cuentas` fue modificado para mapear y enviar los ítems de los pedidos al cerrar la cuenta.
  - Se añadió un campo `items` de tipo JSON en `VentaDiaria` en el esquema de prisma de `servicio-reportes` y se ejecutó `prisma generate`.
  - Se actualizó la lógica de `servicio-reportes` en `registrarVenta` para guardar los ítems.
  - Se reemplazó la constante hardcodeada estática `PLATILLOS` en `obtenerResumenDiario` por una agregación real sobre los ítems de las ventas del día, generando un ranking determinista de `topProductos`.

## Fase 6 - Despliegue y Configuración (Completada)

- **C11. Separar dev/prod en Docker Compose**: Se creó `infra/docker-compose.prod.yml` excluyendo puertos innecesarios, dejando expuesto únicamente Kong y limitando los microservicios y BDs a la red interna docker.
- **C12. Secretos por ambiente**: Revisado el `.env.example`, garantizando que existan placeholders (`change_me`) para todos los secretos de producción, incluyendo configuración de Prometheus/Grafana y Kong.
- **C13. Confirmar `SameSite` según despliegue real**: Se documentó la política de cookies `SameSite` y CORS en `infra/kong/README.md` detallando las diferencias entre un despliegue Same-Site y Cross-Site, indicando que es obligatorio `SameSite=None` y `Secure` en setups cross-origin.

## Fase 7 - Calidad de UI y deuda menor (Completada)

- **C14. Componentes duplicados y UI muerta**: 
  - Se eliminaron los duplicados `MesaCard`, `ItemKDS`, y `PedidoRow` de la UI (no estaban en uso activo, el sistema usa tarjetas inline).
  - Se ocultó (comentó) el botón buscar con `⌘K` en `Sidebar.tsx`.
  - Se movieron el nombre del local y la configuración de turnos a `apps/pwa-cliente/src/config.ts`, y se reemplazaron los valores estáticos en `Header.tsx` y `Sidebar.tsx`.

---

**Todo el plan `plan-continuacion-post-push.md` ha sido ejecutado satisfactoriamente.** Todas las apps compilan correctamente. Quedaría validar un despliegue completo o empezar nuevas features.
