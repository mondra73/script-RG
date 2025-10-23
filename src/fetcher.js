const axios = require('axios');
const { ROSARIO_URL, USER_AGENT } = require('./config');
const logger = require('./logger');

const fetchHTML = async (url = ROSARIO_URL) => {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
      },
      timeout: 15000
    });
    return res.data; // HTML
  } catch (err) {
    logger.error('Error fetch HTML:', err.message);
    throw err;
  }
};

module.exports = { fetchHTML };
