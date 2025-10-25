const connectDB = require('./db');
const { checkOnce } = require('./scheduler'); // cambiamos startScheduler por checkOnce
const logger = require('./logger');
const http = require('http');
const url = require('url');

const start = async () => {
  try {
    await connectDB();

    const server = http.createServer(async (req, res) => {
      const parsedUrl = url.parse(req.url, true);

      // Ruta principal (Render)
      if (parsedUrl.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('El watcher está corriendo bebe, cuando publiquen un auto nuevo te lo mando por telegram 😎');
        return;
      }

      // Nueva ruta /check -> ejecuta checkOnce()
      if (parsedUrl.pathname === '/check') {
        console.log('🕒 Ping recibido desde cron-job.org, ejecutando checkOnce()...');
        const result = await checkOnce();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
        return;
      }

      // Cualquier otra ruta
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
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
