FROM node:22-alpine AS builder
WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

COPY . .

RUN npm install

RUN npx nx build ${APP_NAME} --configuration=production

FROM node:22-alpine AS production
WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}
ENV NODE_ENV=production

COPY --from=builder /usr/src/app/package*.json /usr/src/app/nx.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} ./dist/apps/${APP_NAME}
COPY --from=builder /usr/src/app/apps/${APP_NAME}/src/generated ./apps/${APP_NAME}/src/generated

USER node
EXPOSE 3000

CMD ["sh", "-c", "node dist/apps/${APP_NAME}/apps/${APP_NAME}/src/main.js"]
