const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const express = require('express');
const cors = require('cors');
const winston = require('winston');
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const config = require('config');
const notFound = require('api/middleware/notFound');
const errorHandler = require('api/middleware/errorHandler');
const logger = require('modules/logger');

class HttpServer {
  constructor() {
    this._app = express();
  }

  /**
   * @return {Promise<App>}
   */
  init() {
    return new Promise((resolve, reject) => {
      this._app.use(cors());

      this._app.use(expressWinston.logger({
        transports: [
          new winston.transports.Console({
            json: true,
            colorize: true
          })
        ],
        expressFormat: true,
        colorize: true,
      }));

      this._app.use(bodyParser.json());

      this._app.use(expressValidator({
        customValidators: {
          inHash: function(param, object) {
            if (!param || !object) return false;

            return !!object[param];
          }
        }
      }));

      this._app.get('/', (req, res) => {
        return res.status(200).json({
          env: config.env
        });
      });

      _configureEndpoints(this._app);

      this._app.use(notFound);

      this._app.use(errorHandler);

      this._httpServer = this._app.listen(config.port, err => {
        if (err) {
          return reject(err);
        } else {
          logger.info(`Http Server listening on port ${config.port}`);
          return resolve(this._app);
        }
      });
    });
  }

  /**
   * @return {Promise<App>}
   */
  shutdown() {
    return new Promise(resolve => {
      this._httpServer.close();

      logger.info('Http Server shutdown');

      return resolve(null);
    });
  }
}

function _configureEndpoints(app) {
  const endpointsDirPath = path.join(__dirname, 'endpoints');

  let files = fs.readdirSync(endpointsDirPath);

  files.map(dir => {
    if (dir !== 'base') {
      let dirPath = path.join('endpoints', dir);
      try {
        app.use(require('./' + dirPath));
      } catch (err) {
        logger.error(err);
        logger.error(`Error loading module ${dirPath}`);
      }
    }
  });
}

module.exports = new HttpServer();
