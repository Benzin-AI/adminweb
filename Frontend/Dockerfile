FROM node:20.17.0-alpine AS build-step
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Añadir el contenido del proyecto
COPY . ./
RUN npm run build

# Verificar el contenido del directorio de construcción
RUN ls -la /app/dist

# Segundo paso
FROM nginx:1.23.3-alpine
EXPOSE 80
COPY --from=build-step /app/dist/admin-web/browser /usr/share/nginx/html
RUN rm etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

