require('dotenv').config();
const { ROSARIO_URL, USER_AGENT } = require('./config');
const { parseAutos } = require('./parser');
const { notifyNewAutos } = require('./notifier');
const axios = require('axios');

(async () => {
  try {
    console.log('🔗 Probando URL:', ROSARIO_URL);

    const res = await axios.get(ROSARIO_URL, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });

    console.log('✅ HTML obtenido correctamente');
    console.log('📄 Longitud del HTML:', res.data.length);

    const autos = parseAutos(res.data);
    console.log(`📝 Autos encontrados por el parser: ${autos.length}`);

    if (autos.length > 0) {
      console.log('🚀 Enviando test de notificaciones a Telegram...');
      await notifyNewAutos(autos);
      console.log('✅ Mensajes enviados');
    } else {
      console.log('⚠️ No se detectaron autos en el HTML');
    }

  } catch (err) {
    console.error('❌ Error durante el test scraper:', err.message);
  }
})();
