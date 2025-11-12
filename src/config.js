require('dotenv').config();

const ROSARIO_URL_BASE = process.env.ROSARIO_URL;

// Filtros configurables
const MODELO = 'gol';
const YEAR_FROM = 2018;
const KM_TO = 60000;
const COMBUSTIBLE = 'nafta';
const TRANSMISION = 'MT';
const RBR_ID = 107;  // Rosario
const MRK_ID = 1118; // Rosario

const searchParams = new URLSearchParams({
  action: 'finder/search',
  rbrId: RBR_ID,
  mrkId: MRK_ID,
  itmModelDesc: MODELO,
  optKm: 'usados',
  'km[to]': KM_TO,
  combustible: COMBUSTIBLE,
  itmClass_price: '1',
  'year[from]': YEAR_FROM,
  itmTransm: TRANSMISION,
  sort_type: '3'
});

const ROSARIO_URL = `${ROSARIO_URL_BASE}?${searchParams.toString()}`;

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  USER_AGENT: process.env.USER_AGENT,
  CHECK_INTERVAL_CRON: process.env.CHECK_INTERVAL_CRON || '*/30 * * * *',
  ROSARIO_URL,

  // filtros separados por si los necesitas en otras partes del código
  MODELO,
  YEAR_FROM,
  KM_TO,
  COMBUSTIBLE,
  TRANSMISION,
  RBR_ID,
  MRK_ID
};