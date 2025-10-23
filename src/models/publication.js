const mongoose = require('mongoose');

const PublicationSchema = new mongoose.Schema({
  link: { type: String, unique: true, required: true },
  title: String,
  price: String,
  km: String,
  year: String,
  raw: Object, // datos adicionales (opcional)
  seenAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Publication', PublicationSchema);
