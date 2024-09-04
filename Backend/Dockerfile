# Paso 1: Usar una imagen base de Node.js
FROM node:20.17.0-alpine

# Paso 2: Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Paso 3: Copiar el archivo package.json y package-lock.json al contenedor
COPY package.json package-lock.json ./

# Paso 4: Instalar las dependencias
RUN npm install --production

# Paso 5: Copiar el resto del código de la aplicación
COPY . .

# Paso 6: Exponer el puerto que utilizará la aplicación
EXPOSE 3000

# Paso 7: Comando para iniciar la aplicación con node
CMD ["node", "server.js"]
