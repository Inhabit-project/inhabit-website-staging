# Etapa 1: build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia los archivos necesarios e instala dependencias
COPY package*.json bun.lockb* ./
COPY bunfig.toml ./
RUN npm install -g bun && bun install

# Copia el resto del código y genera la build
COPY . .
RUN bun run build

# Etapa 2: producción
FROM nginx:alpine AS production

# Elimina la configuración por defecto de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia una configuración básica para servir Vite
COPY nginx.conf /etc/nginx/conf.d

# Copia los archivos construidos desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
