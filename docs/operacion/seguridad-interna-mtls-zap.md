# Seguridad interna: mTLS futuro, ZAP y cobertura

## mTLS interno como mejora futura

Estado actual: la comunicacion entre microservicios dentro de la red Docker usa HTTP
plano con destinos fijos (`servicio-*:3000`) y no esta expuesta directamente al exterior.
La autenticacion servicio-a-servicio se protege con tokens S2S HS256 y audiencia estricta
(`SERVICE_AUD_ENFORCE=true`). TLS termina en el perimetro, en Kong.

Esto es aceptable para el despliegue local y para una red de produccion confiable y
aislada. El disparador para implementar mTLS interno es cualquiera de estos cambios:
servicios desplegados fuera de una red confiable, trafico este-oeste sobre infraestructura
compartida, requisito de compliance que exija cifrado entre workloads, o exposicion de
servicios internos a redes que no controla el equipo.

Cuando se active, el alcance esperado es: certificados por servicio, rotacion automatizada,
validacion de identidad de workload en cada hop interno y runbook de rollover sin downtime.

## ZAP aceptados

La corrida `logs/security-run-20260611-175344` dejo ZAP sin alertas FAIL. Las alertas
WARN aceptadas son:

- `10049` (`Storable and Cacheable Content`): aparece sobre rutas 404. No expone datos
  sensibles; si se quiere un reporte mas limpio, Kong puede agregar `Cache-Control:
  no-store` a respuestas de error.
- `90005` (`Sec-Fetch-* Header is Missing`): los headers faltan en requests generados por
  el scanner, no en la navegacion normal de la PWA. No representa riesgo explotable para
  la app.

## Metricas de cobertura no comparables

Sonar y Vitest no miden exactamente el mismo universo. Sonar incluye la PWA y archivos sin
spec que entran al analisis estatico; Vitest reporta el universo definido en
`vitest.config.mts`. Por eso el 42% global de Sonar y el ~53% de Vitest no deben compararse
como si fueran la misma metrica.

Para el Quality Gate, la senal direccional es `new_coverage`. En la corrida
`logs/security-run-20260611-175344`, el valor fue `79.6%`, por encima del piso configurado
del 50%.
