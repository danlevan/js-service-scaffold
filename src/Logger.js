/* istanbul ignore next */
const assert = require('assert');
/* istanbul ignore next */
const winston = require('winston');

/* istanbul ignore next */
function logger() {
  const levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  };

  const colors = {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    trace: 'blue',
  };

  const myFormat = {
    // adds error info to the log
    error: winston.format((i) => {
      const result = i;
      result.error = '';

      const err = i.err || i.error;
      if (err) {
        if (!i.message) {
          result.message = err.toString();
        }
        result.error = `\n\nError info\n----------\n${err.toString()}\n\nStack trace\n-----------\n\u001b[31m${err.stack}\u001b[39m\n\n`;
      }

      return result;
    }),
  };

  function consoleTransport({ config }) {
    assert(config && config.logger && config.logger.console, 'expected config.logger.console');

    return new winston.transports.Console({
      level: config.logger.console.level || 'info',
      levels,
      format: winston.format.combine(
        myFormat.error(),
        winston.format.colorize({ colors }),
        winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
        winston.format.printf(i => `${i.level} ${i.timestamp} \u001b[36m${i.message}\u001b[39m ${i.error}`),
      ),
    });
  }

  return winston.createLogger({
    transports: [
      consoleTransport(global.assembly),
    ],
  });
}

/* istanbul ignore next */
module.exports = logger;
