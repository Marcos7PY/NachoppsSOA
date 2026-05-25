# ---- Stage 1: Dependencias base ----
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json nx.json ./
RUN npm install

# ---- Stage 2: Builder ----
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package*.json ./

COPY . .

RUN npm install

RUN npx nx build ${APP_NAME} --configuration=production

# ---- Stage 3: Produccion ----
FROM node:20-alpine AS production
WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}
ENV NODE_ENV=production

COPY package*.json nx.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} ./dist/apps/${APP_NAME}
COPY --from=builder /usr/src/app/apps/${APP_NAME}/src/generated ./apps/${APP_NAME}/src/generated

USER node
EXPOSE 3000

CMD ["sh", "-c", "node dist/apps/${APP_NAME}/apps/${APP_NAME}/src/main.js"]
