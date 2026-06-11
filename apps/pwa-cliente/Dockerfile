FROM node@sha256:968df39aedcea65eeb078fb336ed7191baf48f972b4479711397108be0966920 AS builder
WORKDIR /usr/src/app

# URL del API Gateway (Kong) horneada en el bundle por Vite.
# Por defecto apunta al stack local/CI; en prod se pasa el dominio HTTPS real:
#   docker build --build-arg VITE_API_BASE_URL=https://api.tudominio.com ...
ARG VITE_API_BASE_URL=http://localhost:8000

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* nx.json tsconfig.base.json ./
COPY apps/pwa-cliente/package.json ./apps/pwa-cliente/package.json

RUN npm install --ignore-scripts

COPY libs/ ./libs/
COPY apps/pwa-cliente ./apps/pwa-cliente
# Vite hornea import.meta.env.VITE_* desde .env.production (root = apps/pwa-cliente).
# Lo reescribimos con la URL del gateway de este entorno antes de compilar.
RUN printf 'VITE_API_BASE_URL=%s\nVITE_WS_PATH=/notificaciones/socket.io\n' "$VITE_API_BASE_URL" > apps/pwa-cliente/.env.production
RUN npx nx build pwa-cliente --configuration=production

FROM nginx@sha256:8b1e78743a03dbb2c95171cc58639fef29abc8816598e27fb910ed2e621e589a
COPY --from=builder /usr/src/app/apps/pwa-cliente/dist /usr/share/nginx/html
# Add basic nginx config for React Router fallback
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
