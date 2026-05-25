# Dockerfile genérico para servicios NestJS en Nx
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiar configuraciones base
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Instalar TODAS las dependencias (necesarias para compilar)
RUN npm ci

# Copiar código fuente (excepto lo que esté en .dockerignore)
COPY . .


# Argumento para saber qué app compilar (ej: servicio-pedidos)
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Compilar la aplicación específica
RUN npx nx build ${APP_NAME} --configuration=production

# -- Etapa 2: Imagen de producción --
FROM node:20-alpine AS production

WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}
ENV NODE_ENV=production

# Copiar el package.json y lockfile
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Copiar el build compilado de la etapa anterior
COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} ./dist/apps/${APP_NAME}

# (Opcional) Copiar prisma para que el runtime lo use, 
# la ruta depende de si está dentro de la app
COPY --from=builder /usr/src/app/apps/${APP_NAME}/prisma ./apps/${APP_NAME}/prisma

# Exponer un puerto por defecto (se mapeará en docker-compose)
EXPOSE 3000

# Script para arrancar
CMD ["sh", "-c", "node dist/apps/${APP_NAME}/apps/${APP_NAME}/src/main.js"]
