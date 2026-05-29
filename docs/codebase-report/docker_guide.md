# Guía Operativa: Docker y Despliegue Local

El monorepo NachoPps incluye una orquestación completa mediante Docker Compose que empaqueta:
- 9 Bases de datos PostgreSQL independientes (una por microservicio).
- RabbitMQ para mensajería asíncrona.
- Kong API Gateway para enrutamiento y JWT.
- 9 Microservicios Backend.
- Stack de Observabilidad: Prometheus, Jaeger y Grafana.
- PWA (Frontend).

## 1. Levantar Todo (Inicialización Completa)

Para inicializar el proyecto desde cero (o diariamente), existe un script de PowerShell que orquesta no solo los contenedores, sino también las migraciones de base de datos y la inserción de datos iniciales.

**Comando (Levantar Infraestructura Base):**
```powershell
.\scripts\levantar-infra.ps1
```
*(Inicia bases de datos, RabbitMQ, Kong, y Observabilidad. Ideal antes del desarrollo local con Nx)*

**Comando (Reconstrucción Total y Pruebas):**
```powershell
.\scripts\reconstruir-y-probar.ps1
```

**¿Qué hace `reconstruir-y-probar.ps1` bajo el capó?**
1. Ejecuta limpieza de imágenes previas de microservicios.
2. Reconstruye las imágenes de Docker desde cero usando los Dockerfile de cada app.
3. Ejecuta `docker compose --profile all up -d` para encender toda la infraestructura y servicios.
4. Espera a que las bases de datos Postgres estén listas.
5. Ejecuta `npx prisma db push` para sincronizar los esquemas.
6. Siembra (Seed) un usuario administrador por defecto (`admin@nachopps.pe` / `nachopps123`).
7. Ejecuta un flujo exhaustivo de pruebas automatizadas end-to-end garantizando que el cluster entero está sano.

## 2. Detener el Sistema (Sin perder datos)

Si necesitas apagar tu entorno local para liberar recursos (RAM/CPU) pero quieres conservar los datos (usuarios, pedidos, configuraciones), tienes dos opciones principales:

### Opción A: Pausar / Detener (Recomendado para el día a día)
Detiene los contenedores pero los mantiene creados. El inicio posterior es muy rápido.
```powershell
docker compose -f infra/docker-compose.yml --profile all stop
```
*(Para volver a iniciar simplemente ejecuta: `docker compose -f infra/docker-compose.yml --profile all start`)*

### Opción B: Destruir contenedores (Conserva volúmenes)
Destruye los contenedores y la red virtual, pero **conserva los volúmenes de almacenamiento persistente** (donde vive la data de PostgreSQL). Útil si hiciste cambios en los Dockerfiles.
```powershell
docker compose -f infra/docker-compose.yml --profile all down
```

## 3. Reinicio de Fábrica (Peligro: Borrado total de datos)

Si la base de datos se corrompe, los esquemas de Prisma se desincronizan severamente o simplemente deseas volver al estado inicial (Factory Reset), debes destruir los contenedores **junto con sus volúmenes asociados**.

**Comando:**
```powershell
docker compose -f infra/docker-compose.yml --profile all down -v
```
*(La bandera `-v` o `--volumes` elimina todos los volúmenes listados al final del `docker-compose.yml`. La próxima vez que arranques, el sistema empezará completamente en blanco).*

## 4. Visualización de Logs en Tiempo Real

Para investigar errores o trazar una petición a lo largo del sistema:

**Ver logs de toda la malla:**
```powershell
docker compose -f infra/docker-compose.yml --profile all logs -f
```

**Ver logs de un microservicio específico:**
```powershell
docker compose -f infra/docker-compose.yml logs -f servicio-pedidos
```
*(Puedes reemplazar `servicio-pedidos` por `kong`, `rabbitmq`, `db-mesas`, etc).*

## 5. Accesos Rápidos
Una vez levantado el sistema, estas son las puertas de enlace principales:

- **Kong API Gateway (Backend Unificado):** `http://localhost:8000`
- **PWA Cliente (Frontend):** `http://localhost:4200`
- **RabbitMQ Management UI:** `http://localhost:15672` (Credenciales: `nachopps` / `nachopps_secret`)
- **Grafana (Dashboards y Métricas):** `http://localhost:3000` (Credenciales: `admin` / `admin`)
- **Prometheus (Targets de Métricas):** `http://localhost:9090`
- **Jaeger UI (Trazas Distribuidas OTel):** `http://localhost:16686`
