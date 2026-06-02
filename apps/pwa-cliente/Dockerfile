FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* nx.json tsconfig.base.json ./
COPY apps/pwa-cliente/package.json ./apps/pwa-cliente/package.json
COPY libs/ ./libs/

RUN npm install --ignore-scripts

COPY apps/pwa-cliente ./apps/pwa-cliente
RUN npx nx build pwa-cliente --configuration=production

FROM nginx:alpine
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
