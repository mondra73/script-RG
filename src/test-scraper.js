require('dotenv').config();
const { ROSARIO_URL, USER_AGENT } = require('./config');
const { parseAutos } = require('./parser');
const { notifyNewAutos } = require('./notifier');
const axios = require('axios');
const fs = require('fs');

(async () => {
  try {
    console.log('🔗 Probando URL:', ROSARIO_URL);

    const res = await axios.get(ROSARIO_URL, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 15000
    });

    console.log('✅ HTML obtenido correctamente');
    console.log('📄 Longitud del HTML:', res.data.length);

    // GUARDAR HTML PARA ANALIZAR
    fs.writeFileSync('debug-html.html', res.data);
    console.log('💾 HTML guardado en debug-html.html');

    // CONTAR ELEMENTOS CON CLASE "item"
    const cheerio = require('cheerio');
    const $ = cheerio.load(res.data);
    const itemCount = $('div.item').length;
    console.log(`🔍 Elementos con clase "item": ${itemCount}`);

    // MOSTRAR PRIMEROS 500 CARACTERES DEL HTML PARA VER ESTRUCTURA
    console.log('📋 Primeros 500 caracteres del HTML:');
    console.log(res.data.substring(0, 500));

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