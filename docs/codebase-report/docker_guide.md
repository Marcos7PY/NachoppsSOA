# Guía Operativa: Docker y Despliegue Local

El monorepo NachoPps incluye una orquestación completa mediante Docker Compose que empaqueta:
- 9 Bases de datos PostgreSQL independientes (una por microservicio).
- RabbitMQ para mensajería asíncrona.
- Kong API Gateway para enrutamiento y JWT.
- 9 Microservicios Backend.
- PWA (Frontend).

## 1. Levantar Todo (Inicialización Completa)

Para inicializar el proyecto desde cero (o diariamente), existe un script de PowerShell que orquesta no solo los contenedores, sino también las migraciones de base de datos y la inserción de datos iniciales.

**Comando:**
```powershell
.\levantar-todo.ps1
```

**¿Qué hace este script bajo el capó?**
1. Ejecuta `docker compose --profile all up -d --wait` para encender toda la infraestructura y servicios.
2. Espera a que los endpoints de salud (Healthchecks) de todos los microservicios estén respondiendo correctamente en sus respectivos puertos.
3. Ejecuta `npx prisma db push` dentro de cada contenedor para sincronizar el esquema actual a su respectiva base de datos Postgres sin necesidad de generar archivos de migración locales.
4. Siembra (Seed) un usuario administrador por defecto (`admin@nachopps.pe` / `nachopps123`) en la base de datos del `servicio-identidad`.
5. Ejecuta un flujo de prueba automatizado haciendo login a través de Kong y consumiendo un endpoint protegido de cada microservicio para garantizar que el cluster entero está sano.

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
*(La bandera `-v` o `--volumes` elimina todos los volúmenes listados al final del `docker-compose.yml`, como `nachopps-db-pedidos`, `nachopps-db-identidad`, etc. La próxima vez que corras `.\levantar-todo.ps1`, el sistema arrancará completamente en blanco).*

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
