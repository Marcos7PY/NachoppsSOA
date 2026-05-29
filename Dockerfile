FROM node:22-alpine AS builder
WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* nx.json tsconfig.base.json ./
COPY apps/${APP_NAME}/package.json ./apps/${APP_NAME}/package.json
COPY libs/ ./libs/
COPY apps/${APP_NAME}/prisma ./apps/${APP_NAME}/prisma

# Optimización: Usa la caché nativa de Docker BuildKit para no descargar el internet 9 veces
RUN apk add --no-cache python3 make g++
RUN --mount=type=cache,target=/root/.npm npm install --ignore-scripts
RUN npm rebuild bcrypt --build-from-source

COPY apps/${APP_NAME} ./apps/${APP_NAME}

RUN npx prisma generate --schema=./apps/${APP_NAME}/prisma/schema.prisma

RUN npx nx build ${APP_NAME} --configuration=production

FROM node:22-alpine AS production
WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}
ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} ./dist/apps/${APP_NAME}
COPY --from=builder /usr/src/app/apps/${APP_NAME}/prisma ./apps/${APP_NAME}/prisma
COPY infra/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

USER node
EXPOSE 3000

CMD ["sh", "-c", "./entrypoint.sh"]
