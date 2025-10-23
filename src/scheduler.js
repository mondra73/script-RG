const cron = require('node-cron');
const { CHECK_INTERVAL_CRON } = require('./config');
const { fetchHTML } = require('./fetcher');
const { parseAutos } = require('./parser');
const Publication = require('./models/publication');
const { notifyNewAutos } = require('./notifier');
const logger = require('./logger');

const checkOnce = async () => {
  console.log('⏱️ ================= Ejecutando verificación =================');
  try {
    logger.info('Inicio de verificación...');
    const html = await fetchHTML();
    const autos = parseAutos(html);

    console.log(`📝 Se encontraron ${autos.length} autos filtrados en la página.`);

    const nuevos = [];
    const primeros = await Publication.countDocuments(); // revisa si la DB está vacía

    for (const a of autos) {
      const existe = await Publication.findOne({ link: a.link }).lean();
      if (!existe || primeros === 0) { // primera ejecución manda todo
        const doc = await Publication.create({
          link: a.link,
          title: a.title,
          price: a.price,
          km: a.km,
          year: a.year,
          raw: { snippet: a.rawHtmlSnippet }
        });
        nuevos.push(doc);
      }
    }

    console.log(`✨ Nuevos autos detectados: ${nuevos.length}`);
    if (nuevos.length > 0) {
      await notifyNewAutos(nuevos);
    }

    console.log('✅ Verificación finalizada');
  } catch (err) {
    console.error('❌ Error en checkOnce:', err.message);
  }
};


const startScheduler = () => {
  logger.info('Scheduler iniciado con cron: cada 30 minutos');

  // Ejecuta inmediatamente al arrancar
  checkOnce();

  // Ejecuta cada 30 minutos (0 y 30)
  cron.schedule('0,30 * * * *', async () => {
    await checkOnce();
  }, {
    scheduled: true,
    timezone: 'America/Argentina/Buenos_Aires'
  });
};


module.exports = { startScheduler, checkOnce };

if (require.main === module) {
  startScheduler();
}