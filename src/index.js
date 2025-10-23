const connectDB = require('./db');
const { startScheduler } = require('./scheduler');
const logger = require('./logger');

const start = async () => {
  try {
    await connectDB();
    startScheduler();
  } catch (err) {
    logger.error('Error inicio app:', err.message);
    process.exit(1);
  }
};

start();
