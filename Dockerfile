# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm@10.4.1

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN pnpm build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm@10.4.1

# Copiar package.json
COPY package.json pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Copiar archivos compilados desde builder
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Comando de inicio
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
