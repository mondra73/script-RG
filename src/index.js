const connectDB = require('./db');
const { checkOnce } = require('./scheduler'); // mantenemos tu función original
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

      // Ruta /check -> ejecuta checkOnce()
      if (parsedUrl.pathname === '/check') {
        console.log('🕒 Ping recibido desde cron-job.org, ejecutando checkOnce()...');
        try {
          const result = await checkOnce(); // 🔹 Tu lógica sigue idéntica
          // Respondemos corto, sin devolver todo el HTML parseado
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              ok: true,
              timestamp: new Date().toISOString(),
              message: 'checkOnce ejecutado correctamente ✅',
            })
          );
        } catch (error) {
          console.error('❌ Error en checkOnce:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              ok: false,
              error: error.message,
              timestamp: new Date().toISOString(),
            })
          );
        }
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
