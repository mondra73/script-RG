const connectDB = require('./db');
const { startScheduler } = require('./scheduler');
const logger = require('./logger');

// Agregar servidor HTTP simple
const http = require('http');

const start = async () => {
  try {
    await connectDB();
    startScheduler();
    
    // Servidor mínimo para Render
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('✅ RG Watcher Bot is running\n');
    });
    
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      logger.info(`Servidor escuchando en puerto ${PORT}`);
      console.log(`✅ Servidor listo en puerto ${PORT}`);
    });
    
  } catch (err) {
    logger.error('Error inicio app:', err.message);
    process.exit(1);
  }
};

start();