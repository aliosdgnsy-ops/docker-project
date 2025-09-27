# todo-docker-angular/frontend/Dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
# Angular projesi "app" klasöründe
COPY app/package*.json ./app/
WORKDIR /app/app
RUN npm ci
COPY app/ ./
# prod build
RUN npm run build -- --configuration production

# Run stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Angular 16 çıktısı: dist/app
COPY --from=builder /app/app/dist/app /usr/share/nginx/html
EXPOSE 80
