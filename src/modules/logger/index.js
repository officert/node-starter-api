  const winston = require('winston');

  const logger = new(winston.Logger)({
    transports: [
      new(winston.transports.Console)({
        level: 'info',
        colorize: true
      })
    ]
  });

  class Logger {
    log(...args) {
      logger.log(...args);
    }

    debug(...args) {
      logger.info('debug', ...args);
    }

    info(...args) {
      logger.info('info', ...args);
    }

    warn(...args) {
      logger.warn('warn', ...args);
    }

    error(...args) {
      logger.error('error', ...args);
    }
  }

  module.exports = new Logger();
