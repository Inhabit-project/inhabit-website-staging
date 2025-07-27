FROM oven/bun:latest AS builder

WORKDIR /app

COPY bun.lock package.json ./
RUN bun install

COPY . .

ARG VITE_BACKEND_HOST
ARG VITE_BACKEND_API_KEY
ARG VITE_IS_PRODUCTION
ARG VITE_HOST
ARG VITE_PORT
ARG VITE_WALLET_CONNECT_PROJECT_ID

ENV VITE_BACKEND_HOST=$VITE_BACKEND_HOST
ENV VITE_BACKEND_API_KEY=$VITE_BACKEND_API_KEY
ENV VITE_IS_PRODUCTION=$VITE_IS_PRODUCTION
ENV VITE_HOST=$VITE_HOST
ENV VITE_PORT=$VITE_PORT
ENV VITE_WALLET_CONNECT_PROJECT_ID=$VITE_WALLET_CONNECT_PROJECT_ID

RUN bun run build

FROM nginx:alpine

RUN apk add --no-cache bash gettext nginx-mod-http-brotli

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
