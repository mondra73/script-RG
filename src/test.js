require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

const { MONGO_URI, TELEGRAM_TOKEN, TELEGRAM_CHAT_ID } = process.env;

const testMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Conexión a MongoDB OK');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err.message);
  }
};

const testTelegram = async () => {
  try {
    const res = await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: '🚗 Test: conexión con el bot de Telegram OK!'
    });
    if (res.data.ok) console.log('✅ Mensaje enviado correctamente a Telegram');
    else console.error('❌ Respuesta no OK de Telegram:', res.data);
  } catch (err) {
    console.error('❌ Error enviando mensaje a Telegram:', err.response?.data || err.message);
  }
};

(async () => {
  await testMongo();
  await testTelegram();
})();
