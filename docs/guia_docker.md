# Guía Maestra de Docker y Docker Compose para NachoPps Restobar

Esta guía detalla cómo manejar la infraestructura local (bases de datos, message brokers y observabilidad) junto con los microservicios usando Docker.

---

## 1. Conceptos Básicos

- **Docker:** Es una herramienta que nos permite empaquetar una aplicación y todas sus dependencias (librerías, sistema operativo base) en una caja aislada llamada **contenedor**. Esto asegura que "si funciona en mi máquina, funciona en cualquier lado".
- **Docker Compose:** Es un orquestador local. Lee un archivo de configuración (`infra/docker-compose.yml`) y se encarga de encender, conectar en red y configurar múltiples contenedores a la vez. En lugar de levantar 20 contenedores manualmente, le damos una sola orden a Compose.

---

## 2. El Uso de "Perfiles" (`profiles`)

En nuestro proyecto, agrupamos los contenedores en perfiles para no gastar memoria innecesariamente si no ocupamos todo el sistema.

- **Perfil `infra`:** Levanta **únicamente** la infraestructura base. Esto incluye Postgres, RabbitMQ, Kong, Prometheus, Jaeger y Grafana. Es ideal si tú quieres correr el código fuente de los microservicios de manera manual (`npm run start`) pero necesitas que las bases de datos existan.
- **Perfil `all`:** Levanta **TODO**. La infraestructura + todos los microservicios compilados + el frontend PWA. Esto simula el entorno de producción al 100%.

> **⚠️ REGLA DE ORO:** Si inicias algo con `--profile all`, **debes** apagarlo usando `--profile all`. Si omites el perfil, Docker solo interactuará con los servicios que no tienen perfil y dejará los demás encendidos accidentalmente.

---

## 3. Comandos Esenciales (Cheat Sheet)

Ejecuta todos estos comandos ubicándote en la raíz del proyecto (`C:\Users\MARCOS\Desktop\BackActual`).

### Levantar el entorno completo (Producción simulada)
```bash
docker-compose -f infra/docker-compose.yml --profile all up -d
```
*El parámetro `-d` (detached) indica que los contenedores correrán en segundo plano, dejándote la consola libre para seguir escribiendo.*

### Apagar el entorno completo
```bash
docker-compose -f infra/docker-compose.yml --profile all down
```
*Esto detiene y elimina los contenedores, pero **preserva la información** dentro de los volúmenes (tus tablas de Postgres no se borran).*

### Apagar y Borrar Datos (Reinicio de Fábrica)
```bash
docker-compose -f infra/docker-compose.yml --profile all down -v
```
*El parámetro `-v` elimina los volúmenes. Usar esto si tu base de datos está corrupta o quieres empezar desde cero.*

### Ver el estado de los contenedores
```bash
docker-compose -f infra/docker-compose.yml ps
```
*Lista qué contenedores están encendidos, cuánto tiempo llevan corriendo y qué puertos ocupan en tu computadora.*

### Ver la consola (Logs) de un servicio
```bash
docker-compose -f infra/docker-compose.yml logs -f servicio-pedidos
```
*El parámetro `-f` (follow) deja la consola "pegada" mostrándote los logs en tiempo real. Para salir, presiona `Ctrl + C`.*

---

## 4. Flujo de Trabajo: ¿Cómo aplico código nuevo?

Este es el proceso exacto que debes seguir cuando modificas el código de un microservicio (por ejemplo, en VSCode) y quieres que ese cambio se refleje en Docker.

### El Problema
Cuando usas `--profile all up -d`, Docker toma una "foto" de tu código, lo mete en la caja y lo ejecuta. Si tú editas un archivo `.ts` en tu PC, el contenedor **no se entera** porque él está corriendo la foto vieja que tomó.

### La Solución A (La más rápida y limpia si usas Nx)
Dado que estamos en un monorepo Nx, el proceso más seguro para reconstruir el código es:

1. **Recompilar el código modificado (o todos) en tu PC:**
   ```bash
   npx nx run-many -t build --configuration=production
   ```
   *Nx es inteligente y solo recompilará lo que haya cambiado, actualizando las carpetas `dist/`.*

2. **Decirle a Docker que empaquete las nuevas carpetas y reinicie:**
   ```bash
   docker-compose -f infra/docker-compose.yml --profile all up -d --build
   ```
   *El comando mágico aquí es `--build`. Esto le dice a Docker: "Oye, sé que ya tienes contenedores corriendo, pero ignóralos. Reconstruye las imágenes usando lo que hay en las carpetas de mi PC, y reemplaza los contenedores viejos por los nuevos sin afectar a los demás".*

### La Solución B (Reinicio puntual de un solo servicio)
Si solo cambiaste el código de `servicio-pedidos` y no quieres reconstruir todo, puedes ser específico:

1. Compila solo ese servicio:
   ```bash
   npx nx build servicio-pedidos --configuration=production
   ```
2. Reconstruye y reinicia solo ese contenedor en Docker:
   ```bash
   docker-compose -f infra/docker-compose.yml up -d --build servicio-pedidos
   ```

### ¿Qué pasa con las bases de datos al hacer `--build`?
Absolutamente **nada malo**. Cuando ejecutas `up -d --build`, Docker analiza todos los componentes. Si nota que la base de datos no tuvo cambios en su configuración, la deja quieta y corriendo intacta. Solo detendrá y reiniciará el microservicio al que le modificaste el código.
