const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.simple()),
  transports: [
    new transports.Console(),
    // podes agregar File transport si queres guardar logs en disco
  ],
});

module.exports = logger;
