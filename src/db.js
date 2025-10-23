const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');
const logger = require('./logger');

const connectDB = async () => {
  if (!MONGO_URI) throw new Error('MONGO_URI no definido');
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB conectado');
  } catch (err) {
    logger.error('Error conectando MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
