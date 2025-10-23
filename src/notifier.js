const axios = require('axios');
const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = require('./config');
const logger = require('./logger');

if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
  logger.warn('Telegram no configurado. No se enviarán notificaciones.');
}

const sendTelegram = async (text) => {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: false
    });
  } catch (err) {
    logger.error('Error enviando telegram:', err.message);
  }
};

const notifyNewAutos = async (autos) => {
  for (const a of autos) {
    const message = `🚗 <b>Nuevo</b>\n${a.title}\n${a.price || ''}\nKm: ${a.km || 'N/D'}\nAño: ${a.year || 'N/D'}\n${a.link}`;
    await sendTelegram(message);
  }
};

module.exports = { notifyNewAutos };
