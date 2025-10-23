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

  // Ajustá esto según el HTML real de RosarioGarage
  $('.listing, .item, .search-result, .rowAuto').each((i, el) => {
    const el$ = $(el);

    const title = el$.find('.titulo, .title, h3').first().text().trim();
    const price = el$.find('.precio, .price').first().text().trim();
    const linkRel = el$.find('a').first().attr('href');
    const link = absoluteUrl(linkRel);

    const kmText = el$.find('.km, .kilometros').first().text().trim() || '';
    const yearText = el$.find('.year, .anio').first().text().trim() || '';
    const combText = el$.find('.combustible').first().text().trim().toLowerCase() || '';
    const transmText = el$.find('.transm').first().text().trim().toUpperCase() || '';

    if (!link || !title) return;

    // Parseo numérico para filtros
    const kmNum = parseInt(kmText.replace(/\D/g, '')) || 0;
    const yearNum = parseInt(yearText.replace(/\D/g, '')) || 0;

    // Aplicamos filtros
    if (
      !title.toLowerCase().includes(MODELO.toLowerCase()) || // modelo
      kmNum > KM_TO ||                                       // km máximo
      yearNum < YEAR_FROM ||                                  // año mínimo
      !combText.includes(COMBUSTIBLE.toLowerCase()) ||        // combustible
      !transmText.includes(TRANSMISION.toUpperCase())         // transmisión
    ) return;

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
  });

  logger.info(`Parser: encontró ${autos.length} autos filtrados`);
  return autos;
};

module.exports = { parseAutos };
