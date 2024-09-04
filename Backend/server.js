const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});

// Función para manejar el cierre del servidor
function handleShutdown(signal) {
  console.log(`Recibida señal de ${signal}. Cerrando servidor...`);
  server.close(() => {
    console.log('Servidor cerrado.');
    process.exit(0); // Salir del proceso con código 0
  });
}

// Manejo de señales de terminación
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));