# Frontend Docker Configuration
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Web server layer to serve production build static files
FROM alpine:latest
RUN apk add --no-cache busybox-extras
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 5173

# Simple HTTP static server command
CMD ["httpd", "-f", "-p", "5173", "-h", "./dist"]
