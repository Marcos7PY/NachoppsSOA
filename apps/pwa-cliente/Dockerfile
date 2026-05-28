# Etapa 1: Build de la SPA
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Instalar dependencias
RUN npm ci --ignore-scripts

# Copiar el workspace
COPY . .

# Recrear los symlinks de workspaces para que Vite pueda resolverlos
RUN npm install

# Construir PWA
RUN cd apps/pwa-cliente && npx vite build

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# Copiar configuración custom de nginx si existe, o usar la default y modificarla para SPA
# Usaremos un fallback a index.html para React Router
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/apps/pwa-cliente/dist /usr/share/nginx/html

# Inyectar configuración para SPA routing (redireccionar 404 a index.html)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
