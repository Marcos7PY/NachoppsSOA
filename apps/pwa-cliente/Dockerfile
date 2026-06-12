FROM node@sha256:968df39aedcea65eeb078fb336ed7191baf48f972b4479711397108be0966920 AS builder
WORKDIR /usr/src/app

# URL del API Gateway (Kong) horneada en el bundle por Vite.
# Por defecto apunta al stack local/CI; en prod se pasa el dominio HTTPS real:
#   docker build --build-arg VITE_API_BASE_URL=https://api.tudominio.com ...
ARG VITE_API_BASE_URL=http://localhost:8000

COPY package.json package-lock.json nx.json tsconfig.base.json ./
COPY apps/pwa-cliente/package.json ./apps/pwa-cliente/package.json

RUN npm install --ignore-scripts

COPY libs/ ./libs/
COPY apps/pwa-cliente ./apps/pwa-cliente
# Vite hornea import.meta.env.VITE_* desde .env.production (root = apps/pwa-cliente).
# Lo reescribimos con la URL del gateway de este entorno antes de compilar.
RUN printf 'VITE_API_BASE_URL=%s\nVITE_WS_PATH=/notificaciones/socket.io\n' "$VITE_API_BASE_URL" > apps/pwa-cliente/.env.production
RUN cd apps/pwa-cliente && npx vite build

FROM nginxinc/nginx-unprivileged@sha256:0c79d56aee561a1d81c63f00eee5fb5fe29279560cdc55e91425133104c7fbe6
COPY --from=builder /usr/src/app/apps/pwa-cliente/dist /usr/share/nginx/html
COPY apps/pwa-cliente/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
