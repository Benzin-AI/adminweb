# Compilación, Solución de Errores y Despliegue

## Frontend (Angular v18.2.1)

### Compilación
- **Script**: `ng build`
- **Descripción**: Compila el proyecto Angular en un paquete listo para producción.

### Solución de Errores de Compilación
- **Herramientas**:
  - `typescript`: Proporciona soporte para TypeScript, que es usado por Angular.
  - `@angular/cli`: Herramienta de línea de comandos para Angular que ayuda a gestionar el ciclo de vida del proyecto.
- **Scripts de Diagnóstico**:
  - `ng test`: Ejecuta las pruebas del proyecto Angular.
  - `ng build --watch --configuration development`: Compila el proyecto en modo desarrollo y observa cambios.

### Despliegue
ir a la carpeta Frontend y luego en consola ejecutar el siguiente script:
- **Script**: `ng serve`
- **Descripción**: Inicia un servidor de desarrollo que sirve la aplicación Angular.



## Backend (Node.js v20.17.0)

### Compilación
- **Nota**: El proyecto backend no tiene un proceso de compilación como tal, ya que está basado en JavaScript ejecutado en Node.js.

### Solución de Errores de Compilación
- **Herramientas**:
  - `@babel/cli`, `@babel/core`, `@babel/preset-env`: Utilizados para la transpilación del código JavaScript moderno a una versión compatible con Node.js.
  - `nodemon`: Herramienta que reinicia el servidor automáticamente cuando se detectan cambios en el código.
- **Scripts de Diagnóstico**:
  - **No específico**, pero se recomienda revisar los logs generados por `nodemon` para errores en tiempo de ejecución.

### Despliegue
ir a la carpeta Backend y luego en consola ejecutar el siguiente script:
- **Script**: `nodemon server.js`
- **Descripción**: Inicia el servidor Node.js usando `nodemon`, que permite recargar el servidor automáticamente en desarrollo.


# Dockerizar

## Comandos para dockerizar

### frontend: 
- Entrar a la carpeta Frontend (cd Frontend) || 'docker build -t frontend .'
- docker container run -p 80:80 frontend

### backend: 
- Entrar a la carpeta Backend (cd Backend) || 'docker build -t backend .'
- docker container run -p 3000:3000 backend
