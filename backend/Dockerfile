# todo-docker-angular/backend/Dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
# RUN npm ci --only=production
RUN npm install --omit=dev

COPY index.js ./
ENV PORT=3000
EXPOSE 3000
CMD ["node","index.js"]
