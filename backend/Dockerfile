FROM node:22.14.0-alpine3.21 AS deps

RUN npm install -g @nestjs/cli

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY . .
RUN nest build 

FROM node:22.14.0-alpine3.21
WORKDIR /app

COPY --from=deps /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY ormconfig.js ./

EXPOSE 5000
CMD ["node", "dist/main.js"]

## CAMBIOS:
# Dockerfile: cambios version de alpine a la 3.21
# Dockerfile: cambios version de node a la 22.14.0
# Dockerfile: cambio de build a deps
# Dockerfile: agregado de RUN npm install -g @nestjs/cli
# Dockerfile: uso de RUN nest build
# Dockerfile: agregado de COPY --from=deps /app/dist ./dist
# Dockerfile: agregado de COPY --from=deps /app/node_modules ./node_modules
# Dockerfile: cambio de ENTRYPOINT a CMD ["node", "dist/main.js"]