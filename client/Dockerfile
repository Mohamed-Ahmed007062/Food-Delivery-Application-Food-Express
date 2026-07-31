# ==========================================
# Stage 1: Build React Vite Frontend
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Server
# ==========================================
FROM nginx:1.27-alpine AS runner

# Copy static assets from build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP Port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
