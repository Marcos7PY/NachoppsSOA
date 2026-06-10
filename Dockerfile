FROM node:22-alpine@sha256:968df39aedcea65eeb078fb336ed7191baf48f972b4479711397108be0966920 AS builder
WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* nx.json tsconfig.base.json ./
COPY apps/${APP_NAME}/package.json ./apps/${APP_NAME}/package.json
COPY apps/${APP_NAME}/prisma ./apps/${APP_NAME}/prisma

RUN --mount=type=cache,target=/root/.npm \
    apk add --no-cache python3 make g++ && \
    npm install --ignore-scripts && \
    npm rebuild bcrypt --build-from-source

COPY libs/ ./libs/
COPY apps/${APP_NAME} ./apps/${APP_NAME}

RUN npx prisma generate --schema=./apps/${APP_NAME}/prisma/schema.prisma

RUN if [ -f libs/shared-auth/tsconfig.json ]; then npx tsc -p libs/shared-auth/tsconfig.json; fi

RUN npx nx build ${APP_NAME} --configuration=production

FROM node:22-alpine@sha256:968df39aedcea65eeb078fb336ed7191baf48f972b4479711397108be0966920 AS production
WORKDIR /usr/src/app

ARG APP_NAME
ENV APP_NAME=${APP_NAME}
ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} ./dist/apps/${APP_NAME}
COPY --from=builder /usr/src/app/apps/${APP_NAME}/prisma ./apps/${APP_NAME}/prisma
COPY --from=builder /usr/src/app/libs ./libs
COPY --from=builder /usr/src/app/tsconfig.base.json ./tsconfig.base.json
RUN printf "require('reflect-metadata');\nconst path = require('path');\nconst root = path.join(__dirname, '../../..');\nrequire('ts-node').register({\n  transpileOnly: true,\n  compilerOptions: {\n    module: 'CommonJS',\n    moduleResolution: 'Node',\n    experimentalDecorators: true,\n    emitDecoratorMetadata: true,\n  },\n});\nrequire('tsconfig-paths').register({\n  baseUrl: root,\n  paths: {\n    '@org/contracts': ['libs/contracts/src/index.ts'],\n    '@org/observabilidad': ['libs/observabilidad/src/index.ts'],\n    '@org/resiliencia': ['libs/resiliencia/src/index.ts'],\n    '@org/shared-auth': ['libs/shared-auth/src/index.ts'],\n    '@org/shared-prisma': ['libs/shared-prisma/src/index.ts'],\n    '@org/shared-rabbitmq': ['libs/shared-rabbitmq/src/index.ts'],\n  },\n});\nmodule.exports = {\n  ...require('../../../libs/contracts/src'),\n  ...require('../../../libs/observabilidad/src'),\n  ...require('../../../libs/resiliencia/src'),\n  ...require('../../../libs/shared-auth/src'),\n  ...require('../../../libs/shared-prisma/src'),\n  ...require('../../../libs/shared-rabbitmq/src'),\n};\n" > ./dist/apps/${APP_NAME}/index.js
COPY infra/entrypoint.sh ./entrypoint.sh
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh

USER node
EXPOSE 3000

CMD ["sh", "-c", "./entrypoint.sh"]
