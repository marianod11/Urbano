FROM node:16.20.2-alpine3.18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn build

COPY . .

#---

FROM nginx:alpine

COPY --from=build /app/build/ /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000



## CAMBIOS:
    # Dockerfile: cambios version de alpine a la 3.18
    # Dockerfile: cambios version de node a la 16.20.2
    # Dockerfile: agregado de COPY package.json yarn.lock ./
    # Dockerfile: agregado de RUN yarn install --frozen-lockfile --ignore-engines
    # Dockerfile: cambio de nginx:alpine a nginx:1.25.3-alpine
