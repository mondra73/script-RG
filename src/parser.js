const cheerio = require('cheerio');
const logger = require('./logger');
const { KM_TO, YEAR_FROM, COMBUSTIBLE, TRANSMISION, MODELO } = require('./config'); 

const absoluteUrl = (href) => {
  if (!href) return null;
  if (href.startsWith('http')) return href;
  return `https://www.rosariogarage.com/${href.replace(/^\/+/, '')}`;
};

const parseAutos = (html) => {
  const $ = cheerio.load(html);
  const autos = [];

  // La estructura real de RosarioGarage - cada publicación está en un div con clase "box_aviso_base"
  $('div.box_aviso_base').each((i, el) => {
    const el$ = $(el);

    // Título y link - están en el strong.list_type_anuncio dentro del box_aviso_tit
    const titleElement = el$.find('.box_aviso_tit strong.list_type_anuncio');
    const title = titleElement.text().trim();
    const linkRel = el$.find('.box_aviso_tit a').attr('href');
    const link = absoluteUrl(linkRel);

    // Precio - está en el div.precio
    const price = el$.find('.precio a').text().trim().replace(/\s+/g, ' ');

    // Detalles - están en el span dentro del box_aviso_tit
    const detalles = el$.find('.box_aviso_tit span');
    
    let kmText = '';
    let yearText = '';
    let combText = '';
    let transmText = '';

    // Parsear cada detalle
    detalles.each((j, detalle) => {
      const text = $(detalle).text().trim();
      
      if (text.includes('km')) {
        kmText = text.replace('km', '').replace('.', '').trim();
      } else if ($(detalle).prev().hasClass('last') && /^\d{4}$/.test(text)) {
        yearText = text;
      } else if (text.toLowerCase().includes('nafta') || text.toLowerCase().includes('diesel') || text.toLowerCase().includes('gnc')) {
        combText = text.toLowerCase();
      } else if (text === 'MT' || text === 'AT') {
        transmText = text;
      }
    });

    if (!link || !title) return;

    // Parseo numérico para filtros
    const kmNum = parseInt(kmText.replace(/\D/g, '')) || 0;
    const yearNum = parseInt(yearText.replace(/\D/g, '')) || 0;

    // Debug: mostrar lo que se encontró
    console.log(`Auto encontrado: ${title}`);
    console.log(`  - Año: ${yearText} (${yearNum})`);
    console.log(`  - KM: ${kmText} (${kmNum})`);
    console.log(`  - Combustible: ${combText}`);
    console.log(`  - Transmisión: ${transmText}`);

    // Aplicamos filtros
    if (
      !title.toLowerCase().includes(MODELO.toLowerCase()) || // modelo
      (kmNum > KM_TO && KM_TO > 0) ||                       // km máximo
      yearNum < YEAR_FROM ||                                // año mínimo
      !combText.includes(COMBUSTIBLE.toLowerCase()) ||      // combustible
      !transmText.includes(TRANSMISION.toUpperCase())       // transmisión
    ) {
      console.log(`  - FILTRADO: No cumple criterios`);
      return;
    }

    autos.push({
      title,
      price,
      link,
      km: kmText,
      year: yearText,
      combustible: combText,
      transm: transmText,
      rawHtmlSnippet: $.html(el)
    });

    console.log(`  - ACEPTADO: Cumple todos los filtros`);
  });

  logger.info(`Parser: encontró ${autos.length} autos filtrados`);
  return autos;
};

module.exports = { parseAutos };