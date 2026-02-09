# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- nginx ----------
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# кастомный конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# билд
COPY --from=build /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
